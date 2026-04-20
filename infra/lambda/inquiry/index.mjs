import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { randomUUID } from "node:crypto";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({});

const TABLE = process.env.INQUIRIES_TABLE;
const FROM_EMAIL = process.env.FROM_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;

const REQUIRED = ["name", "company", "email", "industry", "employees", "problem"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LABELS = {
  name: "Name",
  title: "Title / Role",
  company: "Company",
  email: "Email",
  phone: "Phone",
  industry: "Industry",
  employees: "Employees",
  problem: "What they're dealing with",
  dream: "Their dream tool",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const reply = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", ...corsHeaders },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders };
  }

  let data;
  try {
    data = JSON.parse(event.body ?? "{}");
  } catch {
    return reply(400, { ok: false, error: "Invalid JSON" });
  }

  for (const field of REQUIRED) {
    if (!data[field] || String(data[field]).trim() === "") {
      return reply(400, { ok: false, error: `Missing field: ${field}` });
    }
  }

  if (!EMAIL_RE.test(data.email)) {
    return reply(400, { ok: false, error: "Invalid email" });
  }

  const id = randomUUID();
  const timestamp = new Date().toISOString();
  const sourceIp = event.requestContext?.http?.sourceIp ?? null;
  const userAgent = event.requestContext?.http?.userAgent ?? null;

  const record = {
    id,
    timestamp,
    sourceIp,
    userAgent,
    name: String(data.name).trim(),
    title: data.title ? String(data.title).trim() : null,
    company: String(data.company).trim(),
    email: String(data.email).trim(),
    phone: data.phone ? String(data.phone).trim() : null,
    industry: String(data.industry).trim(),
    employees: String(data.employees).trim(),
    problem: String(data.problem).trim(),
    dream: data.dream ? String(data.dream).trim() : null,
  };

  await ddb.send(new PutCommand({ TableName: TABLE, Item: record }));

  const lines = Object.entries(FIELD_LABELS)
    .map(([key, label]) => {
      const value = record[key];
      if (!value) return null;
      return `${label}:\n${value}`;
    })
    .filter(Boolean);

  const subject = `New DIYDev inquiry — ${record.name} / ${record.company}`;
  const textBody = [
    "A new inquiry just came in:",
    "",
    ...lines.map((l) => l + "\n"),
    "---",
    `ID: ${id}`,
    `Submitted: ${timestamp}`,
    sourceIp ? `IP: ${sourceIp}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: FROM_EMAIL,
      Destination: { ToAddresses: [TO_EMAIL] },
      ReplyToAddresses: [record.email],
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Text: { Data: textBody, Charset: "UTF-8" },
          },
        },
      },
    })
  );

  return reply(200, { ok: true, id });
};

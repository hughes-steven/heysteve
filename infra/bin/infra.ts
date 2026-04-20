#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebStack } from "../lib/web-stack";
import { InquiriesStack } from "../lib/inquiries-stack";

const app = new cdk.App();

const env = {
  account: "417148398010",
  region: "ca-central-1",
};

// Optional: pass -c domain=heysteve.ca once the domain is registered.
const domain = app.node.tryGetContext("domain") as string | undefined;

// Temporary fallback while AWS verifies CloudFront access.
// Pass -c skipCloudfront=true to use S3 website hosting only.
const skipCloudfront =
  String(app.node.tryGetContext("skipCloudfront") ?? "").toLowerCase() ===
  "true";

// Destination for form submission emails.
const notificationEmail =
  (app.node.tryGetContext("notificationEmail") as string | undefined) ??
  "hughes.steven@outlook.com";

new WebStack(app, "HeysteveWeb", {
  env,
  domain,
  skipCloudfront,
  crossRegionReferences: true,
});

new InquiriesStack(app, "HeysteveInquiries", {
  env,
  notificationEmail,
});

cdk.Tags.of(app).add("Project", "heysteve");
cdk.Tags.of(app).add("Environment", "prod");
cdk.Tags.of(app).add("ManagedBy", "cdk");

app.synth();

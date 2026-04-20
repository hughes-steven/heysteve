import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import * as apigwIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as ses from "aws-cdk-lib/aws-ses";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import { Construct } from "constructs";

interface InquiriesStackProps extends cdk.StackProps {
  notificationEmail: string;
}

export class InquiriesStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: InquiriesStackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "InquiriesTable", {
      tableName: "heysteve-inquiries-prod",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const emailIdentity = new ses.EmailIdentity(this, "NotificationEmail", {
      identity: ses.Identity.email(props.notificationEmail),
    });

    const fn = new lambda.Function(this, "InquiryHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "..", "lambda", "inquiry")
      ),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        INQUIRIES_TABLE: table.tableName,
        FROM_EMAIL: props.notificationEmail,
        TO_EMAIL: props.notificationEmail,
      },
      logRetention: cdk.aws_logs.RetentionDays.ONE_MONTH,
    });

    table.grantWriteData(fn);
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail"],
        resources: [
          `arn:aws:ses:${this.region}:${this.account}:identity/${props.notificationEmail}`,
        ],
      })
    );

    const api = new apigw.HttpApi(this, "InquiryApi", {
      apiName: "heysteve-inquiries-prod",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [apigw.CorsHttpMethod.POST, apigw.CorsHttpMethod.OPTIONS],
        allowHeaders: ["Content-Type"],
      },
    });

    api.addRoutes({
      path: "/inquiries",
      methods: [apigw.HttpMethod.POST],
      integration: new apigwIntegrations.HttpLambdaIntegration(
        "InquiryIntegration",
        fn
      ),
    });

    // Rate-limit the default stage so a bot can't rack up charges.
    const defaultStage = api.defaultStage?.node.defaultChild as
      | apigw.CfnStage
      | undefined;
    if (defaultStage) {
      defaultStage.defaultRouteSettings = {
        throttlingRateLimit: 10,
        throttlingBurstLimit: 20,
      };
    }

    this.apiUrl = api.apiEndpoint;

    new cdk.CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
    new cdk.CfnOutput(this, "InquiriesEndpoint", {
      value: `${api.apiEndpoint}/inquiries`,
    });
    new cdk.CfnOutput(this, "TableName", { value: table.tableName });
    new cdk.CfnOutput(this, "EmailIdentityNote", {
      value: `Verify ${props.notificationEmail} via the link SES will email once this stack deploys.`,
    });
    // Silence unused warning; identity creation triggers SES verification email.
    void emailIdentity;
  }
}

import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as path from "path";
import { Construct } from "constructs";

interface WebStackProps extends cdk.StackProps {
  domain?: string;
  skipCloudfront?: boolean;
}

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    const siteAsset = s3deploy.Source.asset(
      path.join(__dirname, "..", "..", "site")
    );

    if (props.skipCloudfront) {
      this.buildS3WebsiteOnly(siteAsset);
      return;
    }

    this.buildCloudfront(siteAsset, props);
  }

  private buildS3WebsiteOnly(siteAsset: s3deploy.ISource) {
    const bucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: `diydev-web-prod-${this.account}`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    new s3deploy.BucketDeployment(this, "DeploySite", {
      sources: [siteAsset],
      destinationBucket: bucket,
      prune: true,
    });

    new cdk.CfnOutput(this, "BucketName", { value: bucket.bucketName });
    new cdk.CfnOutput(this, "SiteUrl", {
      value: `http://${bucket.bucketWebsiteDomainName}`,
    });
    new cdk.CfnOutput(this, "Mode", {
      value: "S3 website hosting (HTTP only — CloudFront disabled)",
    });
  }

  private buildCloudfront(siteAsset: s3deploy.ISource, props: WebStackProps) {
    const bucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: `diydev-web-prod-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    let certificate: acm.ICertificate | undefined;
    let hostedZone: route53.IHostedZone | undefined;
    const domainNames: string[] = [];

    if (props.domain) {
      hostedZone = route53.HostedZone.fromLookup(this, "Zone", {
        domainName: props.domain,
      });

      certificate = new acm.Certificate(this, "Certificate", {
        domainName: props.domain,
        subjectAlternativeNames: [`www.${props.domain}`],
        validation: acm.CertificateValidation.fromDns(hostedZone),
      });

      domainNames.push(props.domain, `www.${props.domain}`);
    }

    const distribution = new cloudfront.Distribution(this, "Cdn", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
      minimumProtocolVersion:
        cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      domainNames: domainNames.length > 0 ? domainNames : undefined,
      certificate,
      comment: "Heysteve marketing site",
    });

    const urlRewriteFunction = new cloudfront.Function(this, "UrlRewrite", {
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.includes('.')) {
    request.uri = uri + '.html';
  }
  return request;
}
      `),
    });

    const defaultBehavior = distribution.node
      .defaultChild as cloudfront.CfnDistribution;
    defaultBehavior.addPropertyOverride(
      "DistributionConfig.DefaultCacheBehavior.FunctionAssociations",
      [
        {
          EventType: "viewer-request",
          FunctionARN: urlRewriteFunction.functionArn,
        },
      ]
    );

    new s3deploy.BucketDeployment(this, "DeploySite", {
      sources: [siteAsset],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
      prune: true,
    });

    if (props.domain && hostedZone) {
      new route53.ARecord(this, "AliasApex", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution)
        ),
      });

      new route53.ARecord(this, "AliasWww", {
        zone: hostedZone,
        recordName: "www",
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(distribution)
        ),
      });
    }

    new cdk.CfnOutput(this, "BucketName", { value: bucket.bucketName });
    new cdk.CfnOutput(this, "DistributionDomain", {
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });
    if (props.domain) {
      new cdk.CfnOutput(this, "SiteUrl", {
        value: `https://${props.domain}`,
      });
    } else {
      new cdk.CfnOutput(this, "SiteUrl", {
        value: `https://${distribution.distributionDomainName}`,
      });
    }
  }
}

import { Configuration, ConfigurationError } from "@server/features/common";
import aws from "aws-sdk";

export interface ICustomContentStore {
  getContent(): Promise<string>;
  getInfo(): Promise<{ lastModified: Date }>;
}

export class CustomContentStore implements ICustomContentStore {
  private getConnection() {
    if (!Configuration.s3Account.accessKeyId || !Configuration.s3Account.secretAccessKey) {
      throw new ConfigurationError("S3 Access not configured");
    }
    return new aws.S3({ credentials: { accessKeyId: Configuration.s3Account.accessKeyId, secretAccessKey: Configuration.s3Account.secretAccessKey } });
  }

  async getInfo() {
    const connection = this.getConnection();

    if (!Configuration.s3Account.contentBucket || !Configuration.s3Account.customContentPath) {
      throw new ConfigurationError("S3 Bucket not configured");
    }

    return connection
      .headObject({ Bucket: Configuration.s3Account.contentBucket, Key: Configuration.s3Account.customContentPath })
      .promise()
      .then(x => ({ lastModified: x.LastModified! }));
  }

  async getContent() {

    const connection = this.getConnection();
    if (!Configuration.s3Account.contentBucket || !Configuration.s3Account.customContentPath) {
      throw new ConfigurationError("S3 Bucket not configured");
    }

    return connection
      .getObject({ Bucket: Configuration.s3Account.contentBucket, Key: Configuration.s3Account.customContentPath })
      .promise()
      .then(x => (x.Body && x.Body.toString() || ""))
      ;
  }
}

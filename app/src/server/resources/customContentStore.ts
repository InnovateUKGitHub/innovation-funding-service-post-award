/* eslint-disable @typescript-eslint/naming-convention */
import { configuration, ConfigurationError } from "@server/features/common";
import aws from "aws-sdk";

export interface ICustomContentStore {
  getContent(): Promise<string>;
  getInfo(): Promise<{ lastModified: Date }>;
}

export class CustomContentStore implements ICustomContentStore {
  private getConnection() {
    if (!configuration.s3Account.accessKeyId || !configuration.s3Account.secretAccessKey) {
      throw new ConfigurationError("S3 Access not configured");
    }
    return new aws.S3({ credentials: { accessKeyId: configuration.s3Account.accessKeyId, secretAccessKey: configuration.s3Account.secretAccessKey } });
  }

  async getInfo() {
    const connection = this.getConnection();

    if (!configuration.s3Account.contentBucket || !configuration.s3Account.customContentPath) {
      throw new ConfigurationError("S3 Bucket not configured");
    }

    return connection
      .headObject({ Bucket: configuration.s3Account.contentBucket, Key: configuration.s3Account.customContentPath })
      .promise()
      .then(x => ({ lastModified: x.LastModified! }));
  }

  async getContent() {

    const connection = this.getConnection();
    if (!configuration.s3Account.contentBucket || !configuration.s3Account.customContentPath) {
      throw new ConfigurationError("S3 Bucket not configured");
    }

    return connection
      .getObject({ Bucket: configuration.s3Account.contentBucket, Key: configuration.s3Account.customContentPath })
      .promise()
      .then(x => (x.Body && x.Body.toString() || ""))
      ;
  }
}

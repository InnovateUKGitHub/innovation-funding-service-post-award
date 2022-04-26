import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { configuration, ConfigurationError } from "@server/features/common";

export class CustomContentStore {
  private getConnection() {
    const { accessKeyId, secretAccessKey, contentBucket, customContentPath } = configuration.s3Account;

    if (!accessKeyId) {
      throw new ConfigurationError("S3 Access 'accessKeyId' is not configured");
    }

    if (!secretAccessKey) {
      throw new ConfigurationError("S3 Access 'secretAccessKey' is not configured");
    }

    if (!contentBucket) {
      throw new ConfigurationError("S3 Bucket - content bucket not configured");
    }

    if (!customContentPath) {
      throw new ConfigurationError("S3 Bucket - custom content path not configured");
    }

    const client: S3Client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return {
      client,
      config: {
        contentBucket,
        customContentPath,
      },
    };
  }

  public async getInfo(): Promise<{ lastModified: Date }> {
    const { client, config } = this.getConnection();

    try {
      const getCommand = new HeadObjectCommand({
        Bucket: config.contentBucket,
        Key: config.customContentPath,
      });

      const response = await client.send(getCommand);

      return { lastModified: response.LastModified! };
    } catch (error) {
      throw new Error(`S3 Query Error - Failed to HeadObject command, ${JSON.stringify(error)}`);
    }
  }

  public async getContent(): Promise<string> {
    const { client, config } = this.getConnection();

    try {
      const getCommand = new GetObjectCommand({
        Bucket: config.contentBucket,
        Key: config.customContentPath,
      });

      const response = await client.send(getCommand);

      return response.Body?.toString() ?? "";
    } catch (error) {
      throw new Error(`S3 Query Error - Failed to GetObject command, ${JSON.stringify(error)}`);
    }
  }
}

export type ICustomContentStore = Pick<CustomContentStore, "getContent" | "getInfo">;

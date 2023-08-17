import { PartialGraphQLContext } from "@gql/GraphQLContext";
import { sss } from "@server/util/salesforce-string-helpers";
import DataLoader from "dataloader";

interface FeedAttachmentData {
  totalSize: number;
  done: boolean;
  records: FeedAttachmentRecord[];
}

interface FeedAttachmentRecord {
  Id: string;
  RecordId: string;
}

/**
 * Get an instance of the Feed Attachment dataloader, which batches requests to fetch feed attachments
 *
 * @param ctx The Salesforce Context
 * @returns A dataloader that fetches the user for each username
 */
const getFeedAttachmentDataLoader = (ctx: PartialGraphQLContext) => {
  return new DataLoader<string, FeedAttachmentRecord | null>(
    async contentDocumentIds => {
      const data = await ctx.adminApi.executeSOQL<FeedAttachmentData>({
        query: `SELECT Id, RecordId FROM FeedAttachment WHERE RecordId IN ('${contentDocumentIds
          .map(sss)
          .join("','")}')`,
      });

      return contentDocumentIds.map(
        contentDocumentIds => data.records.find(x => x.RecordId === contentDocumentIds) ?? null,
      );
    },
    { maxBatchSize: 20 },
  );
};

export { getFeedAttachmentDataLoader };

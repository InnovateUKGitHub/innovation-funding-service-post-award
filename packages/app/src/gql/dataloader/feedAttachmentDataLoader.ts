import { PartialGraphQLContext } from "@gql/GraphQLContext";
import { sss } from "@innovateuk/common/salesforceStringHelpers";
import { CachedDataloaderFactory } from "@server/dataloaderCache";
import { DataloaderNotFoundError } from "@server/repositories/errors";

interface FeedAttachmentRecord {
  Id: string;
  RecordId: string;
}

const chatterDocumentCache = new CachedDataloaderFactory<FeedAttachmentRecord>({
  dataloaderOptions: { maxBatchSize: 20 },
});

/**
 * Get an instance of the Feed Attachment dataloader, which batches requests to fetch feed attachments
 *
 * @param ctx The Salesforce Context
 * @returns A dataloader that fetches the user for each username
 */
const getFeedAttachmentDataLoader = (ctx: PartialGraphQLContext) =>
  chatterDocumentCache.getDataloader(ctx.email, async contentDocumentIds => {
    const data = await ctx.adminApi.executeSOQL<FeedAttachmentRecord>({
      query: `SELECT Id, RecordId FROM FeedAttachment WHERE RecordId IN ('${contentDocumentIds.map(sss).join("','")}')`,
    });

    return contentDocumentIds.map(
      key =>
        data.records.find(x => x.RecordId === key) ??
        new DataloaderNotFoundError({
          name: "Chatter Document",
          key,
        }),
    );
  });

export { getFeedAttachmentDataLoader };

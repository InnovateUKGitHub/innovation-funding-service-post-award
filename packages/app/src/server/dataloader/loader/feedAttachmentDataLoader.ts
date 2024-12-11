import { sss } from "@innovateuk/common/salesforceStringHelpers";
import { CachedDataloader } from "@server/dataloader/dataloaderCache";
import { DataloaderParams } from "../dataloader.logic";

interface FeedAttachmentRecord {
  Id: string;
  RecordId: string;
}

const chatterDocumentCache = new CachedDataloader<FeedAttachmentRecord[]>({
  dataloaderOptions: { maxBatchSize: 20 },
});

/**
 * Get an instance of the Feed Attachment dataloader, which batches requests to fetch feed attachments
 *
 * @param ctx The Salesforce Context
 * @returns A dataloader that fetches the user for each username
 */
const getFeedAttachmentDataLoader = (ctx: DataloaderParams) =>
  chatterDocumentCache.getDataloader(ctx.email, async contentDocumentIds => {
    const data = await ctx.api.executeSOQL<FeedAttachmentRecord>({
      query: `SELECT Id, RecordId FROM FeedAttachment WHERE RecordId IN ('${contentDocumentIds.map(sss).join("','")}')`,
    });

    return contentDocumentIds.map(key => data.records.filter(x => x.RecordId === key));
  });

export { getFeedAttachmentDataLoader };

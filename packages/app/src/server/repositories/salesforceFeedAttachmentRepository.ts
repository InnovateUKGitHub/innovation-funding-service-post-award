import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { getFeedAttachmentDataLoader } from "@server/dataloader/loader/feedAttachmentDataLoader";
import { getRecord } from "@server/dataloader/dataloader.logic";

export interface ISalesforceFeedAttachment {
  Id: string;
  RecordId: string;
}

export interface ISalesforceFeedRepository {
  getAll(): Promise<ISalesforceFeedAttachment[]>;
  getAllByRecordId(id: string): Promise<ISalesforceFeedAttachment[]>;
  getAllByRecordIds(id: string[]): Promise<ISalesforceFeedAttachment[]>;
}

export class SalesforceFeedAttachmentRepository
  extends SalesforceRepositoryBase<ISalesforceFeedAttachment>
  implements ISalesforceFeedRepository
{
  protected readonly salesforceObjectName = "FeedAttachment";
  protected readonly salesforceFieldNames = ["Id", "RecordId"];

  private getDataloader() {
    const conn = this.getSalesforceConnection();
    return getFeedAttachmentDataLoader({ email: conn.email, api: conn });
  }

  getAll() {
    return super.all();
  }

  async getAllByRecordId(id: string) {
    const ddl = this.getDataloader();
    return await ddl.load(id);
  }

  async getAllByRecordIds(ids: string[]): Promise<ISalesforceFeedAttachment[]> {
    const ddl = this.getDataloader();
    const records = await ddl.loadMany(ids);
    return records.filter(getRecord).flat();
  }
}

import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceFeedAttachment {
  Id: string;
  RecordId: string;
}

export interface ISalesforceFeedRepository {
  getAll(): Promise<ISalesforceFeedAttachment[]>;
  getAllByRecordId(id: string): Promise<ISalesforceFeedAttachment[]>;
}

export class SalesforceFeedAttachmentRepository
  extends SalesforceRepositoryBase<ISalesforceFeedAttachment>
  implements ISalesforceFeedRepository
{
  protected readonly salesforceObjectName = "FeedAttachment";
  protected readonly salesforceFieldNames = ["Id", "RecordId"];

  getAll() {
    return super.all();
  }

  getAllByRecordId(id: string) {
    return super.where(`RecordId = '${sss(id)}'`);
  }

  async getAllByRecordIds(ids: string[]): Promise<ISalesforceFeedAttachment[]> {
    const records = await this.batchRequest(ids, idBatch => {
      return super.where(`RecordId IN ('${idBatch.map(sss).join("','")}')`);
    });

    return records.flat();
  }
}

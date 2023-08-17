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

  getAllByRecordIds(ids: string[]) {
    return super.where(`RecordId IN ('${ids.map(sss).join("','")}')`);
  }
}

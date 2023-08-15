import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceFeedItem {
  Id: string;
  Body: string;
}

export interface ISalesforceFeedRepository {
  getAll(): Promise<ISalesforceFeedItem[]>;
  getById(linkedEntityId: string): Promise<ISalesforceFeedItem[]>;
}

export class SalesforceFeedItemRepository
  extends SalesforceRepositoryBase<ISalesforceFeedItem>
  implements ISalesforceFeedRepository
{
  protected readonly salesforceObjectName = "FeedItem";

  protected readonly salesforceFieldNames = ["Id", "Body"];

  getAll() {
    return super.all();
  }

  getById(linkedEntityId: string) {
    return super.where(`ParentId = '${sss(linkedEntityId)}'`);
  }
}

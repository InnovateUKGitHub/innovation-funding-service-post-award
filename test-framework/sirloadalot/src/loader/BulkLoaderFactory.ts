import { ApiName, BulkLoadableApiName } from "../enum/ApiName";
import { IBaseLoader } from "./BaseLoader";
import { BulkLoader } from "./BulkLoader";
import { LoaderManager } from "../LoaderManager";

type LoaderFactoryProps = Pick<IBaseLoader, "manager" | "prefix" | "startDate">;

class LoaderFactory {
  private commonProps: LoaderFactoryProps;

  constructor(commonProps: LoaderFactoryProps) {
    this.commonProps = commonProps;
  }

  getLoader(apiName: BulkLoadableApiName) {
    let props: IBaseLoader;

    switch (apiName) {
      case ApiName.Competition:
        props = {
          apiName: ApiName.Competition,
          relationshipMap: new Map(),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.Account:
        props = {
          apiName: ApiName.Account,
          relationshipMap: new Map(),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.Contact:
        props = {
          apiName: ApiName.Contact,
          relationshipMap: new Map([[ApiName.Account, "AccountId"]]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.ProjectParticipant:
        props = {
          apiName: ApiName.ProjectParticipant,
          relationshipMap: new Map([
            [ApiName.Project, "Acc_ProjectId__c"],
            [ApiName.Account, "Acc_AccountId__c"],
          ]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.Project:
        props = {
          apiName: ApiName.Project,
          externalId: "Acc_ProjectNumber__c",
          relationshipMap: new Map([
            [ApiName.Competition, "Acc_CompetitionId__c"],
          ]),
          operation: "upsert",
          ...this.commonProps,
        };
        break;
      case ApiName.ProjectContactLink:
        props = {
          apiName: ApiName.ProjectContactLink,
          relationshipMap: new Map([
            [ApiName.Project, "Acc_ProjectId__c"],
            [ApiName.Account, "Acc_AccountId__c"],
            [ApiName.Contact, "Acc_ContactId__c"],
          ]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.User:
        props = {
          apiName: ApiName.User,
          relationshipMap: new Map([[ApiName.Contact, "ContactId"]]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.Profile:
        props = {
          apiName: ApiName.Profile,
          relationshipMap: new Map([
            [ApiName.ProjectParticipant, "Acc_ProjectParticipant__c"],
          ]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.MonitoringAnswer:
        props = {
          apiName: ApiName.MonitoringAnswer,
          relationshipMap: new Map([
            [ApiName.MonitoringAnswer, "Acc_MonitoringHeader__c"],
            [ApiName.Project, "Acc_Project__c"],
          ]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.Claim:
        props = {
          apiName: ApiName.Claim,
          relationshipMap: new Map([
            [ApiName.ProjectParticipant, "Acc_ProjectParticipant__c"],
          ]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      case ApiName.ProjectChangeRequest:
        props = {
          apiName: ApiName.ProjectChangeRequest,
          relationshipMap: new Map([
            [ApiName.ProjectChangeRequest, "Acc_RequestHeader__c"],
            [ApiName.Project, "Acc_Project__c"],
          ]),
          operation: "insert",
          ...this.commonProps,
        };
        break;
      default:
        throw new Error(`Cannot construct a BulkLoader for type ${apiName}`);
    }

    return new BulkLoader(props);
  }
}

export { LoaderFactory };

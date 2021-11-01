import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { BroadcastMapper } from "./mappers/broadcastMapper";
import { SalesforceRepositoryBaseWithMapping } from "./salesforceRepositoryBase";

export interface ISalesforceBroadcast {
  Id: string;
  Name: string;
  Acc_StartDate__c: string;
  Acc_EndDate__c: string;
  Acc_Message__c: string;
}

export class BroadcastRepository extends SalesforceRepositoryBaseWithMapping<ISalesforceBroadcast, BroadcastDto> {
  protected readonly salesforceObjectName = "Acc_BroadcastMessage__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Name",
    "Acc_StartDate__c",
    "Acc_EndDate__c",
    "Acc_Message__c",
  ];

  protected mapper = new BroadcastMapper();

  public getAll(): Promise<BroadcastDto[]> {
    const fromStartDate = "Acc_StartDate__c <= Today";
    const beforeEndDate = "Acc_EndDate__c >= Today";

    const withinDateRange = `${fromStartDate} AND ${beforeEndDate}`;

    return super.where(withinDateRange);
  }
}

export type IBroadcastRepository = Pick<BroadcastRepository, "getAll">;

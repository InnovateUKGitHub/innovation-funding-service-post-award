import { ClaimDetailKey } from "@framework/types";
import { ILogger } from "@server/features/common";
import { sss } from "@server/util/salesforce-string-helpers";
import { Connection } from "jsforce";
import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";

export interface ISalesforceClaimDetails {
  Id: string;
  Acc_ProjectParticipant__r: {
    Id: string;
    Acc_ProjectId__c: string;
  };
  Acc_CostCategory__c: string;
  Acc_PeriodCostCategoryTotal__c: number;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_ReasonForDifference__c: string | null;
}

export interface IClaimDetailsRepository {
  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
  get(key: ClaimDetailKey): Promise<ISalesforceClaimDetails | null>;
  getAllByPartner(partnerId: string): Promise<ISalesforceClaimDetails[]>;
  update(item: Updatable<ISalesforceClaimDetails>): Promise<boolean>;
  insert(insert: Partial<ISalesforceClaimDetails>): Promise<string>;
}

/**
 * Claim details are from the Acc_Claims__c table at the "Claims Detail" level.
 *
 * Claim amounts stored per cost category per claim and are summed from the Claim Line items
 * A text field for comments
 */
export class ClaimDetailsRepository
  extends SalesforceRepositoryBase<ISalesforceClaimDetails>
  implements IClaimDetailsRepository {
  constructor(
    private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>,
    getSalesforceConnection: () => Promise<Connection>,
    logger: ILogger,
  ) {
    super(getSalesforceConnection, logger);
  }

  private readonly recordType: string = "Claims Detail";

  protected readonly salesforceObjectName = "Acc_Claims__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_CostCategory__c",
    "Acc_PeriodCostCategoryTotal__c",
    "Acc_ProjectParticipant__r.Id",
    "Acc_ProjectParticipant__r.Acc_ProjectId__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectPeriodStartDate__c",
    "Acc_ProjectPeriodEndDate__c",
    "Acc_ReasonForDifference__c",
  ];

  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${sss(partnerId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
      AND Acc_ProjectPeriodNumber__c = ${sss(periodId)}
      AND Acc_ClaimStatus__c != 'New'
      AND Acc_CostCategory__c != null
    `;
    return super.where(filter);
  }

  get(claimDetailKey: ClaimDetailKey): Promise<ISalesforceClaimDetails | null> {
    const { projectId, partnerId, periodId, costCategoryId } = claimDetailKey;
    const filter = `
      Acc_ProjectParticipant__r.Acc_ProjectId__c = '${sss(projectId)}'
      AND Acc_ProjectParticipant__c = '${sss(partnerId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
      AND Acc_ProjectPeriodNumber__c = ${sss(periodId)}
      AND Acc_CostCategory__c = '${sss(costCategoryId)}'
      AND Acc_ClaimStatus__c != 'New'
    `;
    return super.filterOne(filter);
  }

  getAllByPartner(partnerId: string): Promise<ISalesforceClaimDetails[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${sss(partnerId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
      AND Acc_ClaimStatus__c != 'New'
      AND Acc_CostCategory__c != null
      `;
    return super.where(filter);
  }

  update(item: Updatable<ISalesforceClaimDetails>) {
    return super.updateItem(item);
  }

  async insert(item: Partial<ISalesforceClaimDetails>) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const RecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const salesforceUpdate: Partial<{
      Acc_ProjectParticipant__c: string;
      Acc_CostCategory__c: string;
      Acc_PeriodCostCategoryTotal__c: number;
      Acc_ProjectPeriodNumber__c: number;
      Acc_ReasonForDifference__c: string | null;
      RecordTypeId: string;
    }> = {
      Acc_ProjectParticipant__c: item.Acc_ProjectParticipant__r && item.Acc_ProjectParticipant__r.Id,
      Acc_CostCategory__c: item.Acc_CostCategory__c,
      Acc_PeriodCostCategoryTotal__c: item.Acc_PeriodCostCategoryTotal__c,
      Acc_ProjectPeriodNumber__c: item.Acc_ProjectPeriodNumber__c,
      Acc_ReasonForDifference__c: item.Acc_ReasonForDifference__c,
      RecordTypeId,
    };

    return super.insertItem(salesforceUpdate);
  }
}

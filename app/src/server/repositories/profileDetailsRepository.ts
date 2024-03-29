import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";

export interface ISalesforceProfileDetails {
  Id: string;
  Acc_CostCategory__c: string;
  Acc_InitialForecastCost__c: number;
  Acc_LatestForecastCost__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
}

/**
 * Forecast Details for partner per cost category per period
 *
 * ie amount a partner expects to spend in that period for each cost category
 *
 * Stored in "Acc_Profile__c" table with record type of "Profile Detail"
 */
export class ProfileDetailsRepository extends SalesforceRepositoryBase<ISalesforceProfileDetails> {
  private readonly recordType: string = "Profile Detail";
  private readonly requiredCategoryType: string = "Total Cost Category";

  protected readonly salesforceObjectName = "Acc_Profile__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_CostCategory__c",
    "Acc_InitialForecastCost__c",
    "Acc_LatestForecastCost__c",
    "Acc_ProjectParticipant__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectPeriodStartDate__c",
    "Acc_ProjectPeriodEndDate__c",
  ];

  public async getAllByPartner(partnerId: PartnerId): Promise<ISalesforceProfileDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${sss(partnerId)}' AND RecordType.Name = '${sss(
      this.recordType,
    )}' AND Acc_CostCategory__c != null`;
    return super.where(filter);
  }

  public async getById(
    partnerId: PartnerId,
    periodId: number,
    costCategoryId: CostCategoryId,
  ): Promise<ISalesforceProfileDetails> {
    const filter = `
      Acc_ProjectParticipant__c = '${sss(partnerId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
      AND Acc_ProjectPeriodNumber__c >= ${sss(periodId)}
      AND Acc_CostCategory__c = '${sss(costCategoryId)}'
    `;
    return super.where(filter).then(res => (res && res[0]) || null);
  }

  public async getRequiredCategories(partnerId: PartnerId): Promise<ISalesforceProfileDetails[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${sss(partnerId)}'
      AND RecordType.Name = '${sss(this.requiredCategoryType)}'
    `;
    return super.where(filter);
  }

  public async update(profileDetails: Updatable<ForecastDetailsDTO>[]): Promise<boolean> {
    return super.updateAll(profileDetails);
  }
}

export type IProfileDetailsRepository = Pick<
  ProfileDetailsRepository,
  "getAllByPartner" | "getById" | "getRequiredCategories" | "update"
>;

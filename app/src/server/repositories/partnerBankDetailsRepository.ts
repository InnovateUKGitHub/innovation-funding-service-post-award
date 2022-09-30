import { PartnerBankDetails } from "@framework/entities/partner";
import { SalesforcePartnerBankDetailsMapper } from "./mappers/partnerBankDetailsMapper";
import { SalesforceRepositoryBaseWithMapping } from "./salesforceRepositoryBase";

export interface ISalesforceBankPartnerDetails {
  Id: string;
  Acc_SortCode__c: string;
  Acc_AccountNumber__c: string;
  Acc_AddressBuildingName__c: string;
  Acc_AddressLocality__c: string;
  Acc_AddressPostcode__c: string;
  Acc_AddressStreet__c: string;
  Acc_AddressTown__c: string;
  Acc_FirstName__c: string;
  Acc_LastName__c: string;
  Acc_RegistrationNumber__c: string;
  Acc_AccountId__r: {
    Id: string;
    Name: string;
  } | null;
}

export interface IPartnerBankDetailsRepository {
  getById(partnerId: string): Promise<PartnerBankDetails>;
}

/**
 * A repository for fetching a single partner's bank details.
 * Fetching more than one is not allowed, and should not be performed.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
export class PartnerBankDetailsRepository
  extends SalesforceRepositoryBaseWithMapping<ISalesforceBankPartnerDetails, PartnerBankDetails>
  implements IPartnerBankDetailsRepository
{
  protected readonly salesforceObjectName = "Acc_ProjectParticipant__c";

  // Only the field names relevant to fetching bank details.
  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_AccountId__r.Id",
    "Acc_AccountId__r.Name",
    "Acc_SortCode__c",
    "Acc_AccountNumber__c",
    "Acc_AddressBuildingName__c",
    "Acc_AddressLocality__c",
    "Acc_AddressPostcode__c",
    "Acc_AddressStreet__c",
    "Acc_AddressTown__c",
    "Acc_FirstName__c",
    "Acc_LastName__c",
    "Acc_RegistrationNumber__c",
    "Acc_AccountId__r",
  ];

  mapper = new SalesforcePartnerBankDetailsMapper();

  getById(partnerId: string) {
    return super.loadItem({ Id: partnerId });
  }
}

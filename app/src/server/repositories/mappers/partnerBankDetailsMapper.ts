import { PartnerBankDetails } from "@framework/entities";
import { ISalesforceBankPartnerDetails } from "../partnerBankDetailsRepository";
import { ISalesforcePartner } from "../partnersRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

/**
 * Maps partner bank details from Salesforce to its equivalent PartnerBankDetails
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
export class SalesforcePartnerBankDetailsMapper extends SalesforceBaseMapper<ISalesforcePartner, PartnerBankDetails> {
  public map(item: ISalesforceBankPartnerDetails): PartnerBankDetails {
    return {
      id: item.Id,
      accountId: (item.Acc_AccountId__r && item.Acc_AccountId__r.Id) || "",
      accountPostcode: item.Acc_AddressPostcode__c,
      accountStreet: item.Acc_AddressStreet__c,
      accountBuilding: item.Acc_AddressBuildingName__c,
      accountLocality: item.Acc_AddressLocality__c,
      accountTownOrCity: item.Acc_AddressTown__c,
      accountNumber: item.Acc_AccountNumber__c,
      sortCode: item.Acc_SortCode__c,
      firstName: item.Acc_FirstName__c,
      lastName: item.Acc_LastName__c,
      companyNumber: item.Acc_RegistrationNumber__c,
    };
  }
}

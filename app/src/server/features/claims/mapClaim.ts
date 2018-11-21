import { ISalesforceClaim } from "../../repositories/claimsRepository";
import { IContext } from "../common/context";
import { ISalesforceProfileTotalPeriod } from "../../repositories";
import { ClaimDto, ClaimStatus } from "../../../types";

const SALESFORCE_DATE_FORMAT = "yyyy-MM-dd";
const SALESFORCE_DATE_TIME_FORMAT = "yyyy-MM-ddTHH:mm:ss.SSSZZZ";

const STATUS_ALLOWING_IAR_EDIT = [
  ClaimStatus.NEW,
  ClaimStatus.DRAFT,
  ClaimStatus.MO_QUERIED,
  ClaimStatus.INNOVATE_QUERIED,
  // TODO validate these two
  ClaimStatus.REVIEWING_FORECASTS,
  ClaimStatus.AWAITING_IAR
];

export default (context: IContext) => (claim: ISalesforceClaim, forecast?: ISalesforceProfileTotalPeriod): ClaimDto => ({
  id: claim.Id,
  partnerId: claim.Acc_ProjectParticipant__c,
  lastModifiedDate: context.clock.parse(claim.LastModifiedDate, SALESFORCE_DATE_TIME_FORMAT)!,
  status: claim.Acc_ClaimStatus__c,
  periodStartDate: context.clock.parse(claim.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT)!,
  periodEndDate: context.clock.parse(claim.Acc_ProjectPeriodEndDate__c,SALESFORCE_DATE_FORMAT)!,
  periodId: claim.Acc_ProjectPeriodNumber__c,
  totalCost: claim.Acc_ProjectPeriodCost__c,
  forecastCost: forecast && forecast.Acc_PeriodInitialForecastCost__c || 0,
  forecastLastModified: context.clock.parse(forecast && forecast.LastModifiedDate, SALESFORCE_DATE_FORMAT)!,
  approvedDate: claim.Acc_ApprovedDate__c === null ? null : context.clock.parse(claim.Acc_ApprovedDate__c, SALESFORCE_DATE_FORMAT),
  paidDate: claim.Acc_PaidDate__c === null ? null : context.clock.parse(claim.Acc_PaidDate__c, SALESFORCE_DATE_FORMAT),
  comments: claim.Acc_LineItemDescription__c,
  isIarRequired: claim.Acc_IARRequired__c,
  allowIarEdit: STATUS_ALLOWING_IAR_EDIT.indexOf(claim.Acc_ClaimStatus__c) >= 0
});

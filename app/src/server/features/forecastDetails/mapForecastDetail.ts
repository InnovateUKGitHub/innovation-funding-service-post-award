import {IContext} from "../common/context";
import {ForecastDetailsDTO} from "../../../ui/models";
import {ISalesforceProfileDetails} from "../../repositories";

const SALESFORCE_DATE_FORMAT = "yyyy-MM-dd";

export default (context: IContext) => (forecastDetail: ISalesforceProfileDetails): ForecastDetailsDTO => ({
  id: forecastDetail.Id,
  costCategoryId: forecastDetail.Acc_CostCategory__c,
  periodId: forecastDetail.Acc_ProjectPeriodNumber__c,
  periodStart: context.clock.parse(forecastDetail.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT),
  periodEnd: context.clock.parse(forecastDetail.Acc_ProjectPeriodEndDate__c, SALESFORCE_DATE_FORMAT),
  value: forecastDetail.Acc_LatestForecastCost__c
});

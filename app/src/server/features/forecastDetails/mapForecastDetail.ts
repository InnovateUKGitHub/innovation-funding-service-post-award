import { ForecastDetailsDTO, IContext } from "@framework/types";
import { ISalesforceProfileDetails } from "../../repositories";
import { salesforceDateFormat } from "../common";

const mapCommon = (
  context: IContext,
  forecastDetail: ISalesforceProfileDetails,
): Pick<ForecastDetailsDTO, Exclude<keyof ForecastDetailsDTO, "value">> => ({
  id: forecastDetail.Id,
  costCategoryId: forecastDetail.Acc_CostCategory__c,
  periodId: forecastDetail.Acc_ProjectPeriodNumber__c,
  periodStart: context.clock.parse(forecastDetail.Acc_ProjectPeriodStartDate__c, salesforceDateFormat),
  periodEnd: context.clock.parse(forecastDetail.Acc_ProjectPeriodEndDate__c, salesforceDateFormat),
});

export const mapLatestForecastDetail =
  (context: IContext) =>
  (forecastDetail: ISalesforceProfileDetails): ForecastDetailsDTO => ({
    ...mapCommon(context, forecastDetail),
    value: forecastDetail.Acc_LatestForecastCost__c,
  });

export const mapInitialForecastDetail =
  (context: IContext) =>
  (forecastDetail: ISalesforceProfileDetails): ForecastDetailsDTO => ({
    ...mapCommon(context, forecastDetail),
    value: forecastDetail.Acc_InitialForecastCost__c,
  });

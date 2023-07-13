import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { IContext } from "@framework/types/IContext";
import { salesforceDateFormat } from "@framework/util/clock";
import { roundCurrencyDown } from "@framework/util/numberHelper";
import { ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";

const mapCommon = (
  context: IContext,
  forecastDetail: ISalesforceProfileDetails,
): Pick<ForecastDetailsDTO, Exclude<keyof ForecastDetailsDTO, "value">> => ({
  id: forecastDetail.Id,
  costCategoryId: forecastDetail.Acc_CostCategory__c,
  periodId: forecastDetail.Acc_ProjectPeriodNumber__c as PeriodId,
  periodStart: context.clock.parse(forecastDetail.Acc_ProjectPeriodStartDate__c, salesforceDateFormat),
  periodEnd: context.clock.parse(forecastDetail.Acc_ProjectPeriodEndDate__c, salesforceDateFormat),
});

export const mapLatestForecastDetail =
  (context: IContext) =>
  (forecastDetail: ISalesforceProfileDetails): ForecastDetailsDTO => ({
    ...mapCommon(context, forecastDetail),
    value: roundCurrencyDown(forecastDetail.Acc_LatestForecastCost__c),
  });

export const mapInitialForecastDetail =
  (context: IContext) =>
  (forecastDetail: ISalesforceProfileDetails): ForecastDetailsDTO => ({
    ...mapCommon(context, forecastDetail),
    value: roundCurrencyDown(forecastDetail.Acc_InitialForecastCost__c),
  });

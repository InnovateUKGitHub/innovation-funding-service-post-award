import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { multiplyCurrency, roundCurrency, validCurrencyRegex } from "@framework/util/numberHelper";
import { useMemo } from "react";
import { ClaimStatusGroup, getClaimStatusGroup } from "./getForecastHeaderContent";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { CostCategoryType } from "@framework/constants/enums";

type ProfileInfo = Pick<ForecastDetailsDTO, "value" | "costCategoryId" | "periodId" | "id">;
type ClaimDetailInfo = Pick<ClaimDetailsDto, "value" | "costCategoryId" | "periodId">;

export interface MapToForecastTableProps {
  project: Pick<ProjectDto, "numberOfPeriods">;
  partner: Pick<PartnerDtoGql, "overheadRate">;
  claims: Pick<
    ClaimDto,
    | "periodId"
    | "iarStatus"
    | "isIarRequired"
    | "isApproved"
    | "status"
    | "periodStartDate"
    | "periodEndDate"
    | "isFinalClaim"
  >[];
  claimDetails: ClaimDetailInfo[];
  costCategories: GOLCostDto[];
  profiles: ProfileInfo[];
  clientProfiles?: Record<string, string>;
}

interface BaseCellData {
  periodId: number;
  value: number;
  rhc: boolean;
}

interface StatusCell {
  group: ClaimStatusGroup;
  colSpan: number;
  rhc: boolean;
}

interface CostCategoryCellData extends BaseCellData {
  forecastMode: boolean;
  calculatedField: boolean;
  displayValue: string;
  profileId: string;
}

interface TotalCellData extends BaseCellData {
  periodStart: Date;
  periodEnd: Date;
  iarDue: boolean;
}

interface TableCraftRow {
  golCost: number;
  total: number;
  difference: number;
}

interface CostCategoryRow extends TableCraftRow {
  costCategoryId: string;
  costCategoryName: string;
  profiles: CostCategoryCellData[];
  greaterThanAllocatedCosts: boolean;
}

interface TotalRow extends TableCraftRow {
  profiles: TotalCellData[];
}

export interface ForecastTableDto {
  costCategories: CostCategoryRow[];
  totalRow: TotalRow;
  statusRow: StatusCell[];
  finalClaimPeriodId: number | null;
}

const mapToForecastTableDto = ({
  project,
  partner,
  claims,
  claimDetails,
  costCategories,
  profiles,
  clientProfiles,
}: MapToForecastTableProps): ForecastTableDto => {
  const costCatAccum: CostCategoryRow[] = [];
  const periodTotals: TotalCellData[] = [];
  const statusCells: StatusCell[] = [];
  const nonForecastClaims = claims.filter(x => getClaimStatusGroup(x.status) !== ClaimStatusGroup.FORECAST);
  const finalClaim = nonForecastClaims.find(claim => claim.isFinalClaim);

  let grandTotal = 0;
  let grandGolValue = 0;

  let currentStatusCell: StatusCell | undefined = undefined;

  /**
   * Calculate the COLSPAN of each status cell.
   * For each period in our project, if the status of this claim is the same
   * as the status of the next claim, we can increase the colspan by 1.
   *
   * If the status of the next claim is not the same as the status of the
   * next claim. we shall create a new cell to represent the group of statuses.
   *
   * Should look something like this...
   *
   * ```
   * | P1  | P2  | P3       | P4  | P5  |
   * | Claimed   | Claiming | Forecast  |
   * ```
   */

  for (let i = 1; i <= project.numberOfPeriods; i++) {
    const claim = claims.find(x => x.periodId === i);
    const nextClaim = claims.find(x => x.periodId === i + 1);
    let drawRhc = false;

    // If we haven't got a "current status cell",
    // initialise it with the status of our first claim.
    if (!currentStatusCell && claim) {
      currentStatusCell = {
        colSpan: 1,
        rhc: false,
        group: getClaimStatusGroup(claim.status),
      };
    }

    // If we have a previous status cell
    if (currentStatusCell) {
      // And a next claim exists,
      if (nextClaim) {
        const nextClaimGroup = getClaimStatusGroup(nextClaim.status);

        // If it's a part of the same claim, we should extend the colspan of the column.
        if (currentStatusCell.group === nextClaimGroup) {
          currentStatusCell.colSpan += 1;
        } else {
          // If it's not a part of the same claim, we should mark it as requiring a right-hand-column
          currentStatusCell.rhc = true;
          drawRhc = true;
          statusCells.push(currentStatusCell);

          // Create a new status cell with the status of the next claim
          currentStatusCell = {
            colSpan: 1,
            rhc: false,
            group: nextClaimGroup,
          };
        }
      } else {
        // If there is no next claim, we should push the
        // current claim status colspan to the array.
        statusCells.push(currentStatusCell);
      }
    }

    // Initialise the period total for periodId `i`
    periodTotals.push({
      periodId: i,
      value: 0,
      iarDue: !!claim?.isIarRequired,
      periodStart: claim?.periodStartDate ?? new Date(NaN),
      periodEnd: claim?.periodEndDate ?? new Date(NaN),
      rhc: drawRhc,
    });
  }

  const labourCostCategory = costCategories.find(x => x.type === CostCategoryType.Labour);

  for (const costCategory of costCategories) {
    const costCategoryProfiles: CostCategoryCellData[] = [];
    let total = 0;

    for (let i = 1; i <= project.numberOfPeriods; i++) {
      const forecastProfile = profiles.find(x => x.periodId === i && x.costCategoryId === costCategory.costCategoryId);
      const labourProfile = labourCostCategory
        ? profiles.find(x => x.periodId === i && x.costCategoryId === labourCostCategory.costCategoryId)
        : undefined;
      const claimProfile = claimDetails.find(x => x.periodId === i && x.costCategoryId === costCategory.costCategoryId);
      const claim = claims.find(x => x.periodId === i);

      const forecast =
        !finalClaim && !!claim && [ClaimStatusGroup.FORECAST].includes(getClaimStatusGroup(claim.status));

      /**
       * Case A:
       *  If overheads is enabled, multiply the overheads rate by the labour profile value.
       * Case B:
       *  If forecasting is enabled, and the client has modified the profile,
       *  populate the value of the table with the client's value.
       * Case C:
       *  If forecasting is enabled, and the client has not modified the value,
       *  populate the value with the forecast value.
       * Case D:
       *  If forecasting is disabled, populate the value with the claim value
       * Case E:
       *  Populate the field with "0".
       *  This should never happen.
       */
      let value: number = 0;
      let displayValue: string = "";
      let profileId = "";
      let calculatedField = false;

      if (forecast && forecastProfile) {
        if (costCategory.type === CostCategoryType.Overheads && labourProfile && partner.overheadRate !== null) {
          // TODO: Round the values in a way that is agreed by the business.
          // We shouldn't be having weird rounding here.

          if (clientProfiles) {
            const clientProfile: string | undefined = clientProfiles?.[labourProfile.id];
            const numberComponent = validCurrencyRegex.exec(clientProfile)?.[1] ?? "";
            value = multiplyCurrency(parseFloat(numberComponent), partner.overheadRate, 1);
            displayValue = isNaN(value) ? "" : String(value);
          } else {
            value = multiplyCurrency(labourProfile.value, partner.overheadRate, 1);
            displayValue = String(value);
          }
          profileId = forecastProfile.id;
          calculatedField = true;
        } else {
          if (clientProfiles) {
            const clientProfile: string | undefined = clientProfiles?.[forecastProfile.id];
            const numberComponent = validCurrencyRegex.exec(clientProfile)?.[1] ?? "";
            value = parseFloat(numberComponent);
            displayValue = clientProfile;
          } else {
            value = roundCurrency(forecastProfile.value);
            displayValue = String(value);
          }
          profileId = forecastProfile.id;
        }
      } else if (claimProfile) {
        value = roundCurrency(claimProfile.value);
        displayValue = String(value);
      }

      costCategoryProfiles.push({
        periodId: i,
        value,
        displayValue,
        forecastMode: forecast,
        calculatedField,
        profileId,
        rhc: periodTotals[i - 1].rhc,
      });

      // If our current value for this cell exists,
      // fill up our period total/cost category total/grand total
      if (isFinite(value) && !isNaN(value)) {
        periodTotals[i - 1].value = roundCurrency(value + periodTotals[i - 1].value);
        grandTotal = roundCurrency(value + grandTotal);
        total = roundCurrency(value + total);
      }
    }

    grandGolValue += costCategory.value;

    const costCategoryRow: CostCategoryRow = {
      costCategoryId: costCategory.costCategoryId,
      costCategoryName: costCategory.costCategoryName,
      golCost: costCategory.value,
      profiles: costCategoryProfiles,
      total,
      greaterThanAllocatedCosts: total > costCategory.value,
      difference:
        costCategory.value < 0.01 // If denominator is very small, show 0% difference.
          ? 0
          : 100 * ((total - costCategory.value) / costCategory.value),
    };

    costCatAccum.push(costCategoryRow);
  }

  return {
    costCategories: costCatAccum,
    totalRow: {
      profiles: periodTotals,
      total: grandTotal,
      golCost: grandGolValue,
      difference: 100 * ((grandTotal - grandGolValue) / grandGolValue),
    },
    statusRow: statusCells,
    finalClaimPeriodId: finalClaim?.periodId ?? null,
  };
};

const useMapToForecastTableDto = (props: MapToForecastTableProps): ForecastTableDto => {
  // Memoise our data...
  // With so much calculation, it's probably a good idea.
  return useMemo(() => mapToForecastTableDto(props), [props]);
};

export { mapToForecastTableDto, useMapToForecastTableDto };

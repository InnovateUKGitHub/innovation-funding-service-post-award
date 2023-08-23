import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { useMemo } from "react";
import { ClaimStatusGroup, getClaimStatusGroup } from "./getForecastHeaderContent";
import { GOLCostDto } from "@framework/dtos/golCostDto";

type ProfileInfo = Pick<ForecastDetailsDTO, "value" | "costCategoryId" | "periodId" | "id">;
type ClaimDetailInfo = Pick<ClaimDetailsDto, "value" | "costCategoryId" | "periodId">;

export interface TablecraftProps {
  project: Pick<ProjectDto, "numberOfPeriods">;
  claims: Pick<
    ClaimDto,
    "periodId" | "iarStatus" | "isIarRequired" | "isApproved" | "status" | "periodEndDate" | "isFinalClaim"
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
  forecast: boolean;
  displayValue: string;
  profileId: string;
}

interface TotalCellData extends BaseCellData {
  month: Date;
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
  claims,
  claimDetails,
  costCategories,
  profiles,
  clientProfiles,
}: TablecraftProps): ForecastTableDto => {
  const costCatAccum: CostCategoryRow[] = [];
  const periodTotals: TotalCellData[] = [];
  const statusCells: StatusCell[] = [];
  const nonForecastClaims = claims.filter(x => getClaimStatusGroup(x.status) !== ClaimStatusGroup.FORECAST);
  const finalClaim = nonForecastClaims.find(claim => claim.isFinalClaim);

  let grandTotal = 0;
  let grandGolValue = 0;
  let currentStatusCell: StatusCell | undefined = undefined;

  for (let i = 1; i <= project.numberOfPeriods; i++) {
    const claim = claims.find(x => x.periodId === i);
    const nextClaim = claims.find(x => x.periodId === i + 1);
    let drawRhc = false;

    if (!currentStatusCell && claim) {
      currentStatusCell = {
        colSpan: 1,
        rhc: false,
        group: getClaimStatusGroup(claim.status),
      };
    }

    if (currentStatusCell) {
      if (nextClaim) {
        const nextClaimGroup = getClaimStatusGroup(nextClaim.status);
        if (currentStatusCell.group === nextClaimGroup) {
          currentStatusCell.colSpan += 1;
        } else {
          currentStatusCell.rhc = true;
          drawRhc = true;
          statusCells.push(currentStatusCell);
          currentStatusCell = {
            colSpan: 1,
            rhc: false,
            group: nextClaimGroup,
          };
        }
      } else {
        statusCells.push(currentStatusCell);
      }
    }

    periodTotals.push({
      periodId: i,
      value: 0,
      iarDue: !!claim?.isIarRequired,
      month: claim?.periodEndDate ?? new Date(NaN),
      rhc: drawRhc,
    });
  }

  for (const costCategory of costCategories) {
    const costCategoryProfiles: CostCategoryCellData[] = [];
    let total = 0;

    for (let i = 1; i <= project.numberOfPeriods; i++) {
      const forecastProfile = profiles.find(x => x.periodId === i && x.costCategoryId === costCategory.costCategoryId);
      const claimProfile = claimDetails.find(x => x.periodId === i && x.costCategoryId === costCategory.costCategoryId);
      const claim = claims.find(x => x.periodId === i);

      const forecast =
        !finalClaim && !!claim && [ClaimStatusGroup.FORECAST].includes(getClaimStatusGroup(claim.status));

      let value: number;
      let displayValue: string;
      let profileId = "";

      if (forecast && clientProfiles && forecastProfile) {
        const clientProfile: string | undefined = clientProfiles?.[forecastProfile.id];
        value = parseFloat(clientProfile);
        displayValue = clientProfile;
        profileId = forecastProfile.id;
      } else if (forecast && forecastProfile) {
        value = roundCurrency(forecastProfile.value);
        displayValue = String(value);
        profileId = forecastProfile.id;
      } else if (!forecast && claimProfile) {
        value = roundCurrency(claimProfile.value);
        displayValue = String(value);
      } else {
        value = 0;
        displayValue = "";
      }

      costCategoryProfiles.push({
        periodId: i,
        value,
        displayValue,
        forecast,
        profileId,
        rhc: periodTotals[i - 1].rhc,
      });

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

const useMapToForecastTableDto = (props: TablecraftProps): ForecastTableDto => {
  // Memoise our data...
  // With so much calculation, it's probably a good idea.
  return useMemo(() => mapToForecastTableDto(props), [props]);
};

export { mapToForecastTableDto, useMapToForecastTableDto };

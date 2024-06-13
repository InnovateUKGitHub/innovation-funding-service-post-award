import { CostCategoryType } from "@framework/constants/enums";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { multiplyCurrency, parseCurrency, roundCurrency, validCurrencyRegex } from "@framework/util/numberHelper";
import { useMemo } from "react";
import { ClaimStatusGroup, getClaimStatusGroup } from "./getForecastHeaderContent";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ReceivedStatus } from "@framework/entities/received-status";
import {
  ProfilePeriodDetailsDtoMapping,
  mapToProfilePeriodDetailsDtoArray,
} from "@gql/dtoMapper/mapProfilePeriodDetail";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { mapToGolCostDtoArray as mapToProfileTotalCostCategoryDtoArray } from "@gql/dtoMapper/mapGolCostsDto";
import { mapToClaimDetailsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { getPartnerRoles, mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useFragment } from "react-relay";
import { newForecastTableFragment } from "./NewForecastTable.fragment";
import {
  NewForecastTableFragment$key,
  NewForecastTableFragment$data,
} from "./__generated__/NewForecastTableFragment.graphql";

type ProfileInfo = Pick<ForecastDetailsDTO, "value" | "costCategoryId" | "periodId" | "id">;
type ClaimDetailInfo = Pick<ClaimDetailsDto, "value" | "costCategoryId" | "periodId">;
type ClaimTotalProjectPeriodsInfo = Pick<
  ClaimDto,
  | "periodId"
  | "iarStatus"
  | "isIarRequired"
  | "isApproved"
  | "status"
  | "periodStartDate"
  | "periodEndDate"
  | "isFinalClaim"
>;
type ProfileTotalProjectPeriodsInfo = Pick<
  ProfilePeriodDetailsDtoMapping,
  "periodId" | "periodStartDate" | "periodEndDate"
>;

interface MapToForecastTableProps {
  project: Pick<ProjectDto, "numberOfPeriods">;
  partner: Pick<PartnerDtoGql, "overheadRate">;
  claimTotalProjectPeriods: ClaimTotalProjectPeriodsInfo[];
  claimDetails: ClaimDetailInfo[];
  profileTotalProjectPeriods?: ProfileTotalProjectPeriodsInfo[];
  profileTotalCostCategories: GOLCostDto[];
  profileDetails: ProfileInfo[];
  clientProfiles?: Record<string, string | null>;
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
  isCalculated: boolean;
  profiles: CostCategoryCellData[];
  greaterThanAllocatedCosts: boolean;
  differentThanAllocatedCosts: boolean;
}

interface TotalRow extends TableCraftRow {
  profiles: TotalCellData[];
}

export interface ForecastTableDto {
  costCategories: CostCategoryRow[];
  totalRow: TotalRow;
  statusRow: StatusCell[];
  finalClaim: ClaimTotalProjectPeriodsInfo | null;
}

const mapToForecastTableDto = ({
  project,
  partner,
  profileTotalProjectPeriods,
  profileTotalCostCategories,
  profileDetails,
  claimTotalProjectPeriods,
  claimDetails,
  clientProfiles,
}: MapToForecastTableProps): ForecastTableDto => {
  const costCatAccum: CostCategoryRow[] = [];
  const periodTotals: TotalCellData[] = [];
  const statusCells: StatusCell[] = [];
  const nonForecastClaims = claimTotalProjectPeriods.filter(
    x => getClaimStatusGroup(x.status) !== ClaimStatusGroup.FORECAST,
  );
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
    const forecastTotalProjectPeriod = profileTotalProjectPeriods?.find(x => x.periodId === i);
    const claimTotalProjectPeriod = claimTotalProjectPeriods.find(x => x.periodId === i);
    const nextClaimTotalProjectPeriod = claimTotalProjectPeriods.find(x => x.periodId === i + 1);
    const isLastColumn = i === project.numberOfPeriods;
    let drawRhc = false;

    // If we haven't got a "current status cell",
    // initialise it with the status of our first claim.
    if (!currentStatusCell && claimTotalProjectPeriod) {
      currentStatusCell = {
        colSpan: 1,
        rhc: false,
        group: getClaimStatusGroup(claimTotalProjectPeriod.status),
      };
    }

    // If we have a previous status cell
    if (currentStatusCell) {
      const nextClaimGroup = nextClaimTotalProjectPeriod
        ? getClaimStatusGroup(nextClaimTotalProjectPeriod.status)
        : ClaimStatusGroup.FORECAST;

      // If it's a part of the same claim, we should extend the colspan of the column.
      if (currentStatusCell.group === nextClaimGroup && !isLastColumn) {
        currentStatusCell.colSpan += 1;
      } else {
        // If it's not a part of the same claim, we should mark it as requiring a right-hand-column
        currentStatusCell.rhc = !isLastColumn;
        drawRhc = !isLastColumn;
        statusCells.push(currentStatusCell);

        // Create a new status cell with the status of the next claim
        currentStatusCell = {
          colSpan: 1,
          rhc: false,
          group: nextClaimGroup,
        };
      }
    }

    // Initialise the period total for periodId `i`
    periodTotals.push({
      periodId: i,
      value: 0,
      iarDue: !!claimTotalProjectPeriod?.isIarRequired && claimTotalProjectPeriod.iarStatus !== ReceivedStatus.Received,
      periodStart:
        claimTotalProjectPeriod?.periodStartDate ?? forecastTotalProjectPeriod?.periodStartDate ?? new Date(NaN),
      periodEnd: claimTotalProjectPeriod?.periodEndDate ?? forecastTotalProjectPeriod?.periodEndDate ?? new Date(NaN),
      rhc: drawRhc,
    });
  }

  const labourCostCategory = profileTotalCostCategories.find(x => x.type === CostCategoryType.Labour);

  for (const costCategory of profileTotalCostCategories) {
    const costCategoryProfiles: CostCategoryCellData[] = [];
    let total = 0;
    let isCalculatedCostCategory = false;

    for (let i = 1; i <= project.numberOfPeriods; i++) {
      const forecastProfile = profileDetails.find(
        x => x.periodId === i && x.costCategoryId === costCategory.costCategoryId,
      );
      const labourProfile = labourCostCategory
        ? profileDetails.find(x => x.periodId === i && x.costCategoryId === labourCostCategory.costCategoryId)
        : undefined;
      const claimProfile = claimDetails.find(x => x.periodId === i && x.costCategoryId === costCategory.costCategoryId);
      const claimTotalProjectPeriod = claimTotalProjectPeriods.find(x => x.periodId === i);

      const forecast =
        !claimTotalProjectPeriod ||
        (!finalClaim &&
          !!claimTotalProjectPeriod &&
          [ClaimStatusGroup.FORECAST].includes(getClaimStatusGroup(claimTotalProjectPeriod.status)));

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
            const clientProfile: Nullable<string> = clientProfiles?.[labourProfile.id];
            const numberComponent = validCurrencyRegex.exec(clientProfile ?? "")?.[0] ?? "";
            value = multiplyCurrency(parseCurrency(numberComponent), partner.overheadRate, 1);
            displayValue = isNaN(value) ? "" : String(value);
          } else {
            value = multiplyCurrency(labourProfile.value, partner.overheadRate, 1);
            displayValue = String(value);
          }
          profileId = forecastProfile.id;
          calculatedField = true;
          isCalculatedCostCategory = true;
        } else {
          if (clientProfiles) {
            const clientProfile: Nullable<string> = clientProfiles?.[forecastProfile.id];
            const numberComponent = validCurrencyRegex.exec(clientProfile ?? "")?.[0] ?? "";
            value = parseCurrency(numberComponent);
            displayValue = clientProfile ?? "";
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

    grandGolValue = roundCurrency(grandGolValue + costCategory.value);

    const costCategoryRow: CostCategoryRow = {
      costCategoryId: costCategory.costCategoryId,
      costCategoryName: costCategory.costCategoryName,
      isCalculated: isCalculatedCostCategory,
      golCost: costCategory.value,
      profiles: costCategoryProfiles,
      total,
      greaterThanAllocatedCosts: total > costCategory.value,
      differentThanAllocatedCosts: total !== roundCurrency(costCategory.value),
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
    finalClaim: finalClaim ?? null,
  };
};

const useMapToForecastTableDto = (props: MapToForecastTableProps): ForecastTableDto => {
  // Memoise our data...
  // With so much calculation, it's probably a good idea.
  return useMemo(() => mapToForecastTableDto(props), [props]);
};

const useNewForecastTableData = ({
  fragmentRef,
  isProjectSetup,
  partnerId,
}: {
  fragmentRef: NewForecastTableFragment$key;
  isProjectSetup: boolean;
  partnerId: PartnerId;
}) => {
  const fragment: NewForecastTableFragment$data = useFragment(newForecastTableFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.ForecastTable_Project?.edges);
  const { node: partnerNode } = getFirstEdge(fragment?.query?.ForecastTable_ProjectParticipant?.edges);

  const project = mapToProjectDto(projectNode, ["title", "projectNumber", "numberOfPeriods", "roles", "partnerRoles"]);
  const partner = mapToPartnerDto(partnerNode, ["forecastLastModifiedDate", "overheadRate", "roles"], {
    roles: getPartnerRoles(project.partnerRoles, partnerId),
  });
  const claimTotalProjectPeriods = mapToClaimDtoArray(
    fragment?.query?.ForecastTable_ClaimTotalProjectPeriods?.edges ?? [],
    [
      "periodId",
      "status",
      "iarStatus",
      "isIarRequired",
      "isApproved",
      "periodStartDate",
      "periodEndDate",
      "isFinalClaim",
    ],
    {},
  );
  const claimDetails = mapToClaimDetailsDtoArray(
    fragment?.query?.ForecastTable_ClaimDetails?.edges ?? [],
    ["periodId", "costCategoryId", "value"],
    {},
  );
  const profileTotalProjectPeriods = mapToProfilePeriodDetailsDtoArray(
    fragment.query.ForecastTable_ProfileTotalProjectPeriod?.edges ?? [],
    ["periodId", "periodStartDate", "periodEndDate"],
  );
  const profileTotalCostCategories = mapToProfileTotalCostCategoryDtoArray(
    fragment?.query?.ForecastTable_ProfileTotalCostCategories?.edges ?? [],
    ["value", "costCategoryId", "costCategoryName", "type"],
  );
  const profileDetails = mapToForecastDetailsDtoArray(
    fragment?.query?.ForecastTable_ProfileDetails?.edges ?? [],
    ["value", "periodId", "costCategoryId", "id"],
    { isProjectSetup },
  );

  return {
    project,
    partner,
    profileTotalProjectPeriods,
    profileTotalCostCategories,
    profileDetails,
    claimTotalProjectPeriods,
    claimDetails,
  };
};

export {
  mapToForecastTableDto,
  useNewForecastTableData,
  useMapToForecastTableDto,
  MapToForecastTableProps,
  ClaimTotalProjectPeriodsInfo,
};

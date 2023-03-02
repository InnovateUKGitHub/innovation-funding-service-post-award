import { ClaimStatus, PCROrganisationType } from "@framework/constants";
import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import {
  ClaimDetailsSummaryDto,
  ClaimDto,
  CostCategoryDto,
  ForecastDetailsDTO,
  GOLCostDto,
  PartnerDto,
  ProjectDto,
} from "@framework/dtos";
import { mapToClaimStatus } from "@framework/mappers/claimStatus";
import { getPartnerStatus } from "@framework/mappers/partnerStatus";
import { getProjectStatus } from "@framework/mappers/projectStatus";
import { Clock, numberComparator, salesforceDateFormat } from "@framework/util";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { viewForecastQuery } from "./ViewForecast.query";
import { ViewForecastQuery, ViewForecastQuery$data } from "./__generated__/ViewForecastQuery.graphql";
import { costCategoryTypeMapper } from "@framework/mappers/costCategory";

const clock = new Clock();

type PartnerRoles = SfRoles & {
  partnerId: string;
};

export type Project = Pick<
  ProjectDto,
  "id" | "projectNumber" | "title" | "status" | "periodId" | "numberOfPeriods" | "competitionType" | "roles"
>;

export type Partner = Pick<
  PartnerDto,
  | "id"
  | "name"
  | "isWithdrawn"
  | "partnerStatus"
  | "isLead"
  | "newForecastNeeded"
  | "overheadRate"
  | "organisationType"
  | "roles"
  | "forecastLastModifiedDate"
>;

type Claim = Pick<ClaimDto, "id" | "isApproved" | "periodId" | "isFinalClaim" | "paidDate">;
type ClaimDetails = Pick<ClaimDetailsSummaryDto, "costCategoryId" | "periodId" | "value" | "periodEnd" | "periodStart">;
type CostCategory = Pick<
  CostCategoryDto,
  "id" | "competitionType" | "name" | "isCalculated" | "organisationType" | "type"
>;

type ProjectGQL = GQL.ObjectNodeSelector<ViewForecastQuery$data, "Acc_Project__c">;
type PartnerGql = GQL.ObjectNodeSelector<ProjectGQL, "Acc_ProjectParticipantsProject__r">;

export type Data = {
  project: Project;
  partner: Partner;
  claims: Claim[];
  claim: Claim | null; // currently active claim (not yet approved)
  claimDetails: ClaimDetails[];
  costCategories: CostCategory[];
  golCosts: GOLCostDto[];
  forecastDetails: ForecastDetailsDTO[];
  IARDueOnClaimPeriods: string[];
};

const defaultRole = { isPm: false, isMo: false, isFc: false };

export const useViewForecastData = (projectId: string, partnerId: string): Data => {
  const data = useLazyLoadQuery<ViewForecastQuery>(viewForecastQuery, {
    projectId,
    projectIdStr: projectId,
    partnerId,
  });

  const { node: projectNode } = getFirstEdge<ProjectGQL>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge<PartnerGql>(projectNode?.Acc_ProjectParticipantsProject__r?.edges);

  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];
  const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

  // PARTNER ROLES
  const partnerRoles: PartnerRoles[] =
    projectNode?.roles?.partnerRoles?.map(x => ({
      isFc: x?.isFc ?? false,
      isPm: x?.isPm ?? false,
      isMo: x?.isMo ?? false,
      partnerId: x?.partnerId ?? "unknown partner id",
    })) ?? [];

  // PROJECT
  const project: Project = {
    id: projectNode?.Id ?? "",
    projectNumber: projectNode?.Acc_ProjectNumber__c?.value ?? "",
    title: projectNode?.Acc_ProjectTitle__c?.value ?? "",
    status: getProjectStatus(projectNode?.Acc_ProjectStatus__c?.value ?? "unknown"),
    roles: {
      isPm: projectNode?.roles?.isPm ?? false,
      isMo: projectNode?.roles?.isMo ?? false,
      isFc: projectNode?.roles?.isFc ?? false,
    },
    periodId: projectNode?.Acc_CurrentPeriodNumber__c?.value ?? 0,
    numberOfPeriods: Number(projectNode?.Acc_NumberofPeriods__c?.value) ?? 0,
    competitionType: projectNode?.Acc_CompetitionType__c?.value ?? "Unknown",
  };

  // PARTNER
  const partner: Partner = {
    id: partnerNode?.Id ?? "",
    name: partnerNode?.Acc_AccountId__r?.Name?.value ?? "",
    isWithdrawn: ["Voluntary Withdrawal", "Involuntary Withdrawal", "Migrated - Withdrawn"].includes(
      partnerNode?.Acc_ParticipantStatus__c?.value ?? "",
    ),
    partnerStatus: getPartnerStatus(partnerNode?.Acc_ParticipantStatus__c?.value ?? "unknown"),
    isLead: partnerNode?.Acc_ProjectRole__c?.value === SalesforceProjectRole.ProjectLead,
    roles: (partnerRoles.find(x => x.partnerId === partnerNode?.Acc_AccountId__c?.value ?? "unknown") ??
      defaultRole) as SfRoles,
    newForecastNeeded: partnerNode?.Acc_NewForecastNeeded__c?.value ?? false,
    overheadRate: partnerNode?.Acc_OverheadRate__c?.value ?? null,
    organisationType: partnerNode?.Acc_OrganisationType__c?.value ?? "unknown",
    forecastLastModifiedDate: (partnerNode?.Acc_ForecastLastModifiedDate__c?.value ?? null) as Date | null,
  };

  // CLAIM
  const claims: Claim[] = claimsGql
    .filter(
      x =>
        x?.node?.RecordType?.Name?.value === "Total Project Period" &&
        x?.node?.Acc_ClaimStatus__c?.value !== "New" &&
        x?.node?.Acc_ClaimStatus__c?.value !== "Not used",
    )
    .map(x => {
      const claimStatus = mapToClaimStatus(x?.node?.Acc_ClaimStatus__c?.value ?? "unknown claim status");
      const paidDate =
        x?.node?.Acc_PaidDate__c?.value === null
          ? null
          : clock.parse(x?.node?.Acc_PaidDate__c?.value, salesforceDateFormat);

      return {
        id: x?.node?.Id ?? "",
        isApproved: [ClaimStatus.APPROVED, ClaimStatus.PAID, ClaimStatus.PAYMENT_REQUESTED].indexOf(claimStatus) >= 0,
        periodId: x?.node?.Acc_ProjectPeriodNumber__c?.value ?? 0,
        isFinalClaim: x?.node?.Acc_FinalClaim__c?.value ?? false,
        paidDate,
      };
    });

  // COST CATEGORIES
  const unfilteredCostCategories =
    data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges?.map(x => {
      return {
        id: x?.node?.Id ?? "",
        name: x?.node?.Acc_CostCategoryName__c?.value ?? "",
        type: costCategoryTypeMapper(x?.node?.Acc_OrganisationType__c?.value ?? "Unknown"),
        competitionType: x?.node?.Acc_CompetitionType__c?.value ?? "unknown",
        organisationType: (x?.node?.Acc_OrganisationType__c?.value ?? "unknown") as PCROrganisationType,
        isCalculated: false,
        displayOrder: x?.node?.Acc_DisplayOrder__c?.value ?? 0,
      };
    }) ?? [];

  const requiredCategoryIds = profileGql.map(x => x?.node?.Acc_CostCategory__c?.value ?? "unknown id");

  const costCategories = unfilteredCostCategories
    .filter(x => !!x.name && requiredCategoryIds?.includes(x.id))
    .sort((a, b) => numberComparator(a.displayOrder, b.displayOrder));

  // GOL COSTS
  const costCategoriesOrder = costCategories.map(y => y.id);

  const golCosts = profileGql
    .filter(x => x?.node?.RecordType?.Name?.value === "Total Cost Category")
    .map(x => ({
      costCategoryId: x?.node?.Acc_CostCategory__c?.value ?? "unknown category",
      costCategoryName: costCategories
        .filter(costCategory => costCategory.id === x?.node?.Acc_CostCategory__c?.value)
        .map(costCategory => costCategory.name)[0],
      value: x?.node?.Acc_CostCategoryGOLCost__c?.value ?? 0,
    }))
    .sort((x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));

  // FORECAST DETAILS
  const forecastDetails =
    profileGql
      ?.filter(x => x?.node?.RecordType?.Name?.value === "Profile Detail")
      ?.map(x => ({
        id: x?.node?.Id ?? "",
        costCategoryId: x?.node?.Acc_CostCategory__c?.value ?? "unknown",
        periodId: x?.node?.Acc_ProjectPeriodNumber__c?.value ?? 0,
        periodStart: clock.parse(x?.node?.Acc_ProjectPeriodStartDate__c?.value ?? null, salesforceDateFormat),
        periodEnd: clock.parse(x?.node?.Acc_ProjectPeriodEndDate__c?.value ?? null, salesforceDateFormat),
        value: x?.node?.Acc_LatestForecastCost__c?.value ?? 0,
      })) ?? [];

  // IAR DUE ON CLAIM PERIODS
  const IARDueOnClaimPeriods =
    claimsGql.reduce((iarPeriods: string[], cur) => {
      if (cur?.node?.Acc_IAR_Status__c?.value === "Not Received" && !!cur?.node?.Acc_IARRequired__c?.value) {
        iarPeriods.push((cur?.node?.Acc_ProjectID__c?.value ?? 0).toString());
      }
      return iarPeriods;
    }, []) ?? [];

  // ACTIVE CLAIM
  const claim = claims.find(claim => !claim.isApproved) || null;

  // CLAIM DETAILS
  const claimDetails: ClaimDetails[] = claimsGql
    .filter(
      x =>
        x?.node?.RecordType?.Name?.value === "Claims Detail" &&
        x?.node?.Acc_ClaimStatus__c?.value !== "New" &&
        x?.node?.Acc_CostCategory__c?.value !== null,
    )
    .map(x => ({
      periodId: x?.node?.Acc_ProjectPeriodNumber__c?.value ?? 0,
      costCategoryId: x?.node?.Acc_CostCategory__c?.value ?? "unknown",
      value: x?.node?.Acc_PeriodCostCategoryTotal__c?.value ?? 0,
      periodStart: clock.parse(x?.node?.Acc_ProjectPeriodStartDate__c?.value, salesforceDateFormat),
      periodEnd: clock.parse(x?.node?.Acc_ProjectPeriodEndDate__c?.value, salesforceDateFormat),
    }));

  return {
    project,
    partner,
    claims,
    claim,
    claimDetails,
    costCategories,
    golCosts,
    forecastDetails,
    IARDueOnClaimPeriods,
  };
};

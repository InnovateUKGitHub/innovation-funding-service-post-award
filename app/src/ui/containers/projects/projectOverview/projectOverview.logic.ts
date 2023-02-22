import { useLazyLoadQuery } from "react-relay";
import { calcPercentage, Clock, dayComparator, roundCurrency } from "@framework/util";
import { getLeadPartner } from "@framework/util/partnerHelper";
import { getProjectStatus } from "@framework/util/projectStatus";
import { getFirstEdge } from "@gql/selectors/edges";
import { projectOverviewQuery } from "./ProjectOverview.query";
import { ProjectOverviewQuery, ProjectOverviewQuery$data } from "./__generated__/ProjectOverviewQuery.graphql";
import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import { PartnerClaimStatus, PartnerStatus, ProjectStatus } from "@framework/constants";
import { getClaimStatus } from "@framework/util/claimStatus";
import { getPartnerStatus } from "@framework/util/partnerStatus";
import { IClientUser } from "@framework/types";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { convertRolesToPermissionsValue } from "@framework/util/rolesToPermissions";

const clock = new Clock();
const defaultRole = { isPm: false, isMo: false, isFc: false };

type ProjectGql = GQL.ObjectNodeSelector<ProjectOverviewQuery$data, "Acc_Project__c">;

type Role = {
  isFc: boolean;
  isPm: boolean;
  isMo: boolean;
};

type PartnerRole = Role & {
  partnerId: string;
};

export type Project = {
  id: string;
  projectNumber: string;
  title: string;
  roles: Role;
  status: ProjectStatus;
  periodId: number;
  numberOfPeriods: number;
  periodStartDate: string;
  periodEndDate: string;
  isPastEndDate: boolean;
  grantOfferLetterCosts: number;
  costsClaimedToDate: number;
  claimedPercentage: number | null;
  competitionType: string;
  pcrsQueried: number;
  pcrsToReview: number;
  claimsToReview: number;
};

export type Partner = {
  id: string;
  isLead: boolean;
  isWithdrawn: boolean;
  roles: PartnerRole;
  name: string;
  totalParticipantGrant: number;
  totalParticipantCostsClaimed: number;
  percentageParticipantCostsClaimed: number | null;
  newForecastNeeded: boolean;
  claimStatus: PartnerClaimStatus;
  partnerStatus: PartnerStatus;
};

const generateUserInfo = (rolesForPartner: PartnerRole[], rolesForProject: Role) => {
  const partnerRoles =
    rolesForPartner &&
    rolesForPartner.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.partnerId]: convertRolesToPermissionsValue(cur),
      }),
      {},
    );

  const projectRoles = convertRolesToPermissionsValue(rolesForProject);
  return { partnerRoles, projectRoles };
};

export const isPartnerWithdrawn = (roles: Role, partners: Partner[]) => {
  if (roles?.isPm) {
    const leadPartner = getLeadPartner(partners);
    return leadPartner && leadPartner.isWithdrawn;
  }
  return partners.some(p => !!(p?.roles?.isFc && p.isWithdrawn));
};

export const useProjectOverviewData = (
  projectId: string,
): {
  project: Project;
  partners: Partner[];
  isProjectClosed: boolean;
  highlightedPartner: Partner;
  user: IClientUser;
  accessControlOptions: IAccessControlOptions;
} => {
  const data = useLazyLoadQuery<ProjectOverviewQuery>(projectOverviewQuery, {
    projectId,
  });

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const endDate = clock.parseOptionalSalesforceDate(projectNode?.Acc_EndDate__c?.value ?? "") as Date;

  const partnerRoles: PartnerRole[] =
    projectNode?.roles?.partnerRoles?.map(x => ({
      isFc: x?.isFc ?? false,
      isPm: x?.isPm ?? false,
      isMo: x?.isMo ?? false,
      partnerId: x?.partnerId ?? "unknown partner id",
    })) ?? [];

  const project = {
    id: projectNode?.Id ?? "unknown-project-id",
    projectNumber: projectNode?.Acc_ProjectNumber__c?.value ?? "",
    title: projectNode?.Acc_ProjectTitle__c?.value ?? "",
    roles: {
      isPm: projectNode?.roles?.isPm ?? false,
      isMo: projectNode?.roles?.isMo ?? false,
      isFc: projectNode?.roles?.isFc ?? false,
    },
    status: getProjectStatus(projectNode?.Acc_ProjectStatus__c?.value ?? "Unknown"),
    periodId: projectNode?.Acc_CurrentPeriodNumber__c?.value ?? 0,
    numberOfPeriods: projectNode?.Acc_NumberofPeriods__c?.value ?? 0,
    periodStartDate: projectNode?.Acc_CurrentPeriodStartDate__c?.value ?? "",
    periodEndDate: projectNode?.Acc_CurrentPeriodEndDate__c?.value ?? "",
    isPastEndDate: dayComparator(endDate, new Date()) < 0,
    grantOfferLetterCosts: projectNode?.Acc_GOLTotalCostAwarded__c?.value ?? 0,
    costsClaimedToDate: projectNode?.Acc_TotalProjectCosts__c?.value ?? 0,
    claimedPercentage: !!projectNode?.Acc_GOLTotalCostAwarded__c?.value
      ? roundCurrency(
          (100 * (projectNode?.Acc_TotalProjectCosts__c?.value ?? 0)) / projectNode?.Acc_GOLTotalCostAwarded__c?.value,
        )
      : null,
    competitionType: projectNode?.Acc_CompetitionType__c?.value ?? "",
    pcrsToReview: projectNode?.Acc_PCRsForReview__c?.value ?? 0,
    pcrsQueried: projectNode?.Acc_PCRsUnderQuery__c?.value ?? 0,
    claimsToReview: projectNode?.Acc_ClaimsForReview__c?.value ?? 0,
  };

  const partners =
    projectNode?.Acc_ProjectParticipantsProject__r?.edges?.map(x => {
      return {
        id: x?.node?.Acc_AccountId__c?.value ?? "unknown",
        isLead: x?.node?.Acc_ProjectRole__c?.value === SalesforceProjectRole.ProjectLead,
        isWithdrawn: ["Voluntary Withdrawal", "Involuntary Withdrawal", "Migrated - Withdrawn"].includes(
          x?.node?.Acc_ParticipantStatus__c?.value ?? "",
        ),
        roles: partnerRoles?.find(partnerRole => partnerRole.partnerId === x?.node?.Acc_AccountId__c?.value) ?? {
          ...defaultRole,
          partnerId: "unknown-partner",
        },
        name: x?.node?.Acc_AccountId__r?.Name?.value ?? "",
        totalParticipantGrant: x?.node?.Acc_TotalParticipantCosts__c?.value ?? 0,
        totalParticipantCostsClaimed: x?.node?.Acc_TotalCostsSubmitted__c?.value ?? 0,
        percentageParticipantCostsClaimed: calcPercentage(
          x?.node?.Acc_TotalParticipantCosts__c?.value ?? 0,
          x?.node?.Acc_TotalCostsSubmitted__c?.value ?? 0,
        ),
        newForecastNeeded: x?.node?.Acc_NewForecastNeeded__c?.value ?? false,
        claimStatus: getClaimStatus(x?.node?.Acc_TrackingClaims__c?.value ?? ""),
        partnerStatus: getPartnerStatus(x?.node?.Acc_ParticipantStatus__c?.value ?? "unknown"),
      };
    }) || [];

  const leadPartner = partners.filter(x => x.isLead);
  const otherPartners = partners.filter(x => !x.isLead);
  const orderedPartners = [...leadPartner, ...otherPartners];
  const isProjectClosed = project.status === ProjectStatus.Closed || project.status === ProjectStatus.Terminated;
  const highlightedPartner = orderedPartners.filter(x => x?.roles?.isFc || x?.roles?.isPm || x?.roles?.isMo)[0];

  const user = {
    roleInfo: {
      [projectId]: generateUserInfo(partnerRoles, project.roles),
    },
    csrf: "",
    email: data?.currentUser?.email ?? "unknown-user@email.com",
  };

  const accessControlOptions: IAccessControlOptions = {
    ssoEnabled: data?.clientConfig?.ssoEnabled ?? false,
  };

  return {
    project,
    partners: orderedPartners,
    isProjectClosed,
    highlightedPartner,
    user,
    accessControlOptions,
  };
};

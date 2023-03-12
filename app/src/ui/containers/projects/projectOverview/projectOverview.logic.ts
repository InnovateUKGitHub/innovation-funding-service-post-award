import { useLazyLoadQuery } from "react-relay";
import { getLeadPartner } from "@framework/util/partnerHelper";
import { getFirstEdge } from "@gql/selectors/edges";
import { projectOverviewQuery } from "./ProjectOverview.query";
import { ProjectOverviewQuery, ProjectOverviewQuery$data } from "./__generated__/ProjectOverviewQuery.graphql";
import { ProjectStatus } from "@framework/constants";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { convertRolesToPermissionsValue } from "@framework/util/rolesToPermissions";
import { PartnerDtoGql, ProjectDtoGql } from "@framework/dtos";
import { mapToPartnerDtoArray, mapToProjectDto, getPartnerRoles } from "@gql/dtoMapper";

type ProjectGql = GQL.ObjectNodeSelector<ProjectOverviewQuery$data, "Acc_Project__c">;

export type Project = Pick<
  ProjectDtoGql,
  | "id"
  | "projectNumber"
  | "title"
  | "roles"
  | "status"
  | "periodId"
  | "numberOfPeriods"
  | "periodStartDate"
  | "periodEndDate"
  | "isPastEndDate"
  | "grantOfferLetterCosts"
  | "costsClaimedToDate"
  | "claimedPercentage"
  | "competitionType"
  | "pcrsQueried"
  | "pcrsToReview"
  | "claimsToReview"
>;

export type Partner = Pick<
  PartnerDtoGql,
  | "id"
  | "accountId"
  | "isLead"
  | "isWithdrawn"
  | "roles"
  | "name"
  | "totalParticipantGrant"
  | "totalParticipantCostsClaimed"
  | "percentageParticipantCostsClaimed"
  | "newForecastNeeded"
  | "claimStatus"
  | "partnerStatus"
>;

/**
 * Generates the user permissions information used for generating the tiles that are displayed on the overview page
 */
const generateUserInfo = (
  rolesForProject: SfRoles,
  partners: Pick<Partner, "id" | "accountId">[],
  rolesForPartners: SfPartnerRoles[],
) => {
  const partnerRoles = rolesForPartners
    .map(x => ({
      isFc: x?.isFc ?? false,
      isPm: x?.isPm ?? false,
      isMo: x?.isMo ?? false,
      id: partners.find(partner => x?.partnerId === partner.accountId)?.id ?? "unknown id",
    }))
    .reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: convertRolesToPermissionsValue(cur),
      }),
      {},
    );

  const projectRoles = convertRolesToPermissionsValue(rolesForProject);
  return { partnerRoles, projectRoles };
};

export const isPartnerWithdrawn = (roles: SfRoles, partners: Partner[]) => {
  if (roles?.isPm) {
    const leadPartner = getLeadPartner(partners);
    return leadPartner && leadPartner.isWithdrawn;
  }
  return partners.some(p => !!(p?.roles?.isFc && p.isWithdrawn));
};

export const useProjectOverviewData = (projectId: string) => {
  const data = useLazyLoadQuery<ProjectOverviewQuery>(projectOverviewQuery, {
    projectId,
  });

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partnerRoles = getPartnerRoles(projectNode?.roles ?? null);

  const project = mapToProjectDto(projectNode, [
    "id",
    "projectNumber",
    "title",
    "roles",
    "status",
    "periodId",
    "numberOfPeriods",
    "periodStartDate",
    "periodEndDate",
    "isPastEndDate",
    "grantOfferLetterCosts",
    "costsClaimedToDate",
    "claimedPercentage",
    "competitionType",
    "pcrsToReview",
    "pcrsQueried",
    "claimsToReview",
  ]);

  const partners = mapToPartnerDtoArray(
    projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [],
    [
      "id",
      "accountId",
      "isLead",
      "isWithdrawn",
      "roles",
      "name",
      "totalParticipantGrant",
      "totalParticipantCostsClaimed",
      "percentageParticipantCostsClaimed",
      "newForecastNeeded",
      "claimStatus",
      "partnerStatus",
    ],
    partnerRoles,
  );

  const leadPartner = partners.filter(x => x.isLead);
  const otherPartners = partners.filter(x => !x.isLead);
  const orderedPartners = [...leadPartner, ...otherPartners];
  const isProjectClosed = project.status === ProjectStatus.Closed || project.status === ProjectStatus.Terminated;
  const highlightedPartner = orderedPartners.filter(x => x?.roles?.isFc || x?.roles?.isPm || x?.roles?.isMo)[0];

  const user = {
    roleInfo: {
      [projectId]: generateUserInfo(project.roles, partners, partnerRoles),
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

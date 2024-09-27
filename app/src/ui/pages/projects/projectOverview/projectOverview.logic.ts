import { useLazyLoadQuery } from "react-relay";
import { getLeadPartner, sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { getFirstEdge } from "@gql/selectors/edges";
import { projectOverviewQuery } from "./ProjectOverview.query";
import { ProjectOverviewQuery } from "./__generated__/ProjectOverviewQuery.graphql";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { convertRolesToPermissionsValue } from "@framework/util/rolesToPermissions";
import { ProjectStatus } from "@framework/constants/project";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { getPartnerRoles } from "@gql/dtoMapper/getPartnerRoles";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useClientConfig } from "@ui/context/ClientConfigProvider";

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
  | "isActive"
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
      isAssociate: x?.isAssociate ?? false,
      id: partners.find(partner => x?.partnerId === partner.id)?.id ?? "unknown id",
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
  const clientConfig = useClientConfig();
  const data = useLazyLoadQuery<ProjectOverviewQuery>(
    projectOverviewQuery,
    {
      projectId,
    },
    {
      fetchPolicy: "network-only",
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

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
    "isActive",
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
    ],
    { partnerRoles },
  );

  const orderedPartners = sortPartnersLeadFirst(partners);
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
    ssoEnabled: clientConfig.ssoEnabled,
  };

  return {
    project,
    partners: orderedPartners,
    isProjectClosed,
    highlightedPartner,
    user,
    accessControlOptions,
    fragmentRef: data?.salesforce?.uiapi,
  };
};

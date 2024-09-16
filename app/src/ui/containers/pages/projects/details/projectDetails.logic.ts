import { useLazyLoadQuery } from "react-relay";
import { projectDetailsQuery } from "./ProjectDetails.query";
import { ProjectDetailsQuery } from "./__generated__/ProjectDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToContactDtoArray } from "@gql/dtoMapper/mapContactDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

export const useProjectDetailsQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<ProjectDetailsQuery>(
    projectDetailsQuery,
    { projectId },
    {
      fetchPolicy: "store-and-network",
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partnersGql = projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [];
  const contactsGql = projectNode?.Project_Contact_Links__r?.edges ?? [];

  const project = mapToProjectDto(projectNode, [
    "competitionType",
    "durationInMonths",
    "endDate",
    "id",
    "loanAvailabilityPeriodLength",
    "loanEndDate",
    "loanExtensionPeriodLength",
    "loanRepaymentPeriodLength",
    "numberOfPeriods",
    "periodEndDate",
    "periodId",
    "periodStartDate",
    "projectNumber",
    "roles",
    "startDate",
    "status",
    "summary",
    "title",
    "monitoringLevel",
    "isActive",
    "competitionType",
  ]);

  const partners = mapToPartnerDtoArray(
    partnersGql,
    ["id", "name", "isLead", "isWithdrawn", "accountId", "partnerStatusLabel", "isNonFunded", "postcode", "type"],
    {},
  );

  const competitionName = projectNode?.Acc_CompetitionId__r?.Name?.value ?? null;

  const contacts = mapToContactDtoArray(contactsGql, [
    "accountId",
    "id",
    "email",
    "role",
    "name",
    "projectId",
    "roleName",
  ]);
  return { project, partners, contacts, competitionName, fragmentRef: data?.salesforce?.uiapi };
};

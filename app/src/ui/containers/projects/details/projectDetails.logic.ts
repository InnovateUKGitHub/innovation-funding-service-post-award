import { useLazyLoadQuery } from "react-relay";
import { projectDetailsQuery } from "./ProjectDetails.query";
import { ProjectDetailsQuery, ProjectDetailsQuery$data } from "./__generated__/ProjectDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToContactDtoArray, mapToPartnerDtoArray, mapToProjectDto } from "@gql/dtoMapper";

type ProjectGql = GQL.NodeSelector<ProjectDetailsQuery$data, "Acc_Project__c">;

export const useProjectDetailsQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<ProjectDetailsQuery>(projectDetailsQuery, { projectId });

  const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

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
  ]);

  const partners = mapToPartnerDtoArray(
    partnersGql,
    [
      "id",
      "name",
      "isLead",
      "isWithdrawn",
      "competitionName",
      "accountId",
      "partnerStatusLabel",
      "isNonFunded",
      "postcode",
      "type",
    ],
    { competitionName: projectNode?.Acc_CompetitionId__r?.Name?.value ?? "unknown competition Name" },
  );

  const contacts = mapToContactDtoArray(contactsGql, [
    "accountId",
    "id",
    "email",
    "role",
    "name",
    "projectId",
    "roleName",
  ]);
  return { project, partners, contacts };
};

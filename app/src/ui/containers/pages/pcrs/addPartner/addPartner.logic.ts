import { useLazyLoadQuery } from "react-relay";
import { addPartnerWorkflowQuery } from "./AddPartner.query";
import { AddPartnerWorkflowQuery } from "./__generated__/AddPartnerWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { mapToDocumentSummaryDto } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapPcrSpendProfileArray } from "@gql/dtoMapper/mapPcrSpendProfile";
import { PCROrganisationType } from "@framework/constants/pcrConstants";

export const useAddPartnerWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<AddPartnerWorkflowQuery>(
    addPartnerWorkflowQuery,
    {
      projectId,
      pcrItemId,
    },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);
  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "roles", "competitionType"]);

  const partners = sortPartnersLeadFirst(
    mapToPartnerDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [],
      ["id", "isLead", "isWithdrawn", "name"],
      {},
    ),
  );

  const pcrSpendProfile = mapPcrSpendProfileArray(data?.salesforce?.uiapi?.query?.Acc_IFSSpendProfile__c?.edges ?? [], [
    "value",
    "capitalUsageType",
    "id",
    "description",
    "costCategoryId",
    "pcrItemId",
    "dateOtherFundingSecured",
  ]);

  const documents = (pcrNode?.ContentDocumentLinks?.edges ?? []).map(node =>
    mapToDocumentSummaryDto(
      node,
      ["id", "dateCreated", "description", "fileName", "fileSize", "isOwner", "uploadedBy", "link", "linkedEntityId"],
      {
        type: "pcr",
        projectId,
        pcrId: pcrItemId,
      },
    ),
  );

  const costCategories = mapToCostCategoryDtoArray(data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [], [
    "id",
    "name",
    "displayOrder",
    "type",
    "competitionType",
    "organisationType",
  ]);

  const academicCostCategories = costCategories.filter(
    costCategory =>
      costCategory.organisationType === PCROrganisationType.Academic &&
      costCategory.competitionType === project.competitionType,
  );

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "awardRate",
      "contact1Email",
      "contact1Forename",
      "contact1Phone",
      "contact1Surname",
      "contact2Email",
      "contact2Forename",
      "contact2Phone",
      "contact2Surname",
      "financialYearEndDate",
      "financialYearEndTurnover",
      "hasOtherFunding",
      "isCommercialWork",
      "numberOfEmployees",
      "organisationName",
      "organisationType",
      "participantSize",
      "participantSizeLabel",
      "partnerType",
      "partnerTypeLabel",
      "projectCity",
      "projectLocation",
      "projectLocationLabel",
      "projectPostcode",
      "projectRole",
      "projectRoleLabel",
      "registeredAddress",
      "registrationNumber",
      "status",
      "tsbReference",
      "type",
    ],
    {},
  );

  // const spendProfileWithCostsAndFunds = new SpendProfile(pcrItemId).getSpendProfile(
  //   pcrSpendProfile,
  //   academicCostCategories,
  // );

  return {
    project,
    costCategories,
    academicCostCategories,
    pcrItem,
    pcrSpendProfile,
    // pcrItem: {
    //   ...pcrItem,
    //   spendProfile: spendProfileWithCostsAndFunds,
    // },
    partners,
    documents,
    fragmentRef: data?.salesforce?.uiapi,
  };
};

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
import { CostCategoryType } from "@framework/constants/enums";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

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
    "capitalUsageType",
    "costCategoryId",
    "costOfEach",
    "costPerItem",
    "dateOtherFundingSecured",
    "daysSpentOnProject",
    "depreciationPeriod",
    "description",
    "grossCostOfRole",
    "id",
    "netPresentValue",
    "numberOfTimes",
    "overheadRate",
    "pcrItemId",
    "quantity",
    "ratePerDay",
    "residualValue",
    "subcontractorCountry",
    "subcontractorRoleAndDescription",
    "typeLabel",
    "utilisation",
    "value",
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
      (costCategory.organisationType === PCROrganisationType.Academic &&
        costCategory.competitionType === project.competitionType) ||
      costCategory.type === CostCategoryType.Other_Public_Sector_Funding,
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

  const spendProfileCostCategories = costCategories.filter(
    x =>
      (x.competitionType === project.competitionType && x.organisationType === pcrItem.organisationType) ||
      x.type === CostCategoryType.Other_Public_Sector_Funding,
  );

  return {
    project,
    costCategories,
    academicCostCategories,
    spendProfileCostCategories,
    pcrItem,
    pcrSpendProfile,
    partners,
    documents,
    fragmentRef: data?.salesforce?.uiapi,
  };
};

export const getInitialAcademicCosts = (
  profile: PcrSpendProfileDto,
  costCategories: Pick<CostCategoryDto & { displayOrder: number }, "id" | "displayOrder" | "name" | "type">[],
) => {
  return costCategories
    .filter(x => x.type !== CostCategoryType.Other_Funding && x.type !== CostCategoryType.Other_Public_Sector_Funding)
    .sort((a, b) => (a.displayOrder > b.displayOrder ? 1 : -1))
    .map(x => {
      const matchingProfile = profile.costs.find(cost => cost.costCategoryId === x.id);
      if (matchingProfile) {
        return {
          id: matchingProfile.id,
          value: String(matchingProfile.value ?? 0),
          description: matchingProfile.description ?? "",
          costCategory: matchingProfile.costCategory,
          costCategoryId: matchingProfile.costCategoryId,
        };
      }

      return {
        id: "" as PcrId,
        value: "0",
        costCategoryId: x.id,
        description: x.name ?? "",
        costCategory: x.type,
      };
    });
};

import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { SpendProfile, mapPcrSpendProfileArray } from "@gql/dtoMapper/mapPcrSpendProfile";

import { spendProfileCostsQuery } from "./SpendProfileCosts.query";
import { noop } from "lodash";
import { createContext } from "react";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { CostCategoryItem } from "@framework/types/CostCategory";
import { BaseProps } from "@ui/containers/containerBase";
import { mapToDocumentSummaryDto } from "@gql/dtoMapper/mapDocumentsDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { SpendProfileCostsQuery } from "./__generated__/SpendProfileCostsQuery.graphql";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";
import { ClientErrorResponse } from "@framework/util/errorHandlers";

export const useSpendProfileCostsQuery = (
  projectId: ProjectId,
  pcrItemId: PcrItemId,
  costCategoryId: CostCategoryId,
  costId: CostId | undefined | null,
  fetchKey: number | undefined,
) => {
  const data = useLazyLoadQuery<SpendProfileCostsQuery>(
    spendProfileCostsQuery,
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
  const project = mapToProjectDto(projectNode, [
    "projectNumber",
    "status",
    "title",
    "roles",
    "competitionType",
    "typeOfAid",
  ]);

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

  const costCategories = mapToCostCategoryDtoArray(data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [], [
    "id",
    "name",
    "displayOrder",
    "type",
    "competitionType",
    "organisationType",
  ]);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "hasOtherFunding",
      "isCommercialWork",
      "organisationType",
      "status",
      "type",
      "projectRole",
      "partnerType",
      "typeOfAid",
    ],
    { typeOfAid: project.typeOfAid },
  );

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

  const spendProfile = new SpendProfile(pcrItemId).getSpendProfile(pcrSpendProfile, costCategories);

  const cost = spendProfile.costs.find(x => x.costCategoryId === costCategoryId && x.id === costId);

  const costCategory = costCategories.find(
    x => x.id === costCategoryId && x.competitionType === project.competitionType,
  );

  if (!costCategory) {
    throw new Error("Unable to find matching cost category: " + costCategoryId);
  }

  return {
    cost,
    project,
    costCategory,
    pcrItem,
    spendProfile,
    documents,
    fragmentRef: data?.salesforce?.uiapi,
  };
};

export type SpendProfileQueryReturnType = ReturnType<typeof useSpendProfileCostsQuery>;

type SpendProfileContextType = {
  isFetching: boolean;
  onUpdate: ({
    data,
    context,
  }: {
    data: Partial<FullPCRItemDto> & { spendProfile: Partial<PcrSpendProfileDto> };
    context: { link: ILinkInfo };
  }) => Promise<void>;
  cost: SpendProfileQueryReturnType["cost"];
  costCategoryType: CostCategoryItem;
  spendProfile: SpendProfileQueryReturnType["spendProfile"];
  routes: BaseProps["routes"];
  messages: BaseProps["messages"];
  project: SpendProfileQueryReturnType["project"];
  projectId: ProjectId;
  itemId: PcrItemId;
  pcrId: PcrId;
  costId: string;
  costCategoryId: CostCategoryId;
  documents: SpendProfileQueryReturnType["documents"];
  costCategory: SpendProfileQueryReturnType["costCategory"];
  pcrItem: SpendProfileQueryReturnType["pcrItem"];
  apiError: ClientErrorResponse | null;
  stepRoute: ILinkInfo;
  addNewItem: boolean;
  fragmentRef: unknown;
};

export const SpendProfileContext = createContext<SpendProfileContextType>({
  isFetching: false,
  onUpdate: noop,
} as SpendProfileContextType);

export const appendOrMerge = <T extends { id?: string | null }>(costs: T[], cost: T) => {
  const matchingIndex = costs.findIndex(x => x?.id === cost?.id);
  if (matchingIndex > -1) {
    const matchedCost = costs[matchingIndex];
    costs[matchingIndex] = { ...matchedCost, ...cost };
    return [...costs];
  } else {
    return [...costs, cost];
  }
};

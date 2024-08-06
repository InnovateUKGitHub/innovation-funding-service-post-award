import { useLazyLoadQuery, useMutation } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { SpendProfile, mapPcrSpendProfileArray } from "@gql/dtoMapper/mapPcrSpendProfile";

import { spendProfileCostsQuery } from "./SpendProfileCosts.query";
import { noop } from "lodash";
import { createContext, useState } from "react";
import { CostCategoryItem } from "@framework/types/CostCategory";
import { BaseProps } from "@ui/app/containerBase";
import { ClientErrorResponse } from "@framework/util/errorHandlers";
import { GraphqlError, isGraphqlError } from "@framework/types/IAppError";
import { mapToDocumentSummaryDto } from "@gql/dtoMapper/mapDocumentsDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { SpendProfileCostsQuery } from "./__generated__/SpendProfileCostsQuery.graphql";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { SpendProfileCreateItemMutation } from "./__generated__/SpendProfileCreateItemMutation.graphql";
import { spendProfileCreateItemMutation } from "./SpendProfileCreateItem.mutation";
import { SpendProfileUpdateItemMutation } from "./__generated__/SpendProfileUpdateItemMutation.graphql";
import { spendProfileUpdateItemMutation } from "./SpendProfileUpdateItem.mutation";
import { SalesforcePcrSpendProfileMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";

import { PcrSpendProfileEntityForCreate } from "@framework/entities/pcrSpendProfile";
import { SpendProfileDeleteItemMutation } from "./__generated__/SpendProfileDeleteItemMutation.graphql";
import { spendProfileDeleteItemMutation } from "./SpendProfileDeleteItem.mutation";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { useRecordTypesContext } from "@ui/context/recordTypes";

export const useSpendProfileCostsQuery = (
  projectId: ProjectId,
  pcrItemId: PcrItemId,
  costCategoryId: CostCategoryId,
  costId: CostId | undefined | null,
) => {
  const [fetchKey] = useFetchKey();

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: ({ data, context }: { data: any; context: { link: ILinkInfo } }) => void;
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
  apiError: ClientErrorResponse | GraphqlError | null;
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

export const useOnDeleteSpendProfileItem = (costId: CostId, projectId: ProjectId) => {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<GraphqlError | null>(null);

  const [commitDeleteMutation, isDeleteMutationInProgress] =
    useMutation<SpendProfileDeleteItemMutation>(spendProfileDeleteItemMutation);
  const [, setFetchKey] = useFetchKey();
  return {
    onUpdate({ context }: { context: { link: { path: string } } }) {
      commitDeleteMutation({
        variables: { id: costId, projectId },

        onError: (er: unknown) => {
          if (isGraphqlError(er)) {
            scrollToTheTopSmoothly();
            setApiError(er);
          }
        },
        onCompleted: () => {
          setFetchKey(x => x + 1);
          navigate(context?.link?.path ?? "");
        },
      });
    },
    isFetching: isDeleteMutationInProgress,
    apiError,
  };
};

export const useOnSaveSpendProfileItem = ({
  pcrItemId,
  costId,
  projectId,
  refreshItemWorkflowQuery,
}: {
  pcrItemId: PcrItemId;
  costId?: CostId;
  projectId: ProjectId;
  refreshItemWorkflowQuery: (() => Promise<void>) | null | undefined;
}) => {
  const navigate = useNavigate();
  const [, setFetchKey] = useFetchKey();
  const { clearMessages } = useMessageContext();

  const { getPcrSpendProfileRecordType } = useRecordTypesContext();

  const [commitCreateMutation, isCreateMutationInProgress] =
    useMutation<SpendProfileCreateItemMutation>(spendProfileCreateItemMutation);

  const [commitUpdateMutation, isUpdateMutationInProgress] =
    useMutation<SpendProfileUpdateItemMutation>(spendProfileUpdateItemMutation);

  const [apiError, setApiError] = useState<GraphqlError | null>(null);

  if (costId) {
    return {
      onUpdate: ({ data, context }: { data: PcrSpendProfileEntityForCreate; context: { link: { path: string } } }) => {
        const values = new SalesforcePcrSpendProfileMapper(getPcrSpendProfileRecordType()).mapToSalesforceForCreate({
          ...data,
          pcrItemId,
        });

        commitUpdateMutation({
          variables: { input: { Acc_IFSSpendProfile__c: values, Id: costId }, projectId },
          onError: (er: unknown) => {
            if (isGraphqlError(er)) {
              scrollToTheTopSmoothly();
              setApiError(er);
            }
          },
          onCompleted: () => {
            if (!!refreshItemWorkflowQuery) {
              refreshItemWorkflowQuery();
            }
            clearMessages();
            setFetchKey(k => k + 1);
            navigate(context?.link?.path ?? "");
          },
        });
      },
      isFetching: isUpdateMutationInProgress,
      apiError,
    };
  }
  return {
    onUpdate: ({ data, context }: { data: PcrSpendProfileEntityForCreate; context: { link: { path: string } } }) => {
      const values = new SalesforcePcrSpendProfileMapper(getPcrSpendProfileRecordType()).mapToSalesforceForCreate({
        ...data,
        pcrItemId,
      });

      commitCreateMutation({
        variables: { input: { Acc_IFSSpendProfile__c: values }, projectId },
        onError: (er: unknown) => {
          if (isGraphqlError(er)) {
            scrollToTheTopSmoothly();
            setApiError(er);
          }
        },
        onCompleted: () => {
          if (!!refreshItemWorkflowQuery) {
            refreshItemWorkflowQuery();
          }
          clearMessages();
          setFetchKey(k => k + 1);
          navigate(context?.link?.path ?? "");
        },
      });
    },
    isFetching: isCreateMutationInProgress,
    apiError,
  };
};

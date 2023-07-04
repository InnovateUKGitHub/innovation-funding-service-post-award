import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import head from "lodash/head";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToCostCategoryDtoArray } from "@gql/dtoMapper/mapCostCategoryDto";
import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToClaimDetailsWithLineItemsDtoArray } from "@gql/dtoMapper/mapClaimDetailsDto";
import { mapToForecastDetailsDtoArray } from "@gql/dtoMapper/mapForecastDetailsDto";
import { editClaimLineItemsQuery } from "./EditClaimLineItems.query";
import { EditClaimLineItemsQuery } from "./__generated__/EditClaimLineItemsQuery.graphql";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
// import { mapToClaimLineItemDtoArray } from "@gql/dtoMapper/mapClaimLineItemDto";

export const useEditClaimLineItemsData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  periodId: PeriodId,
  costCategoryId: string,
) => {
  const data = useLazyLoadQuery<EditClaimLineItemsQuery>(
    editClaimLineItemsQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId, costCategoryId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  const project = mapToProjectDto(projectNode, ["id", "title", "competitionType", "projectNumber", "isNonFec"]);

  const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

  const costCategories = mapToCostCategoryDtoArray(data?.salesforce?.uiapi?.query?.Acc_CostCategory__c?.edges ?? [], [
    "id",
    "name",
    "displayOrder",
    "type",
    "hintText",
    "isCalculated",
  ]);

  const documents = (data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [])
    .map(edge =>
      mapToProjectDocumentSummaryDtoArray(
        edge?.node?.ContentDocumentLinks?.edges ?? [],
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        { projectId, currentUser: { email: data?.currentUser?.email ?? "unknown email" } },
      ),
    )
    .flat();

  // const claimLineItems = mapToClaimLineItemDtoArray(
  //   claimsGql?.filter(x => x?.node?.RecordType?.Name?.value === "Claims Line Item"),
  //   ["id", "isAuthor", "lastModifiedDate", "value", "description"],
  //   {
  //     currentUser: Object.assign({}, { email: "unknown email", isSystemUser: false }, data?.currentUser),
  //   },
  // );

  // const claimsDetails = mapToClaimDetailsDtoArray(
  //   claimsGql.filter(x => x?.node?.RecordType?.Name?.value === "Claims Detail"),
  //   ["isAuthor", "value", "comments", "lineItems"],
  //   {
  //     currentUser: Object.assign({}, { email: "unknown email", isSystemUser: false }, data?.currentUser),
  //   },
  // );

  const claimsDetails = mapToClaimDetailsWithLineItemsDtoArray(
    claimsGql,
    ["isAuthor", "value", "comments"],
    ["id", "isAuthor", "lastModifiedDate", "value", "description"],
    { currentUser: Object.assign({}, { email: "unknown email", isSystemUser: false }, data?.currentUser) },
  );

  const claimDetails = head(claimsDetails);

  if (!claimDetails) throw new Error("Matching claim details not found");

  const forecastDetails = mapToForecastDetailsDtoArray(profileGql, ["value"]);
  console.log("forecastDetails", forecastDetails);
  const forecastDetail = head(forecastDetails) || {
    costCategoryId,
    periodId,
    value: 0,
  };

  const claimOverrides = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? []);
  return {
    project,
    claimDetails,
    claimOverrides,
    forecastDetail,
    costCategories,
    documents,
  };
};

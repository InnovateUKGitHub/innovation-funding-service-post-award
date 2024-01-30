import { mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { upliftSummaryQuery } from "./UpliftSummary.query";
import { UpliftSummaryQuery } from "./__generated__/UpliftSummaryQuery.graphql";

const useUpliftSummaryQuery = ({
  projectId,
  pcrId,
  pcrItemId,
}: {
  projectId: ProjectId;
  pcrId: PcrId;
  pcrItemId: PcrItemId;
}) => {
  const data = useLazyLoadQuery<UpliftSummaryQuery>(upliftSummaryQuery, {
    pcrId,
    pcrItemId,
  });

  const { node: pcrNode } = getFirstEdge(data?.salesforce.uiapi.query.Header?.edges ?? []);
  const { node: pcrItemNode } = getFirstEdge(data?.salesforce.uiapi.query.Child?.edges ?? []);

  const pcr = mapToPcrDto(
    {
      head: pcrNode,
      children: [pcrItemNode],
    },
    ["requestNumber"],
    ["reasoningComments"],
    {},
  );

  const documents = mapToProjectDocumentSummaryDtoArray(
    data?.salesforce.uiapi.query.Documents?.edges ?? [],
    ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
    { projectId, type: "pcr", pcrId },
  );

  return { pcr, documents };
};

export { useUpliftSummaryQuery };

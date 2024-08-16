import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { DocumentEditProps, DocumentEdit as DocumentEditComponent } from "./DocumentView";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import {
  ProjectDocumentViewFragment$data,
  ProjectDocumentViewFragment$key,
} from "./__generated__/ProjectDocumentViewFragment.graphql";
import { useFragment } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { projectDocumentViewFragment } from "./ProjectDocumentView.fragment";

import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

export const DocumentEdit = (props: Omit<DocumentEditProps<DocumentSummaryDto>, "documents">) => {
  const fragmentRef = useFragmentContext();
  if (!isValidFragmentKey<ProjectDocumentViewFragment$key>(fragmentRef, "ProjectDocumentViewFragment")) {
    throw new Error("DocumentEdit is missing a ProjectDocumentViewFragment reference");
  }

  const fragment: ProjectDocumentViewFragment$data = useFragment(projectDocumentViewFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.ProjectDocumentView_Project?.edges);

  const project = mapToProjectDto(projectNode, ["roles", "partnerRoles", "id"]);

  const documents = mapToPartnerDocumentSummaryDtoArray(
    fragment?.query?.ProjectDocumentView_Partner?.edges ?? [],
    [
      "partnerId",
      "id",
      "fileName",
      "fileSize",
      "description",
      "dateCreated",
      "uploadedBy",
      "link",
      "isOwner",
      "partnerName",
      "linkedEntityId",
    ],
    {
      projectId: project.id,
      currentUserRoles: project.roles,
      partnerRoles: project.partnerRoles,
    },
  );

  return <DocumentEditComponent documents={documents} {...props} />;
};

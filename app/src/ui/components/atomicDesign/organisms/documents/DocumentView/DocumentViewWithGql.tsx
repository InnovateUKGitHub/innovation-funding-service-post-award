import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import {
  DocumentView as DocumentViewComponent,
  DocumentViewProps,
  DocumentEdit as DocumentEditComponent,
  DocumentEditProps,
} from "./DocumentView";
import { useFragmentContext } from "@gql/fragmentContextHook";
import { DocumentViewFragment$key } from "./__generated__/DocumentViewFragment.graphql";
import { isValidFragmentKey } from "@gql/isValidFragmentKey";
import { useFragment } from "react-relay";
import { documentViewFragment } from "./DocumentViewFragment";
import { DocumentSummaryNode, mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";

export const DocumentView = <T extends DocumentSummaryDto>({
  partnerId,
  periodId,
  projectId,
  email,
  ...props
}: Omit<DocumentViewProps<T>, "documents"> & {
  projectId: ProjectId;
  periodId: PeriodId;
  partnerId: PartnerId;
  email: string;
}) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<DocumentViewFragment$key>(fragmentRef, "DocumentViewFragment")) {
    throw new Error("Document View component is missing a DocumentViewFragment reference");
  }

  const fragment = useFragment(documentViewFragment, fragmentRef);

  const documents = (fragment?.query?.DocumentView_Claims?.edges ?? [])
    .map(docs =>
      mapToProjectDocumentSummaryDtoArray(
        docs?.node?.ContentDocumentLinks?.edges ?? ([] as DocumentSummaryNode[]),
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          currentUser: { email: email ?? "unknown email" },
          type: docs?.node?.RecordType?.Name?.value === "Claims Detail" ? "claim details" : "claims",
          partnerId,
          periodId,
          costCategoryId: docs?.node?.Acc_CostCategory__c?.value ?? "",
        },
      ),
    )
    .flat() as DocumentViewProps<T>["documents"];

  return <DocumentViewComponent documents={documents} {...props} />;
};

export const DocumentEdit = ({
  partnerId,
  periodId,
  projectId,
  email,
  ...props
}: Omit<DocumentEditProps<DocumentSummaryDto>, "documents"> & {
  projectId: ProjectId;
  periodId: PeriodId;
  partnerId: PartnerId;
  email: string;
}) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<DocumentViewFragment$key>(fragmentRef, "DocumentViewFragment")) {
    throw new Error("Document Edit component is missing a DocumentViewFragment reference");
  }

  const fragment = useFragment(documentViewFragment, fragmentRef);

  const documents = (fragment?.query?.DocumentView_Claims?.edges ?? [])
    .map(docs =>
      mapToProjectDocumentSummaryDtoArray(
        docs?.node?.ContentDocumentLinks?.edges ?? ([] as DocumentSummaryNode[]),
        ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
        {
          projectId,
          currentUser: { email: email ?? "unknown email" },
          type: docs?.node?.RecordType?.Name?.value === "Claims Detail" ? "claim details" : "claims",
          partnerId,
          periodId,
          costCategoryId: docs?.node?.Acc_CostCategory__c?.value ?? "",
        },
      ),
    )
    .flat() as DocumentEditProps<DocumentSummaryDto>["documents"];

  return <DocumentEditComponent documents={documents} {...props} />;
};

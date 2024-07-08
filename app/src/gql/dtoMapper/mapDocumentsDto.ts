import { DocumentDescription, DocumentDescriptionMapper } from "@framework/constants/documentDescription";
import { PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";

export type DocumentSummaryNode = GQL.PartialNode<{
  readonly node: GQL.Maybe<{
    readonly LinkedEntityId?: GQL.Value<string>;
    readonly isFeedAttachment: boolean;
    readonly isOwner: boolean;
    readonly ContentDocument: GQL.Maybe<{
      readonly Id: GQL.Maybe<string>;
      readonly LastModifiedBy: GQL.Maybe<{
        ContactId: GQL.Value<string>;
      }>;
      readonly ContentSize: GQL.Value<number>;
      readonly CreatedBy: GQL.Maybe<{
        readonly Name: GQL.Value<string>;
        readonly Id: string | null;
      }>;
      readonly CreatedDate: GQL.Value<string>;
      readonly Description: GQL.Value<string>;
      readonly LatestPublishedVersionId: GQL.Value<string>;
      readonly FileExtension: GQL.Value<string>;
      readonly Title: GQL.Value<string>;
    }>;
  }>;
}>;

type PartnerDocumentsArrayNode = GQL.Maybe<{
  readonly node: GQL.Maybe<{
    readonly Id: string | null;
    readonly Acc_AccountId__r: GQL.Maybe<{
      readonly Name: GQL.Value<string>;
    }>;
    readonly Acc_AccountId__c: GQL.Value<string>;
    readonly ContentDocumentLinks: GQL.Maybe<{
      readonly edges: GQL.Maybe<ReadonlyArray<GQL.Maybe<DocumentSummaryNode>>>;
    }>;
  }>;
}>;

type DocumentSummaryDtoMapping = PartnerDocumentSummaryDtoGql & { description: DocumentDescription | null };

const mapper: GQL.DtoMapper<
  DocumentSummaryDtoMapping,
  DocumentSummaryNode,
  {
    projectId: ProjectId;
    partnerName?: string;
    partnerId?: PartnerId;
    periodId?: PeriodId;
    costCategoryId?: string;
    pcrId?: PcrId | PcrItemId;
    loanId?: LoanId;
    type: "projects" | "partners" | "claims" | "claim details" | "pcr" | "loan";
  }
> = {
  id(node) {
    return node?.node?.ContentDocument?.Id ?? "";
  },
  link(node, { projectId, partnerId, periodId, type, costCategoryId, pcrId, loanId }) {
    const fileId = node?.node?.ContentDocument?.LatestPublishedVersionId?.value ?? "";
    const linkedEntityId = node?.node?.LinkedEntityId?.value;

    switch (type) {
      case "projects":
        return `/api/documents/projects/${projectId}/${fileId}/content`;
      case "partners":
        return `/api/documents/partners/${projectId}/${linkedEntityId}/${fileId}/content`;
      case "claims":
        return `/api/documents/claims/${projectId}/${partnerId}/${periodId}/${fileId}/content`;
      case "claim details":
        return `/api/documents/claim-details/${projectId}/${partnerId}/${periodId}/${costCategoryId}/${fileId}/content`;
      case "loan":
        return `/api/documents/loans/${projectId}/${loanId}/${fileId}/content`;
      case "pcr":
        return `/api/documents/projectChangeRequests/${projectId}/${linkedEntityId ?? pcrId}/${fileId}/content`;
    }
  },
  fileName(node) {
    return node?.node?.ContentDocument?.FileExtension?.value
      ? `${node?.node?.ContentDocument?.Title?.value}.${node?.node?.ContentDocument?.FileExtension?.value ?? ""}`
      : node?.node?.ContentDocument?.Title?.value ?? "";
  },
  description(node) {
    return new DocumentDescriptionMapper().mapFromSalesforceDocumentDescription(
      node?.node?.ContentDocument?.Description?.value ?? "unknown",
    );
  },
  fileSize(node) {
    return node?.node?.ContentDocument?.ContentSize?.value ?? 0;
  },
  dateCreated(node) {
    return node?.node?.ContentDocument?.CreatedDate?.value
      ? new Date(node?.node?.ContentDocument?.CreatedDate?.value)
      : new Date(NaN);
  },
  uploadedBy(node, { partnerName }) {
    if (!node?.node?.ContentDocument?.LastModifiedBy?.ContactId?.value) {
      return "Innovate UK";
    }
    return `${node?.node?.ContentDocument?.CreatedBy?.Name?.value ?? ""}${partnerName ? " of " + partnerName : ""}`;
  },
  isOwner(node) {
    return !!node?.node?.isOwner;
  },
  partnerId(node, { partnerId }) {
    return partnerId as PartnerId;
  },
  linkedEntityId(node) {
    return (node?.node?.LinkedEntityId?.value ?? "unknown-linked-entity-id") as LinkedEntityId;
  },
  partnerName(node, { partnerName }) {
    return partnerName ?? "";
  },
};

/**
 * Maps a specified claim DocumentNode from a GQL query to a slice of
 * the DocumentSummaryDto to ensure consistency and compatibility in the application
 */
export function mapToDocumentSummaryDto<
  T extends DocumentSummaryNode,
  PickList extends keyof PartnerDocumentSummaryDtoGql,
>(
  node: T,
  pickList: PickList[],
  additionalData: {
    projectId: ProjectId;
    partnerName?: string;
    partnerId?: PartnerId;
    periodId?: PeriodId;
    pcrId?: PcrId | PcrItemId;
    costCategoryId?: string;
    loanId?: LoanId;
    type: "projects" | "partners" | "claims" | "claim details" | "pcr" | "loan";
  },
): Pick<PartnerDocumentSummaryDtoGql, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<PartnerDocumentSummaryDtoGql, PickList>,
  );
}

/**
 * Maps an array of document summaries to the dto pattern for partner documents
 *
 * it requires `projectId` and `currentUser` to be passed in as third arg
 */
export function mapToPartnerDocumentSummaryDtoArray<
  T extends ReadonlyArray<PartnerDocumentsArrayNode | null> | null,
  PickList extends ArrayWithRequired<"partnerId", keyof Omit<PartnerDocumentSummaryDtoGql, "partnerId">>,
>(
  edges: T,
  pickList: PickList,
  additionalData: {
    projectId: ProjectId;
    currentUserRoles: SfRoles;
    partnerRoles: SfPartnerRoles[];
  },
) {
  return (
    (edges ?? [])
      .map(edge =>
        (edge?.node?.ContentDocumentLinks?.edges ?? [])
          .filter(doc => !doc?.node?.isFeedAttachment)
          .map(doc =>
            mapToDocumentSummaryDto(doc ?? null, pickList, {
              ...additionalData,
              partnerName: edge?.node?.Acc_AccountId__r?.Name?.value ?? "",
              partnerId: (edge?.node?.Id ?? "") as PartnerId,
              type: "partners",
            }),
          ),
      )
      // if isFc or Pm, filter out document summaries belonging to other partners
      .filter(x => {
        if (additionalData.currentUserRoles.isMo) return true;

        const partnerRoles = additionalData?.partnerRoles ?? [];
        const partnerRole = partnerRoles.find(roles => roles?.partnerId === x[0]?.partnerId);

        return !!partnerRole?.isPm || !!partnerRole?.isFc;
      })
      .flat()
  );
}

/**
 * Maps an array of document summaries to the dto pattern for project level documents
 *
 * it requires `projectId` and `currentUser` to be passed in as third arg
 */
export function mapToProjectDocumentSummaryDtoArray<
  T extends GQL.Maybe<ReadonlyArray<GQL.Maybe<DocumentSummaryNode>>>,
  PickList extends keyof PartnerDocumentSummaryDtoGql,
>(
  edges: T,
  pickList: PickList[],
  additionalData: {
    projectId: ProjectId;
    partnerId?: PartnerId;
    periodId?: PeriodId;
    costCategoryId?: string;
    pcrId?: PcrId | PcrItemId;
    type: "projects" | "claims" | "claim details" | "pcr";
  },
) {
  return (edges ?? [])
    .filter(x => !x?.node?.isFeedAttachment)
    .map(x =>
      mapToDocumentSummaryDto(x ?? null, pickList, {
        ...additionalData,
        partnerName: "",
      }),
    );
}

import { DocumentDescription } from "@framework/constants/documentDescription";
import { PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";

export type DocumentSummaryNode = {
  readonly node: {
    readonly LinkedEntityId?: GQL.Value<string>;
    readonly isFeedAttachment: boolean;
    readonly isOwner: boolean;
    readonly ContentDocument: {
      readonly Id: string | null;
      readonly LastModifiedBy: {
        ContactId: GQL.Value<string>;
      } | null;
      readonly ContentSize: GQL.Value<number>;
      readonly CreatedBy: {
        readonly Name: GQL.Value<string>;
        readonly Id: string | null;
      } | null;
      readonly CreatedDate: GQL.Value<string>;
      readonly Description: GQL.Value<string>;
      readonly LatestPublishedVersionId: GQL.Value<string>;
      readonly FileExtension: GQL.Value<string>;
      readonly Title: GQL.Value<string>;
    } | null;
  } | null;
} | null;

type PartnerDocumentsArrayNode = {
  readonly node: {
    readonly Id: string | null;
    readonly Acc_AccountId__r: {
      readonly Name: GQL.Value<string>;
    } | null;
    readonly Acc_AccountId__c: GQL.Value<string>;
    readonly ContentDocumentLinks: {
      readonly edges: ReadonlyArray<DocumentSummaryNode | null> | null;
    } | null;
  } | null;
} | null;

type DocumentSummaryDtoMapping = PartnerDocumentSummaryDtoGql;

const mapper: GQL.DtoMapper<
  DocumentSummaryDtoMapping,
  DocumentSummaryNode,
  {
    projectId: ProjectId;
    partnerName?: string;
    partnerId?: PartnerId;
    periodId?: PeriodId;
    costCategoryId?: string;
    pcrId?: PcrId;
    type: "projects" | "partners" | "claims" | "claim details" | "pcr";
  }
> = {
  id(node) {
    return node?.node?.ContentDocument?.Id ?? "";
  },
  link(node, { projectId, partnerId, periodId, type, costCategoryId, pcrId }) {
    const fileId = node?.node?.ContentDocument?.LatestPublishedVersionId?.value ?? "";
    const linkedEntityId = node?.node?.LinkedEntityId?.value ?? "unknown-linked-entity-id";

    switch (type) {
      case "projects":
        return `/api/documents/projects/${projectId}/${fileId}/content`;
      case "partners":
        return `/api/documents/partners/${projectId}/${linkedEntityId}/${fileId}/content`;
      case "claims":
        return `/api/documents/claims/${projectId}/${partnerId}/${periodId}/${fileId}/content`;
      case "claim details":
        return `/api/documents/claim-details/${projectId}/${partnerId}/${periodId}/${costCategoryId}/${fileId}/content`;
      case "pcr":
        return `/api/documents/projectChangeRequests/${projectId}/${pcrId}/${fileId}/content`;
    }
  },
  fileName(node) {
    return node?.node?.ContentDocument?.FileExtension?.value
      ? `${node?.node?.ContentDocument?.Title?.value}.${node?.node?.ContentDocument?.FileExtension?.value ?? ""}`
      : node?.node?.ContentDocument?.Title?.value ?? "";
  },
  description(node) {
    return (
      (DocumentDescription[
        (node?.node?.ContentDocument?.Description?.value ?? "unknown") as unknown as DocumentDescription
      ] as unknown as DocumentDescription) ?? null
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
    pcrId?: PcrId;
    costCategoryId?: string;
    type: "projects" | "partners" | "claims" | "claim details" | "pcr";
  },
): Pick<PartnerDocumentSummaryDtoGql, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node, additionalData);
    return dto;
  }, {} as Pick<PartnerDocumentSummaryDtoGql, PickList>);
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
  T extends ReadonlyArray<DocumentSummaryNode | null> | null,
  PickList extends keyof Omit<PartnerDocumentSummaryDtoGql, "linkedEntityId">,
>(
  edges: T,
  pickList: PickList[],
  additionalData: {
    projectId: ProjectId;
    partnerId?: PartnerId;
    periodId?: PeriodId;
    costCategoryId?: string;
    pcrId?: PcrId;
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

import { DocumentDescription } from "@framework/constants/documentDescription";
import { PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";

export type DocumentSummaryNode = {
  readonly node: {
    readonly LinkedEntityId?: GQL.Value<string>;
    readonly ContentDocument: {
      readonly Id: string | null;
      readonly LastModifiedBy: {
        ContactId: GQL.Value<string>;
      } | null;
      readonly ContentSize: GQL.Value<number>;
      readonly CreatedBy: {
        readonly Name: GQL.Value<string>;
        readonly Username: GQL.Value<string>;
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
    currentUser: { email: string };
    partnerName: string;
    partnerId: PartnerId;
  }
> = {
  id(node) {
    return node?.node?.ContentDocument?.Id ?? "";
  },
  link(node, { projectId, partnerId }) {
    const fileId = node?.node?.ContentDocument?.LatestPublishedVersionId?.value ?? "";
    const linkedEntityId = node?.node?.LinkedEntityId?.value ?? "unknown-linked-entity-id";

    return !!partnerId
      ? `/api/documents/partners/${projectId}/${linkedEntityId}/${fileId}/content`
      : `/api/documents/projects/${projectId}/${fileId}/content`;
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
  isOwner(node, { currentUser }) {
    return (
      typeof node?.node?.ContentDocument?.CreatedBy?.Username?.value === "string" &&
      node?.node?.ContentDocument?.CreatedBy?.Username?.value?.toLowerCase() === currentUser?.email?.toLowerCase()
    );
  },
  partnerId(node, { partnerId }) {
    return partnerId as PartnerId;
  },
  linkedEntityId(node) {
    return (node?.node?.LinkedEntityId?.value ?? "unknown-linked-entity-id") as LinkedEntityId;
  },
  partnerName(node, { partnerName }) {
    return partnerName;
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
  additionalData: { projectId: ProjectId; currentUser: { email: string }; partnerName: string; partnerId: PartnerId },
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
    currentUser: { email: string };
    currentUserRoles: SfRoles;
    partnerRoles: SfPartnerRoles[];
  },
) {
  return (
    (edges ?? [])
      .map(edge =>
        (edge?.node?.ContentDocumentLinks?.edges ?? []).map(doc =>
          mapToDocumentSummaryDto(doc ?? null, pickList, {
            ...additionalData,
            partnerName: edge?.node?.Acc_AccountId__r?.Name?.value ?? "",
            partnerId: (edge?.node?.Acc_AccountId__c?.value ?? "") as PartnerId,
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
>(edges: T, pickList: PickList[], additionalData: { projectId: ProjectId; currentUser: { email: string } }) {
  return (edges ?? []).map(x =>
    mapToDocumentSummaryDto(x ?? null, pickList, {
      ...additionalData,
      partnerId: "" as PartnerId,
      partnerName: "",
    }),
  );
}

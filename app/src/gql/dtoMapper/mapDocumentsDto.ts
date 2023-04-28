import { DocumentDescription } from "@framework/constants";
import { PartnerDocumentSummaryDto } from "@framework/dtos";

type DocumentSummaryNode = {
  readonly node: {
    readonly ContentDocument: {
      readonly Id: string | null;
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
    readonly ContentDocumentLinks: {
      readonly edges: ReadonlyArray<DocumentSummaryNode | null> | null;
    } | null;
  } | null;
} | null;

type DocumentSummaryDtoMapping = PartnerDocumentSummaryDto;

const mapper: GQL.DtoMapper<
  DocumentSummaryDtoMapping,
  DocumentSummaryNode,
  { projectId: ProjectId; currentUser: { email: string }; partnerName: string; partnerId: PartnerId }
> = {
  id: function (node) {
    return node?.node?.ContentDocument?.Id ?? "";
  },
  link: function (node, { projectId, partnerId }) {
    const fileId = node?.node?.ContentDocument?.LatestPublishedVersionId?.value ?? "";
    return !!partnerId
      ? `/api/documents/partners/${projectId}/${partnerId}/${fileId}/content`
      : `/api/documents/partners/${projectId}/${fileId}/content`;
  },
  fileName: function (node) {
    return node?.node?.ContentDocument?.FileExtension?.value
      ? `${node?.node?.ContentDocument?.Title?.value}.${node?.node?.ContentDocument?.FileExtension?.value ?? ""}`
      : node?.node?.ContentDocument?.Title?.value ?? "";
  },
  description: function (node) {
    return (
      (DocumentDescription[
        (node?.node?.ContentDocument?.Description?.value ?? "unknown") as unknown as DocumentDescription
      ] as unknown as DocumentDescription) ?? null
    );
  },
  fileSize: function (node) {
    return node?.node?.ContentDocument?.ContentSize?.value ?? 0;
  },
  dateCreated: function (node) {
    return new Date(node?.node?.ContentDocument?.CreatedDate?.value ?? "");
  },
  uploadedBy: function (node, { partnerName }) {
    return `${node?.node?.ContentDocument?.CreatedBy?.Name?.value ?? ""} of ${partnerName ?? ""}`;
  },
  isOwner: function (node, { currentUser }) {
    return (
      typeof node?.node?.ContentDocument?.CreatedBy?.Username?.value === "string" &&
      node?.node?.ContentDocument?.CreatedBy?.Username?.value === currentUser?.email
    );
  },
  partnerId: function (node, { partnerId }) {
    return partnerId;
  },
  partnerName: function (node, { partnerName }) {
    return partnerName;
  },
};

/**
 * Maps a specified claim DocumentNode from a GQL query to a slice of
 * the DocumentSummaryDto to ensure consistency and compatibility in the application
 */
export function mapToDocumentSummaryDto<
  T extends DocumentSummaryNode,
  PickList extends keyof PartnerDocumentSummaryDto,
>(
  node: T,
  pickList: PickList[],
  additionalData: { projectId: ProjectId; currentUser: { email: string }; partnerName: string; partnerId: PartnerId },
): Pick<PartnerDocumentSummaryDto, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node, additionalData);
    return dto;
  }, {} as Pick<PartnerDocumentSummaryDto, PickList>);
}

/**
 * Maps an array of document summaries to the dto pattern for partner documents
 *
 * it requires `projectId` and `currentUser` to be passed in as third arg
 */
export function mapToPartnerDocumentSummaryDtoArray<
  T extends ReadonlyArray<PartnerDocumentsArrayNode | null> | null,
  PickList extends ArrayWithRequired<"partnerId", keyof Omit<PartnerDocumentSummaryDto, "partnerId">>,
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
            partnerId: (edge?.node?.Id ?? "") as PartnerId,
          }),
        ),
      )
      // if isFc filter out document summaries belonging to other partners
      .filter(x =>
        additionalData.currentUserRoles.isFc &&
        !(additionalData.currentUserRoles.isPm || additionalData.currentUserRoles.isMo)
          ? (additionalData?.partnerRoles ?? []).find(roles => roles?.partnerId === x[0]?.partnerId)?.isFc
          : x,
      )
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
  PickList extends keyof PartnerDocumentSummaryDto,
>(edges: T, pickList: PickList[], additionalData: { projectId: ProjectId; currentUser: { email: string } }) {
  return (edges ?? []).map(x =>
    mapToDocumentSummaryDto(x ?? null, pickList, { ...additionalData, partnerId: "" as PartnerId, partnerName: "" }),
  );
}

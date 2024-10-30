import { ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { mapToPCRStatus } from "@framework/mappers/pcr";
import { Clock } from "@framework/util/clock";

const clock = new Clock();

// on Acc_StatusChange__c

type PcrStatusNode = GQL.PartialNode<{
  Id: string;
  Acc_ProjectChangeRequest__c: GQL.Value<string>;
  Acc_PreviousProjectChangeRequestStatus__c: GQL.Value<string>;
  Acc_NewProjectChangeRequestStatus__c: GQL.Value<string>;
  CreatedDate: GQL.Value<string>;
  Acc_ExternalComment__c: GQL.Value<string>;
  Acc_CreatedByAlias__c: GQL.Value<string>;
  Acc_ParticipantVisibility__c: GQL.Value<boolean>;
}>;

type PcrStatusDtoMapping = ProjectChangeRequestStatusChangeDto & { pcrId: PcrId };

const mapper: GQL.DtoMapper<PcrStatusDtoMapping, PcrStatusNode, { roles?: SfRoles }> = {
  id(node) {
    return node?.Id ?? "";
  },
  projectChangeRequest(node) {
    return (node?.Acc_ProjectChangeRequest__c?.value ?? "unknown") as PcrId;
  },
  pcrId(node) {
    return (node?.Acc_ProjectChangeRequest__c?.value ?? "unknown") as PcrId;
  },
  createdBy(node) {
    return node?.Acc_CreatedByAlias__c?.value ?? "unknown";
  },
  createdDate(node) {
    return !!node?.CreatedDate?.value ? clock.parseRequiredSalesforceDateTime(node?.CreatedDate?.value) : new Date();
  },
  previousStatus(node) {
    return mapToPCRStatus(node?.Acc_PreviousProjectChangeRequestStatus__c?.value ?? "unknown");
  },
  previousStatusLabel(node) {
    return node?.Acc_PreviousProjectChangeRequestStatus__c?.value ?? "unknown";
  },
  newStatus(node) {
    return mapToPCRStatus(node?.Acc_NewProjectChangeRequestStatus__c?.value ?? "unknown");
  },
  newStatusLabel(node) {
    return node?.Acc_NewProjectChangeRequestStatus__c?.value ?? "unknown";
  },

  comments(node, additionalData) {
    /**
     * Required fields include:
     * Acc_ParticipantVisibility__c
     * Acc_ExternalComment__c
     * roles from Acc_Project__c
     */
    if (additionalData?.roles?.isMo || (additionalData?.roles?.isPm && node?.Acc_ParticipantVisibility__c?.value)) {
      return node?.Acc_ExternalComment__c?.value ?? null;
    }
    return null;
  },
  participantVisibility(node) {
    return node?.Acc_ParticipantVisibility__c?.value ?? false;
  },
};

type PcrStatusAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [
    ["comments", "roles", SfRoles], // get from Acc_Project__c
  ]
>;

/**
 * Maps a specified PcrStatus Node from a GQL query to a slice of
 * the PcrStatusDto to ensure consistency and compatibility in the application
 */
export function mapToPcrStatusDto<T extends PcrStatusNode, PickList extends keyof PcrStatusDtoMapping>(
  node: T,
  pickList: PickList[],
  additionalData: PcrStatusAdditionalData<PickList>,
): Pick<PcrStatusDtoMapping, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<PcrStatusDtoMapping, PickList>,
  );
}

/**
 * Maps PcrStatus Edge to array of PcrStatus dtos.
 */
export function mapToPcrStatusDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: PcrStatusNode }>> | null,
  PickList extends keyof PcrStatusDtoMapping,
>(
  edges: T,
  pickList: PickList[],
  additionalData: PcrStatusAdditionalData<PickList>,
): Pick<PcrStatusDtoMapping, PickList>[] {
  return (
    edges?.map(node => {
      return mapToPcrStatusDto(node?.node ?? null, pickList, additionalData);
    }) ?? []
  );
}

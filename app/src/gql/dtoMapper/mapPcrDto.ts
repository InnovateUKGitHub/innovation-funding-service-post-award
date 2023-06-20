import { TypeOfAid } from "@framework/constants/project";
import { PCRDto, FullPCRItemDto } from "@framework/dtos/pcrDtos";
import {
  getPCROrganisationType,
  mapToPCRItemStatus,
  mapFromSalesforcePCRProjectRole,
  mapTypeOfAidToEnum,
  mapToPCRStatus,
  mapFromSalesforcePCRPartnerType,
  mapToPcrItemType,
} from "@framework/mappers/pcr";
import { Clock } from "@framework/util/clock";

// on Project_Change_Requests__r

const clock = new Clock();

export type PcrNode = Readonly<
  Partial<{
    Id: string;
    Acc_ExistingPartnerName__c: GQL.Value<string>;
    Acc_OtherFunding__c: GQL.Value<boolean>;
    Acc_CommercialWork__c: GQL.Value<boolean>;
    Acc_NewOrganisationName__c: GQL.Value<string>;
    Acc_RequestHeader__c: GQL.Value<string>;
    Acc_RequestNumber__c: GQL.Value<number>;
    Acc_MarkedasComplete__c: GQL.Value<string>;
    Acc_OrganisationName__c: GQL.Value<string>;
    Acc_ParticipantType__c: GQL.Value<string>;
    CreatedDate: GQL.Value<string>;
    Acc_Status__c: GQL.Value<string>;
    Acc_Project__c: GQL.Value<string>;
    Acc_ProjectRole__c: GQL.Value<string>;
    LastModifiedDate: GQL.Value<string>;
    RecordType: {
      Name?: GQL.ValueAndLabel<string>;
      Id?: string | null;
    } | null;
  }>
> | null;

type PcrDtoMapping = Pick<
  PCRDto,
  "id" | "requestNumber" | "projectId" | "started" | "lastUpdated" | "reasoningStatus" | "status" | "statusName"
>;

type PcrItemDtoMapping = Pick<
  FullPCRItemDto,
  | "accountName"
  | "hasOtherFunding"
  | "id"
  | "isCommercialWork"
  | "organisationName"
  | "organisationType"
  | "partnerNameSnapshot"
  | "partnerType"
  | "projectRole"
  | "shortName"
  | "status"
  | "type"
  | "typeName"
  | "typeOfAid"
>;

/**
 * Mapper for PCR Child items
 */
const itemMapper: GQL.DtoMapper<PcrItemDtoMapping, PcrNode, { typeOfAid?: string | TypeOfAid }> = {
  accountName(node) {
    return node?.Acc_NewOrganisationName__c?.value ?? null;
  },
  hasOtherFunding(node) {
    return node?.Acc_OtherFunding__c?.value ?? null;
  },
  id(node) {
    return node?.Id as PcrItemId;
  },
  isCommercialWork(node) {
    return node?.Acc_CommercialWork__c?.value ?? null;
  },
  organisationName(node) {
    return node?.Acc_OrganisationName__c?.value ?? null;
  },
  organisationType(node) {
    return getPCROrganisationType(mapFromSalesforcePCRPartnerType(node?.Acc_ParticipantType__c?.value ?? ""));
  },
  partnerNameSnapshot(node) {
    return node?.Acc_ExistingPartnerName__c?.value ?? null;
  },
  partnerType(node) {
    return mapFromSalesforcePCRPartnerType(node?.Acc_ParticipantType__c?.value ?? "");
  },
  projectRole(node) {
    return mapFromSalesforcePCRProjectRole(node?.Acc_ProjectRole__c?.value ?? "");
  },
  shortName(node) {
    return node?.RecordType?.Name?.value ?? "Unknown";
  },
  status(node) {
    return mapToPCRItemStatus(node?.Acc_MarkedasComplete__c?.value ?? "");
  },
  type(node) {
    return mapToPcrItemType(node?.RecordType?.Name?.value ?? "Unknown");
  },
  typeName(node) {
    return node?.RecordType?.Name?.label ?? "Unknown";
  },
  typeOfAid(node, additionalData) {
    /* possible to be passed in as TypeofAid enum from project mapper or as string from salesforce */
    return additionalData?.typeOfAid === undefined
      ? TypeOfAid.Unknown
      : typeof additionalData.typeOfAid === "string"
      ? mapTypeOfAidToEnum(additionalData?.typeOfAid)
      : additionalData.typeOfAid;
  },
};

/**
 * Mapper for the PCR header node
 */
const headMapper: GQL.DtoMapper<PcrDtoMapping, PcrNode> = {
  id(node) {
    return (node?.Id ?? "") as PcrId;
  },
  lastUpdated(node) {
    return node?.LastModifiedDate?.value
      ? clock.parseRequiredSalesforceDateTime(node?.LastModifiedDate?.value)
      : new Date();
  },
  projectId(node) {
    return (node?.Acc_Project__c?.value ?? "unknown-project-id") as ProjectId;
  },
  reasoningStatus(node) {
    return mapToPCRItemStatus(node?.Acc_MarkedasComplete__c?.value ?? "");
  },
  requestNumber(node) {
    return node?.Acc_RequestNumber__c?.value ?? 0;
  },
  started(node) {
    return node?.CreatedDate?.value ? clock.parseRequiredSalesforceDateTime(node?.CreatedDate?.value) : new Date();
  },
  status(node) {
    return mapToPCRStatus(node?.Acc_Status__c?.value || "unknown");
  },
  statusName(node) {
    return node?.Acc_Status__c?.value || "Unknown";
  },
};

type CollatedPcrNode<T extends PcrNode = PcrNode> = {
  head: T;
  children: T[];
};

type PcrDtoWithItems<PickList extends keyof PcrDtoMapping, ItemPickList extends keyof PcrItemDtoMapping> = Merge<
  Pick<PcrDtoMapping, PickList>,
  { items: Pick<PcrItemDtoMapping, ItemPickList>[] }
>;

type PcrAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [
    ["typeOfAid", "typeOfAid", string | TypeOfAid], // get from Acc_CompetitionId__r { Acc_TypeofAid__c {value}} or from project.typeOfAid
  ]
>;

/**
 * maps the attached child PCR items to the dto pattern
 */
export function mapPcrItemsDtos<ItemPickList extends keyof PcrItemDtoMapping>(
  items: CollatedPcrNode["children"],
  pickList: ItemPickList[],
  additionalData: PcrAdditionalData<ItemPickList>,
) {
  return items.map(item =>
    pickList.reduce((dto, field) => {
      dto[field] = itemMapper[field](item, additionalData);
      return dto;
    }, {} as Pick<PcrItemDtoMapping, ItemPickList>),
  );
}

/**
 * maps the header of the pcr to the dto and passes the children to the item mapper
 */
export function mapToPcrDto<
  T extends CollatedPcrNode,
  PickList extends keyof PcrDtoMapping,
  ItemPickList extends keyof PcrItemDtoMapping,
>(
  pcr: T,
  pickList: PickList[],
  itemsPickList: ItemPickList[],
  additionalData: PcrAdditionalData<ItemPickList>,
): PcrDtoWithItems<PickList, ItemPickList> {
  const dtoWithoutItems = pickList.reduce((dto, field) => {
    {
      dto[field] = headMapper[field](pcr.head);
    }
    return dto;
  }, {} as Pick<PcrDtoMapping, PickList>);

  const dtoWithItems = {
    ...dtoWithoutItems,
    items: mapPcrItemsDtos(pcr.children, itemsPickList, additionalData),
  } as PcrDtoWithItems<PickList, ItemPickList>;
  return dtoWithItems;
}

/**
 * Separates the pcrs into headers linked with attached child pcrs and sends to mapper
 */
export function mapToPcrDtoArray<
  T extends PcrNode,
  PickList extends keyof PcrDtoMapping,
  ItemPickList extends keyof PcrItemDtoMapping,
>(
  pcrs: ReadonlyArray<Readonly<{ node: T | null }> | null>,
  pickList: PickList[],
  itemsPickList: ItemPickList[],
  additionalData: PcrAdditionalData<ItemPickList>,
): PcrDtoWithItems<PickList, ItemPickList>[] {
  if (!pcrs) return [];

  const collatedPcrs = [];

  for (const pcr of pcrs) {
    if (typeof pcr === null) continue;
    if (pcr?.node?.RecordType?.Name?.value === "Request Header") {
      const childPcrs = [];

      for (const childPcr of pcrs) {
        if (!!pcr?.node?.Id && pcr?.node?.Id === childPcr?.node?.Acc_RequestHeader__c?.value) {
          childPcrs.push(childPcr);
        }
      }

      collatedPcrs.push({
        head: pcr?.node,
        children: childPcrs.map(x => x?.node) as T[],
      });
    }
  }

  return collatedPcrs.map(pcr =>
    mapToPcrDto<CollatedPcrNode<T>, PickList, ItemPickList>(pcr, pickList, itemsPickList, additionalData),
  );
}

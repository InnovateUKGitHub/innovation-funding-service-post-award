import type { PCRDto, PCRItemDto } from "@framework/dtos";
import { mapToPCRStatus } from "@framework/mappers/pcrStatus";
import { Clock } from "@framework/util";

const clock = new Clock();

export type PcrNode = Readonly<
  Partial<{
    Id: string;
    Acc_RequestHeader__c: GQL.Value<string>;
    Acc_RequestNumber__c: GQL.Value<number>;
    CreatedDate: GQL.Value<string>;
    Acc_Status__c: GQL.Value<string>;
    Acc_Project__c: GQL.Value<string>;
    LastModifiedDate: GQL.Value<string>;
    RecordType: {
      Name?: GQL.ValueAndLabel<string>;
      Id?: string | null;
    } | null;
  }>
> | null;

type PcrDtoMapping = Pick<
  PCRDto,
  "id" | "requestNumber" | "projectId" | "started" | "lastUpdated" | "status" | "statusName"
>;

type PcrItemDtoMapping = Pick<PCRItemDto, "shortName">;

/**
 * Mapper for PCR Child items
 */
const itemMapper: GQL.DtoMapper<PcrItemDtoMapping, PcrNode> = {
  shortName(node) {
    return node?.RecordType?.Name?.value ?? "Unknown";
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

/**
 * maps the attached child PCR items to the dto pattern
 */
export function mapPcrItemsDtos<ItemPickList extends keyof PcrItemDtoMapping>(
  items: CollatedPcrNode["children"],
  pickList: ItemPickList[],
) {
  return items.map(item =>
    pickList.reduce((dto, field) => {
      dto[field] = itemMapper[field](item);
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
>(pcr: T, pickList: PickList[], itemsPickList: ItemPickList[]): PcrDtoWithItems<PickList, ItemPickList> {
  const dtoWithoutItems = pickList.reduce((dto, field) => {
    {
      dto[field] = headMapper[field](pcr.head);
    }
    return dto;
  }, {} as Pick<PcrDtoMapping, PickList>);

  const dtoWithItems = {
    ...dtoWithoutItems,
    items: mapPcrItemsDtos(pcr.children, itemsPickList),
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

  return collatedPcrs.map(pcr => mapToPcrDto<CollatedPcrNode<T>, PickList, ItemPickList>(pcr, pickList, itemsPickList));
}

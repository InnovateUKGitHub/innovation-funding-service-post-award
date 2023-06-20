import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { Clock } from "@framework/util/clock";

/**
 * splits a long string response into an array around new lines
 * with empty lines removed
 */
function parseLongTextArea(unParsedString: string): string[] {
  return unParsedString
    .trim()
    .split("\n")
    .map(x => x.trim())
    .filter(x => x);
}

const clock = new Clock();

type BroadcastNode = Readonly<Partial<{
  Id: string;
  DisplayValue: GQL.Maybe<string>;
  Acc_StartDate__c: GQL.Value<string>;
  Acc_EndDate__c: GQL.Value<string>;
  Acc_Message__c: GQL.Value<string>;
}> | null> | null;

type BroadcastDtoMapping = BroadcastDto;

const mapper: GQL.DtoMapper<BroadcastDtoMapping, BroadcastNode> = {
  id(node) {
    return (node?.Id ?? "") as BroadcastId;
  },
  startDate(node) {
    return !!node?.Acc_StartDate__c?.value
      ? clock.parseRequiredSalesforceDateTime(node.Acc_StartDate__c.value)
      : new Date();
  },
  endDate(node) {
    return !!node?.Acc_EndDate__c?.value
      ? clock.parseRequiredSalesforceDateTime(node.Acc_EndDate__c.value)
      : new Date();
  },
  content(node) {
    return parseLongTextArea(node?.Acc_Message__c?.value ?? "");
  },
  title(node) {
    return node?.DisplayValue ?? "";
  },
};

/**
 * Maps a specified Node from a GQL query to a slice of
 * the BroadcastDto to ensure consistency and compatibility in the application
 */
export function mapToBroadcastDto<T extends BroadcastNode, PickList extends keyof BroadcastDtoMapping>(
  node: T,
  pickList: PickList[],
): Pick<BroadcastDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<BroadcastDtoMapping, PickList>);
}

/**
 * maps from a gql node to an array of broadcast dtos, per picklist
 */
export function mapToBroadcastDtoArray<
  T extends ReadonlyArray<{ node: BroadcastNode } | null> | null,
  PickList extends keyof BroadcastDtoMapping,
>(edges: T, pickList: PickList[]): Pick<BroadcastDtoMapping, PickList>[] {
  return (
    edges?.map(node => {
      return mapToBroadcastDto(node?.node ?? null, pickList);
    }) ?? []
  );
}

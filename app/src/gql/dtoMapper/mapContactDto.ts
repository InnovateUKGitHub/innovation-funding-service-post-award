import { ProjectContactDto, ProjectRoleName } from "@framework/dtos/projectContactDto";

type ContactNode = GQL.PartialNode<{
  Id: string;
  Acc_Role__c: GQL.ValueAndLabel<string>;
  Acc_ContactId__r: GQL.Maybe<{
    Name: GQL.Value<string>;
  }>;
  Acc_UserId__r: GQL.Maybe<{
    Name: GQL.Value<string>;
  }>;
  Acc_EmailOfSFContact__c: GQL.Value<string>;
  Acc_AccountId__c: GQL.Value<string>;
  Acc_ProjectId__c: GQL.Value<string>;
}>;

type ContactDtoMapping = Pick<
  ProjectContactDto,
  "id" | "accountId" | "email" | "name" | "projectId" | "role" | "roleName"
>;

const mapper: GQL.DtoMapper<ContactDtoMapping, ContactNode> = {
  accountId(node) {
    return node?.Acc_AccountId__c?.value ?? "unknown";
  },
  id(node) {
    return node?.Id ?? "";
  },
  email(node) {
    return node?.Acc_EmailOfSFContact__c?.value ?? "";
  },
  name(node) {
    const externalUserName = node?.Acc_ContactId__r?.Name?.value && node.Acc_ContactId__r.Name.value;
    const internalUserName = node?.Acc_UserId__r?.Name?.value && node.Acc_UserId__r.Name.value;
    return externalUserName || internalUserName || "";
  },
  projectId(node) {
    return (node?.Acc_ProjectId__c?.value ?? "unknown") as ProjectId;
  },
  role(node) {
    return ["Monitoring officer", "Project Manager", "Finance contact", "Innovation lead", "IPM", "Associate"].includes(
      node?.Acc_Role__c?.value ?? "",
    )
      ? (node?.Acc_Role__c?.value as ProjectRoleName)
      : ("unknown role" as ProjectRoleName);
  },
  roleName(node) {
    return node?.Acc_Role__c?.label ?? "";
  },
};

/**
 * Maps a specified Contact Node from a GQL query to
 * the ContactDto to ensure consistency and compatibility in the application
 */
export function mapToContactDto<T extends ContactNode, PickList extends keyof ContactDtoMapping>(
  loanNode: T,
  pickList: PickList[],
): Pick<ContactDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](loanNode);
    return dto;
  }, {} as Pick<ContactDtoMapping, PickList>);
}

/**
 * Maps Contact Edge to array of Contact DTOs.
 */
export function mapToContactDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ContactNode }>> | null,
  PickList extends keyof ContactDtoMapping,
>(edges: T, pickList: PickList[]): Pick<ContactDtoMapping, PickList>[] {
  return (
    edges?.map(node => {
      return mapToContactDto(node?.node ?? null, pickList);
    }) ?? []
  );
}

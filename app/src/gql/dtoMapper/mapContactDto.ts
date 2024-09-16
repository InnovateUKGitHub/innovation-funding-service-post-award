import { ProjectContactDto, ProjectRoleName } from "@framework/dtos/projectContactDto";
import { Clock } from "@framework/util/clock";

const clock = new Clock();

// Acc_Project__c.ProjectContactLink__r
// Acc_ProjectContactLink__c
type ContactNode = GQL.PartialNode<{
  Id: string;
  Acc_Role__c: GQL.ValueAndLabel<string>;
  Acc_ContactId__r: GQL.Maybe<{
    Id: string;
    Name: GQL.Value<string>;
    LastName?: GQL.Value<string>;
    FirstName?: GQL.Value<string>;
  }>;
  Acc_UserId__r: GQL.Maybe<{
    Name: GQL.Value<string>;
  }>;
  Acc_EmailOfSFContact__c: GQL.Value<string>;
  Acc_AccountId__c: GQL.Value<string>;
  Acc_ProjectId__c: GQL.Value<string>;
  Acc_StartDate__c: GQL.Value<string>;
  Acc_EndDate__c: GQL.Value<string>;
  Associate_Start_Date__c: GQL.Value<string>;
  LastModifiedDate: GQL.Value<string>;
  Acc_Inactive__c: GQL.Value<boolean>;
  Acc_Replaced__c: GQL.Value<boolean>;
  Acc_New_Team_Member__c: GQL.Value<boolean>;
  Acc_Send_invitation__c: GQL.Value<boolean>;
  Acc_Edited__c: GQL.Value<boolean>;
}>;

export interface ProjectContactDtoGql extends ProjectContactDto {}

const mapper: GQL.DtoMapper<ProjectContactDtoGql, ContactNode> = {
  accountId(node) {
    return (node?.Acc_AccountId__c?.value ?? "unknown") as AccountId;
  },
  contactId(node) {
    return (node?.Acc_ContactId__r?.Id ?? "unknown") as ContactId;
  },
  id(node) {
    return (node?.Id ?? "") as ProjectContactLinkId;
  },
  email(node) {
    return node?.Acc_EmailOfSFContact__c?.value ?? "";
  },
  firstName(node) {
    return node?.Acc_ContactId__r?.FirstName?.value ?? "";
  },
  lastName(node) {
    return node?.Acc_ContactId__r?.LastName?.value ?? "";
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
    return [
      "Monitoring officer",
      "Project Manager",
      "Finance contact",
      "Innovation lead",
      "IPM",
      "Associate",
      "Main Company Contact",
      "KB Admin",
    ].includes(node?.Acc_Role__c?.value ?? "")
      ? (node?.Acc_Role__c?.value as ProjectRoleName)
      : ("unknown role" as ProjectRoleName);
  },
  roleName(node) {
    return node?.Acc_Role__c?.label ?? "";
  },
  startDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Acc_StartDate__c?.value ?? null);
  },
  endDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Acc_EndDate__c?.value ?? null);
  },
  associateStartDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Associate_Start_Date__c?.value ?? null);
  },
  edited(node) {
    return node?.Acc_Edited__c?.value ?? false;
  },
  replaced(node) {
    return node?.Acc_Replaced__c?.value ?? false;
  },
  inactive(node) {
    return node?.Acc_Inactive__c?.value ?? false;
  },
  newTeamMember(node) {
    return node?.Acc_New_Team_Member__c?.value ?? false;
  },
  sendInvitation(node) {
    return node?.Acc_Send_invitation__c?.value ?? false;
  },
};

/**
 * Maps a specified Contact Node from a GQL query to
 * the ContactDto to ensure consistency and compatibility in the application
 */
export function mapToContactDto<T extends ContactNode, PickList extends keyof ProjectContactDtoGql>(
  loanNode: T,
  pickList: PickList[],
): Pick<ProjectContactDtoGql, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](loanNode);
      return dto;
    },
    {} as Pick<ProjectContactDtoGql, PickList>,
  );
}

/**
 * Maps Contact Edge to array of Contact DTOs.
 */
export function mapToContactDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ContactNode }>> | null,
  PickList extends keyof ProjectContactDtoGql,
>(edges: T, pickList: PickList[]): Pick<ProjectContactDtoGql, PickList>[] {
  return (
    edges?.map(node => {
      return mapToContactDto(node?.node ?? null, pickList);
    }) ?? []
  );
}

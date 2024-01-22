import { pcrItemTypes } from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { ProjectChangeRequest } from "@framework/constants/recordTypes";
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

export type PcrNode = GQL.PartialNode<{
  Id: GQL.Maybe<string>;
  Acc_AdditionalNumberofMonths__c: GQL.Value<number>;
  Acc_Comments__c: GQL.Value<string>;
  Acc_ExistingPartnerName__c: GQL.Value<string>;
  Acc_OtherFunding__c: GQL.Value<boolean>;
  Acc_CommercialWork__c: GQL.Value<boolean>;
  Acc_ExistingProjectDuration__c: GQL.Value<number>;
  Acc_NewOrganisationName__c: GQL.Value<string>;
  Acc_Reasoning__c: GQL.Value<string>;
  Acc_RequestHeader__c: GQL.Value<string>;
  Acc_RequestNumber__c: GQL.Value<number>;
  Acc_MarkedasComplete__c: GQL.Value<string>;
  Acc_OrganisationName__c: GQL.Value<string>;
  Acc_Project_Participant__c: GQL.Value<string>;
  Acc_ParticipantType__c: GQL.Value<string>;
  Acc_PublicDescriptionSnapshot__c: GQL.Value<string>;
  Acc_NewPublicDescription__c: GQL.Value<string>;
  Acc_NewProjectSummary__c: GQL.Value<string>;
  Acc_ProjectSummarySnapshot__c: GQL.Value<string>;
  Acc_GrantMovingOverFinancialYear__c: GQL.Value<number>;
  Acc_RemovalPeriod__c: GQL.Value<number>;
  CreatedDate: GQL.Value<string>;
  Acc_Status__c: GQL.Value<string>;
  Acc_SuspensionStarts__c: GQL.Value<string>;
  Acc_SuspensionEnds__c: GQL.Value<string>;
  Acc_Project__c: GQL.Value<string>;
  Acc_ProjectRole__c: GQL.Value<string>;
  LastModifiedDate: GQL.Value<string>;
  Loan_Duration__c: GQL.Value<string>;
  Loan_ExtensionPeriod__c: GQL.Value<string>;
  Loan_ExtensionPeriodChange__c: GQL.Value<number>;
  Loan_ProjectStartDate__c: GQL.Value<string>;
  Loan_RepaymentPeriod__c: GQL.Value<string>;
  Loan_RepaymentPeriodChange__c: GQL.Value<number>;
  RecordType: GQL.Maybe<{
    DeveloperName?: GQL.Value<string>;
    Name?: GQL.ValueAndLabel<string>;
    Id?: GQL.Maybe<string>;
  }>;
  New_company_subcontractor_name__c: GQL.Value<string>;
  Company_registration_number__c: GQL.Value<string>;
  Relationship_between_partners__c: GQL.Value<boolean>;
  Relationship_justification__c: GQL.Value<string>;
  Role_in_the_project__c: GQL.Value<string>;
  Country_where_work_will_be_carried_out__c: GQL.Value<string>;
  Cost_of_work__c: GQL.Value<number>;
  Justification__c: GQL.Value<string>;
}>;

type PcrDtoMapping = Pick<
  PCRDto,
  | "comments"
  | "id"
  | "lastUpdated"
  | "projectId"
  | "reasoningComments"
  | "reasoningStatus"
  | "requestNumber"
  | "started"
  | "status"
  | "statusName"
>;

export type PcrItemDtoMapping = Pick<
  FullPCRItemDto,
  | "accountName"
  | "availabilityPeriod"
  | "availabilityPeriodChange"
  | "extensionPeriod"
  | "extensionPeriodChange"
  | "hasOtherFunding"
  | "id"
  | "isCommercialWork"
  | "grantMovingOverFinancialYear"
  | "guidance"
  | "lastUpdated"
  | "offsetMonths"
  | "organisationName"
  | "organisationType"
  | "partnerId"
  | "partnerNameSnapshot"
  | "partnerType"
  | "projectDurationSnapshot"
  | "projectSummary"
  | "projectSummarySnapshot"
  | "projectId"
  | "projectRole"
  | "projectStartDate"
  | "publicDescription"
  | "publicDescriptionSnapshot"
  | "removalPeriod"
  | "repaymentPeriod"
  | "repaymentPeriodChange"
  | "requestNumber"
  | "shortName"
  | "started"
  | "status"
  | "statusName"
  | "suspensionEndDate"
  | "suspensionStartDate"
  | "type"
  | "typeName"
  | "typeOfAid"
  | "subcontractorName"
  | "subcontractorRegistrationNumber"
  | "subcontractorRelationship"
  | "subcontractorRelationshipJustification"
  | "subcontractorLocation"
  | "subcontractorDescription"
  | "subcontractorJustification"
  | "subcontractorCost"
>;

const mapChangeOffsetToQuarter = (currentMonthOffset: number, changedMonthOffset: number) => {
  // Note: Set default value if no change entry has been populated
  if (!changedMonthOffset) return currentMonthOffset;

  return changedMonthOffset + currentMonthOffset;
};

/**
 * Mapper for PCR Child items
 */
const itemMapper: GQL.DtoMapper<PcrItemDtoMapping, PcrNode, { typeOfAid?: string | TypeOfAid }> = {
  accountName(node) {
    return node?.Acc_NewOrganisationName__c?.value ?? null;
  },
  availabilityPeriod(node) {
    return Number(node?.Loan_Duration__c?.value);
  },
  availabilityPeriodChange(node) {
    return mapChangeOffsetToQuarter(
      Number(node?.Loan_Duration__c?.value),
      Number(node?.Acc_AdditionalNumberofMonths__c?.value ?? 0),
    );
  },
  extensionPeriod(node) {
    return Number(node?.Loan_ExtensionPeriod__c?.value);
  },
  extensionPeriodChange(node) {
    return mapChangeOffsetToQuarter(
      Number(node?.Loan_ExtensionPeriod__c?.value),
      Number(node?.Loan_ExtensionPeriodChange__c?.value),
    );
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
  grantMovingOverFinancialYear(node) {
    return node?.Acc_GrantMovingOverFinancialYear__c?.value ?? null;
  },
  guidance(node, additionalData) {
    const metaValues = pcrItemTypes.find(x => x.type === itemMapper.type(node, additionalData));
    if (!!metaValues && "guidance" in metaValues) {
      return metaValues.guidance;
    }
    return "";
  },
  lastUpdated(node) {
    return node?.LastModifiedDate?.value
      ? clock.parseRequiredSalesforceDateTime(node?.LastModifiedDate?.value)
      : new Date();
  },
  offsetMonths(node) {
    return node?.Acc_AdditionalNumberofMonths__c?.value ?? 0;
  },
  organisationName(node) {
    return node?.Acc_OrganisationName__c?.value ?? null;
  },
  organisationType(node) {
    return getPCROrganisationType(mapFromSalesforcePCRPartnerType(node?.Acc_ParticipantType__c?.value ?? ""));
  },
  partnerId(node) {
    return (node?.Acc_Project_Participant__c?.value as PartnerId) ?? null;
  },
  partnerNameSnapshot(node) {
    return node?.Acc_ExistingPartnerName__c?.value ?? null;
  },
  partnerType(node) {
    return mapFromSalesforcePCRPartnerType(node?.Acc_ParticipantType__c?.value ?? "");
  },
  projectDurationSnapshot(node) {
    return node?.Acc_ExistingProjectDuration__c?.value ?? 0;
  },
  projectId(node) {
    return (node?.Acc_Project__c?.value ?? "unknown-project-id") as ProjectId;
  },
  projectRole(node) {
    return mapFromSalesforcePCRProjectRole(node?.Acc_ProjectRole__c?.value ?? "");
  },
  projectStartDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Loan_ProjectStartDate__c?.value ?? null);
  },
  projectSummary(node) {
    return node?.Acc_NewProjectSummary__c?.value ?? "";
  },
  projectSummarySnapshot(node) {
    return node?.Acc_ProjectSummarySnapshot__c?.value ?? "";
  },
  publicDescription(node) {
    return node?.Acc_NewPublicDescription__c?.value ?? "";
  },
  publicDescriptionSnapshot(node) {
    return node?.Acc_PublicDescriptionSnapshot__c?.value ?? "";
  },
  removalPeriod(node) {
    return node?.Acc_RemovalPeriod__c?.value ?? null;
  },
  repaymentPeriod(node) {
    return Number(node?.Loan_RepaymentPeriod__c?.value);
  },
  repaymentPeriodChange(node) {
    return mapChangeOffsetToQuarter(
      Number(node?.Loan_RepaymentPeriod__c?.value),
      Number(node?.Loan_RepaymentPeriodChange__c?.value),
    );
  },
  requestNumber(node) {
    return node?.Acc_RequestNumber__c?.value ?? 0;
  },
  shortName(node) {
    return node?.RecordType?.Name?.value ?? "Unknown";
  },
  started(node) {
    return node?.CreatedDate?.value ? clock.parseRequiredSalesforceDateTime(node?.CreatedDate?.value) : new Date();
  },
  status(node) {
    return mapToPCRItemStatus(node?.Acc_MarkedasComplete__c?.value ?? "");
  },
  statusName(node) {
    return node?.Acc_MarkedasComplete__c?.value || "Unknown";
  },
  suspensionEndDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Acc_SuspensionEnds__c?.value ?? null);
  },
  suspensionStartDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Acc_SuspensionStarts__c?.value ?? null);
  },
  type(node) {
    return mapToPcrItemType(node?.RecordType?.DeveloperName?.value ?? node?.RecordType?.Name?.value ?? "Unknown");
  },
  typeName(node) {
    return node?.RecordType?.Name?.value ?? "Unknown";
  },
  typeOfAid(node, additionalData) {
    /* possible to be passed in as TypeofAid enum from project mapper or as string from salesforce */
    return additionalData?.typeOfAid === undefined
      ? TypeOfAid.Unknown
      : typeof additionalData.typeOfAid === "string"
      ? mapTypeOfAidToEnum(additionalData?.typeOfAid)
      : additionalData.typeOfAid;
  },
  subcontractorName(node) {
    return node?.New_company_subcontractor_name__c?.value ?? null;
  },
  subcontractorRegistrationNumber(node) {
    return node?.Company_registration_number__c?.value ?? null;
  },
  subcontractorRelationship(node) {
    return node?.Relationship_between_partners__c?.value ?? null;
  },
  subcontractorRelationshipJustification(node) {
    return node?.Relationship_justification__c?.value ?? null;
  },
  subcontractorLocation(node) {
    return node?.Country_where_work_will_be_carried_out__c?.value ?? null;
  },
  subcontractorDescription(node) {
    return node?.Role_in_the_project__c?.value ?? null;
  },
  subcontractorCost(node) {
    return node?.Cost_of_work__c?.value ?? null;
  },
  subcontractorJustification(node) {
    return node?.Justification__c?.value ?? null;
  },
};

/**
 * Mapper for the PCR header node
 */
const headMapper: GQL.DtoMapper<PcrDtoMapping, PcrNode> = {
  comments(node) {
    return node?.Acc_Comments__c?.value ?? "";
  },
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
  reasoningComments(node) {
    return node?.Acc_Reasoning__c?.value ?? "";
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
 * maps for a single pcr item
 */
export function mapPcrItemDto<T extends PcrNode, PickList extends keyof PcrItemDtoMapping>(
  node: T,
  pickList: PickList[],
  additionalData: PcrAdditionalData<PickList>,
): Pick<PcrItemDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = itemMapper[field](node, additionalData);
    return dto;
  }, {} as Pick<PcrItemDtoMapping, PickList>);
}

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
  pcrs: ReadonlyArray<Readonly<GQL.Maybe<{ node: T | null }>>>,
  pickList: PickList[],
  itemsPickList: ItemPickList[],
  additionalData: PcrAdditionalData<ItemPickList>,
): PcrDtoWithItems<PickList, ItemPickList>[] {
  if (!pcrs) return [];

  const collatedPcrs = [];

  for (const pcr of pcrs) {
    if (typeof pcr === null) continue;
    if (pcr?.node?.RecordType?.DeveloperName?.value === ProjectChangeRequest.requestHeader) {
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

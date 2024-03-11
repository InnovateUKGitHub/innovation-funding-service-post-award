import { SffBuilder } from "../factory/SalesforceFactory";

interface SffFieldBase {
  sfdcName: Readonly<string>;
  // sffName: Readonly<string>;
  sfdcType: Readonly<SffFieldType>;
}

interface SffFactoryObjectDefinition {
  sfdcName: Readonly<string>;
  fields: ReadonlyArray<SffField>;
}

enum SffFieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SINGLE_PICKLIST = "SINGLE_PICKLIST",
  MULTI_PICKLIST = "MULTI_PICKLIST",
  CHECKBOX = "CHECKBOX",
  DATETIME = "DATETIME",
  SINGLE_RELATIONSHIP = "SINGLE_RELATIONSHIP",
  MULTI_RELATIONSHIP = "MULTI_RELATIONSHIP",
}

interface SffFieldTypeToJsMap {
  [SffFieldType.STRING]: string;
  [SffFieldType.NUMBER]: number;
  [SffFieldType.SINGLE_PICKLIST]: string;
  [SffFieldType.MULTI_PICKLIST]: string[];
  [SffFieldType.CHECKBOX]: boolean;
  [SffFieldType.DATETIME]: Date;
  [SffFieldType.SINGLE_RELATIONSHIP]: SffBuilder<any>;
  [SffFieldType.MULTI_RELATIONSHIP]: SffBuilder<any>[];
}

type SffTypeToJsType<T extends SffFieldType> = SffFieldTypeToJsMap[T];

type DataEntryMap<T extends SffFactoryObjectDefinition> = {
  [key in T["fields"][number]["sfdcName"]]?: SffTypeToJsType<(T["fields"][number] & { sfdcName: key })["sfdcType"]>;
};

interface SffStringField extends SffFieldBase {
  sfdcType: SffFieldType.STRING;
}
interface SffNumberField extends SffFieldBase {
  sfdcType: SffFieldType.NUMBER;
}
interface SffPicklistField extends SffFieldBase {
  sfdcType: SffFieldType.SINGLE_PICKLIST;
}
interface SffCheckboxField extends SffFieldBase {
  sfdcType: SffFieldType.CHECKBOX;
}
interface SffDateTimeField extends SffFieldBase {
  sfdcType: SffFieldType.DATETIME;
}
interface SffSingleRelationshipField extends SffFieldBase {
  sfdcType: SffFieldType.SINGLE_RELATIONSHIP;
  sffBuilder: SffBuilder<any>;
}

type SffField =
  | SffStringField
  | SffNumberField
  | SffPicklistField
  | SffCheckboxField
  | SffDateTimeField
  | SffSingleRelationshipField;

export { SffFactoryObjectDefinition, SffFieldBase, SffField, SffTypeToJsType, SffFieldType, DataEntryMap };

import { SffBuilder } from "../factory/SalesforceFactory";

interface SffFieldBase {
  sfdcName: Readonly<string>;
  // sffName: Readonly<string>;
  sfdcType: Readonly<SffFieldType>;
}

interface SffRelationship {
  sfdcName: Readonly<string>;
  sffBuilder: SffBuilder<any>;
}

interface SffFactoryObjectDefinition {
  sfdcName: Readonly<string>;
  fields: ReadonlyArray<SffField>;
  relationships: ReadonlyArray<SffRelationship>;
}

enum SffFieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SINGLE_PICKLIST = "SINGLE_PICKLIST",
  MULTI_PICKLIST = "MULTI_PICKLIST",
  CHECKBOX = "CHECKBOX",
  DATETIME = "DATETIME",
}

interface SffFieldTypeToJsMap {
  [SffFieldType.STRING]: string;
  [SffFieldType.NUMBER]: number;
  [SffFieldType.SINGLE_PICKLIST]: string;
  [SffFieldType.MULTI_PICKLIST]: string[];
  [SffFieldType.CHECKBOX]: boolean;
  [SffFieldType.DATETIME]: Date;
}

type SffTypeToJsType<T extends SffFieldType> = SffFieldTypeToJsMap[T];

type DataEntryMap<T extends SffFactoryObjectDefinition> = {
  [key in T["fields"][number]["sfdcName"]]?: SffTypeToJsType<(T["fields"][number] & { sfdcName: key })["sfdcType"]>;
} & {
  [key in T["relationships"][number]["sfdcName"]]?: (T["relationships"][number] & { sfdcName: key })["sffBuilder"];
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

type SffField = SffStringField | SffNumberField | SffPicklistField | SffCheckboxField | SffDateTimeField;

export {
  SffFactoryObjectDefinition,
  SffFieldBase,
  SffRelationship,
  SffField,
  SffTypeToJsType,
  SffFieldType,
  DataEntryMap,
};

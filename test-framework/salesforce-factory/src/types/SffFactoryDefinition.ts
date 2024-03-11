import { SffBuilder } from "../factory/SalesforceFactory";

interface SffFieldBase {
  sfdcName: Readonly<string>;
  sfdcType: Readonly<SffFieldType>;
}

interface SffRelationshipBase {
  sfdcName: Readonly<string>;
  sfdcType: Readonly<SffRelationshipType>;
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

enum SffRelationshipType {
  SINGLE = "SINGLE",
  MULTI = "MULTI",
}

interface SffFieldTypeToJsMap {
  [SffFieldType.STRING]: string;
  [SffFieldType.NUMBER]: number;
  [SffFieldType.SINGLE_PICKLIST]: string;
  [SffFieldType.MULTI_PICKLIST]: string[];
  [SffFieldType.CHECKBOX]: boolean;
  [SffFieldType.DATETIME]: Date;
}

type SffFieldTypeToJsType<T extends SffFieldType> = SffFieldTypeToJsMap[T];

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

interface SffSingleRelationship extends SffRelationshipBase {
  sfdcType: SffRelationshipType.SINGLE;
}

interface SffMultiRelationship extends SffRelationshipBase {
  sfdcType: SffRelationshipType.MULTI;
}

type SffRelationship = SffSingleRelationship | SffMultiRelationship;

export {
  SffFactoryObjectDefinition,
  SffFieldBase,
  SffRelationship,
  SffField,
  SffFieldTypeToJsType,
  SffFieldType,
  SffRelationshipType,
};

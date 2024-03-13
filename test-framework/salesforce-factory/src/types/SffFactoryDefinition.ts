import { SffBuilder } from "../factory/SffBuilder";

interface SffFieldBase {
  sfdcName: string;
  sfdcType: SffFieldType;
  nullable: boolean;
}

interface SffRelationshipBase {
  sfdcName: Readonly<string>;
  sfdcType: Readonly<SffRelationshipType>;
  sffBuilder: SffBuilder<any>;
}

type FieldsToRecord<T extends SffFactoryObjectDefinition> = {
  [key in T["fields"][number]["sfdcName"]]: SffFieldToNullableJsType<{ sfdcName: key } & T["fields"][number]>;
};

type RelationshipsToRecord<T extends SffFactoryObjectDefinition> = {
  [key in T["relationships"][number]["sfdcName"]]: SffRelationshipToJsType<
    { sfdcName: key } & T["relationships"][number]
  >;
};

type PipelineFunction<T extends SffFactoryObjectDefinition> = ({
  fields,
  relationships,
  fnName,
  varName,
}: {
  fields: FieldsToRecord<T>;
  relationships: RelationshipsToRecord<T>;
  fnName: string;
  varName: string;
}) => {
  code: string;
};

interface SffFactoryObjectDefinition<Fields extends ReadonlyArray<SffField> = ReadonlyArray<SffField>> {
  sfdcName: Readonly<string>;
  fields: Fields;
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

type SffFieldToNullableJsType<T extends SffField> = T["nullable"] extends true
  ? SffFieldToJsType<T> | null
  : SffFieldToJsType<T>;

type SffFieldToJsType<T extends SffField> = T extends SffStringField
  ? string
  : T extends SffNumberField
  ? number
  : T extends SffSinglePicklistField
  ? T["values"][number]
  : T extends SffMultiPicklistField
  ? T["values"]
  : T extends SffCheckboxField
  ? boolean
  : T extends SffDateTimeField
  ? Date
  : never;

interface SffStringField extends SffFieldBase {
  sfdcType: SffFieldType.STRING;
}
interface SffNumberField extends SffFieldBase {
  sfdcType: SffFieldType.NUMBER;
}
interface SffSinglePicklistField extends SffFieldBase {
  sfdcType: SffFieldType.SINGLE_PICKLIST;
  values: ReadonlyArray<string>;
}
interface SffMultiPicklistField extends SffFieldBase {
  sfdcType: SffFieldType.MULTI_PICKLIST;
  values: ReadonlyArray<string>;
}
interface SffCheckboxField extends SffFieldBase {
  sfdcType: SffFieldType.CHECKBOX;
}
interface SffDateTimeField extends SffFieldBase {
  sfdcType: SffFieldType.DATETIME;
}

type SffField =
  | SffStringField
  | SffNumberField
  | SffSinglePicklistField
  | SffMultiPicklistField
  | SffCheckboxField
  | SffDateTimeField;

interface SffSingleRelationship extends SffRelationshipBase {
  sfdcType: SffRelationshipType.SINGLE;
}

interface SffMultiRelationship extends SffRelationshipBase {
  sfdcType: SffRelationshipType.MULTI;
}

type SffRelationship = SffSingleRelationship | SffMultiRelationship;

type SffRelationshipToJsType<T extends SffRelationship> = T extends SffSingleRelationship
  ? ReturnType<T["sffBuilder"]["new"]>
  : T extends SffMultiRelationship
  ? ReturnType<T["sffBuilder"]["new"]>[]
  : never;

export {
  SffFactoryObjectDefinition,
  SffFieldBase,
  SffRelationship,
  SffField,
  SffFieldToJsType as SffFieldTypeToJsType,
  SffFieldType,
  SffRelationshipType,
  SffRelationshipToJsType,
  FieldsToRecord,
  RelationshipsToRecord,
  PipelineFunction,
  SffSingleRelationship,
  SffMultiRelationship,
};

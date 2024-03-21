import { AccFactory } from "../factory/AccFactory";

interface SffFieldBase {
  sfdcName: string;
  sfdcType: SffFieldType;
  nullable: boolean;
}

interface SffRelationshipBase {
  sfdcName: Readonly<string>;
  sfdcType: Readonly<SffRelationshipType>;
  sffBuilder: AccFactory<any>;
  required: boolean;
}

type FieldsToRecord<T extends SffFactoryObjectDefinition> = {
  [key in T["fields"][number]["sfdcName"]]: {
    value: SffFieldToNullableJsType<{ sfdcName: key } & T["fields"][number]>;
    meta: { sfdcName: key } & T["fields"][number];
  };
};

type RelationshipsToRecord<T extends SffFactoryObjectDefinition> = {
  [key in T["relationships"][number]["sfdcName"]]: {
    value: SffRelationshipToJsType<{ sfdcName: key } & T["relationships"][number]>;
    meta: { sfdcName: key } & T["relationships"][number];
  };
};

type PipelineFunction<T extends SffFactoryObjectDefinition> = ({
  fields,
  relationships,
  instanceName,
  options,
}: {
  fields: FieldsToRecord<T>;
  relationships: RelationshipsToRecord<T>;
  instanceName: string;
  options: AccFactoryBuildOptions;
}) => AccFactoryCodeBlock[];

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
  prefixed?: boolean;
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

type SffRelationship = SffSingleRelationship;

type SffRelationshipToJsType<T extends SffRelationship> = T extends SffSingleRelationship
  ? ReturnType<T["sffBuilder"]["new"]>
  : never;

interface AccFactoryCodeBlock {
  code: string;
  priority: number;
}

interface AccFactoryBuildOptions {
  prefix?: string;
}

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
  AccFactoryCodeBlock,
  AccFactoryBuildOptions,
};

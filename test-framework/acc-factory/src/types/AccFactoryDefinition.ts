import { AccFactory } from "../factory/AccFactory";

interface AccFieldBase {
  sfdcName: string;
  sfdcType: AccFieldType;
  nullable: boolean;
}

interface AccRelationshipBase {
  sfdcName: Readonly<string>;
  sfdcType: Readonly<AccRelationshipType>;
  sffBuilder: AccFactory<any>;
  required: boolean;
}

type FieldsToRecord<T extends AccFactoryObjectDefinition> = {
  [key in T["fields"][number]["sfdcName"]]: {
    value: AccFieldToNullableJsType<{ sfdcName: key } & T["fields"][number]>;
    meta: { sfdcName: key } & T["fields"][number];
  };
};

type RelationshipsToRecord<T extends AccFactoryObjectDefinition> = {
  [key in T["relationships"][number]["sfdcName"]]: {
    value: AccRelationshipToJsType<{ sfdcName: key } & T["relationships"][number]>;
    meta: { sfdcName: key } & T["relationships"][number];
  };
};

type PipelineFunction<T extends AccFactoryObjectDefinition> = ({
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

interface AccFactoryObjectDefinition<Fields extends ReadonlyArray<AccField> = ReadonlyArray<AccField>> {
  sfdcName: Readonly<string>;
  fields: Fields;
  relationships: ReadonlyArray<AccRelationship>;
}

enum AccFieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SINGLE_PICKLIST = "SINGLE_PICKLIST",
  MULTI_PICKLIST = "MULTI_PICKLIST",
  CHECKBOX = "CHECKBOX",
  DATETIME = "DATETIME",
}

enum AccRelationshipType {
  SINGLE = "SINGLE",
  MULTI = "MULTI",
}

type AccFieldToNullableJsType<T extends AccField> = T["nullable"] extends true
  ? AccFieldToJsType<T> | null
  : AccFieldToJsType<T>;

type AccFieldToJsType<T extends AccField> = T extends AccStringField
  ? string
  : T extends AccNumberField
  ? number
  : T extends AccSinglePicklistField
  ? T["values"][number]
  : T extends AccMultiPicklistField
  ? T["values"]
  : T extends AccCheckboxField
  ? boolean
  : T extends AccDateTimeField
  ? Date
  : never;

interface AccStringField extends AccFieldBase {
  sfdcType: AccFieldType.STRING;
  prefixed?: boolean;
}
interface AccNumberField extends AccFieldBase {
  sfdcType: AccFieldType.NUMBER;
}
interface AccSinglePicklistField extends AccFieldBase {
  sfdcType: AccFieldType.SINGLE_PICKLIST;
  values: ReadonlyArray<string>;
}
interface AccMultiPicklistField extends AccFieldBase {
  sfdcType: AccFieldType.MULTI_PICKLIST;
  values: ReadonlyArray<string>;
}
interface AccCheckboxField extends AccFieldBase {
  sfdcType: AccFieldType.CHECKBOX;
}
interface AccDateTimeField extends AccFieldBase {
  sfdcType: AccFieldType.DATETIME;
}

type AccField =
  | AccStringField
  | AccNumberField
  | AccSinglePicklistField
  | AccMultiPicklistField
  | AccCheckboxField
  | AccDateTimeField;

interface AccSingleRelationship extends AccRelationshipBase {
  sfdcType: AccRelationshipType.SINGLE;
}

type AccRelationship = AccSingleRelationship;

type AccRelationshipToJsType<T extends AccRelationship> = T extends AccSingleRelationship
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
  AccFactoryObjectDefinition,
  AccFieldBase,
  AccRelationship,
  AccField,
  AccFieldToJsType as AccFieldTypeToJsType,
  AccFieldType,
  AccRelationshipType,
  AccRelationshipToJsType,
  FieldsToRecord,
  RelationshipsToRecord,
  PipelineFunction,
  AccSingleRelationship,
  AccFactoryCodeBlock,
  AccFactoryBuildOptions,
};

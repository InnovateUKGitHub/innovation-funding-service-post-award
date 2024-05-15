import { ProjectFactory } from "../factory/ProjectFactory";

interface ProjectFactoryFieldBase {
  sfdcName: string;
  sfdcType: ProjectFactoryFieldType;
  nullable: boolean;
}

interface ProjectFactoryRelationshipBase {
  sfdcName: Readonly<string>;
  sfdcType: Readonly<ProjectFactoryRelationshipType>;
  sffBuilder: ProjectFactory<any>;
  required: boolean;
}

type ProjectFactoryFieldsToRecord<T extends ProjectFactoryObjectDefinition> = {
  [key in T["fields"][number]["sfdcName"]]: {
    value: ProjectFactoryFieldTypeToNullableJavaScriptType<{ sfdcName: key } & T["fields"][number]>;
    meta: { sfdcName: key } & T["fields"][number];
  };
};

type ProjectFactoryRelationshipToRecord<T extends ProjectFactoryObjectDefinition> = {
  [key in T["relationships"][number]["sfdcName"]]: {
    value: ProjectFactoryRelationshipToJavaScriptType<{ sfdcName: key } & T["relationships"][number]>;
    meta: { sfdcName: key } & T["relationships"][number];
  };
};

type ProjectFactoryPipelineFunction<T extends ProjectFactoryObjectDefinition> = ({
  fields,
  relationships,
  instanceName,
  options,
}: {
  fields: ProjectFactoryFieldsToRecord<T>;
  relationships: ProjectFactoryRelationshipToRecord<T>;
  instanceName: string;
  options: ProjectFactoryBuildOptions;
}) => ProjectFactoryCodeBlock[];

interface ProjectFactoryObjectDefinition<
  Fields extends ReadonlyArray<ProjectFactoryField> = ReadonlyArray<ProjectFactoryField>,
> {
  sfdcName: Readonly<string>;
  fields: Fields;
  relationships: ReadonlyArray<ProjectFactoryRelationship>;
}

enum ProjectFactoryFieldType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  SINGLE_PICKLIST = "SINGLE_PICKLIST",
  MULTI_PICKLIST = "MULTI_PICKLIST",
  CHECKBOX = "CHECKBOX",
  DATETIME = "DATETIME",
}

enum ProjectFactoryRelationshipType {
  SINGLE = "SINGLE",
  MULTI = "MULTI",
}

type ProjectFactoryFieldTypeToNullableJavaScriptType<T extends ProjectFactoryField> = T["nullable"] extends true
  ? ProjectFactoryFieldTypeToJavaScriptType<T> | null
  : ProjectFactoryFieldTypeToJavaScriptType<T>;

type ProjectFactoryFieldTypeToJavaScriptType<T extends ProjectFactoryField> = T extends ProjectStringField
  ? string
  : T extends ProjectNumberField
  ? number
  : T extends ProjectSinglePicklistField
  ? T["values"][number]
  : T extends ProjectMultiPicklistField
  ? T["values"]
  : T extends ProjectCheckboxField
  ? boolean
  : T extends ProjectDateTimeField
  ? Date
  : never;

interface ProjectStringField extends ProjectFactoryFieldBase {
  sfdcType: ProjectFactoryFieldType.STRING;
  prefixed?: boolean;
}
interface ProjectNumberField extends ProjectFactoryFieldBase {
  sfdcType: ProjectFactoryFieldType.NUMBER;
}
interface ProjectSinglePicklistField extends ProjectFactoryFieldBase {
  sfdcType: ProjectFactoryFieldType.SINGLE_PICKLIST;
  values: ReadonlyArray<string>;
}
interface ProjectMultiPicklistField extends ProjectFactoryFieldBase {
  sfdcType: ProjectFactoryFieldType.MULTI_PICKLIST;
  values: ReadonlyArray<string>;
}
interface ProjectCheckboxField extends ProjectFactoryFieldBase {
  sfdcType: ProjectFactoryFieldType.CHECKBOX;
}
interface ProjectDateTimeField extends ProjectFactoryFieldBase {
  sfdcType: ProjectFactoryFieldType.DATETIME;
}

type ProjectFactoryField =
  | ProjectStringField
  | ProjectNumberField
  | ProjectSinglePicklistField
  | ProjectMultiPicklistField
  | ProjectCheckboxField
  | ProjectDateTimeField;

interface ProjectFactorySingleRelationship extends ProjectFactoryRelationshipBase {
  sfdcType: ProjectFactoryRelationshipType.SINGLE;
}

type ProjectFactoryRelationship = ProjectFactorySingleRelationship;

type ProjectFactoryRelationshipToJavaScriptType<T extends ProjectFactoryRelationship> =
  T extends ProjectFactorySingleRelationship ? ReturnType<T["sffBuilder"]["create"]> : never;

interface ProjectFactoryCodeBlock {
  code: string;
  priority: number;
}

interface ProjectFactoryBuildOptions {
  prefix?: string;
}

export {
  ProjectFactoryObjectDefinition,
  ProjectFactoryFieldBase,
  ProjectFactoryRelationship,
  ProjectFactoryField,
  ProjectFactoryFieldTypeToJavaScriptType,
  ProjectFactoryRelationshipToJavaScriptType,
  ProjectFactoryFieldType,
  ProjectFactoryRelationshipType,
  ProjectFactoryFieldsToRecord,
  ProjectFactoryRelationshipToRecord,
  ProjectFactoryPipelineFunction,
  ProjectFactorySingleRelationship,
  ProjectFactoryCodeBlock,
  ProjectFactoryBuildOptions,
};

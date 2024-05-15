import {
  ProjectFactoryObjectDefinition,
  ProjectFactoryFieldTypeToJavaScriptType,
  ProjectFactoryRelationshipToJavaScriptType,
  ProjectFactoryPipelineFunction,
  ProjectFactoryFieldsToRecord,
  ProjectFactoryRelationshipToRecord,
  ProjectFactoryBuildOptions,
} from "../types/ProjectFactoryDefinition";

interface ProjectFactoryProps<T extends ProjectFactoryObjectDefinition> {
  definition: Readonly<T>;
  generator: {
    varName: (x: number) => string;
  };
}

class ProjectFactory<T extends ProjectFactoryObjectDefinition> {
  public readonly definition: T;
  public readonly pipeline: ProjectFactoryPipelineFunction<T>;
  private readonly generator: {
    varName: (x: number) => string;
  };
  private fnNumber: number;

  constructor({ definition, generator }: ProjectFactoryProps<T>, pipeline: ProjectFactoryPipelineFunction<T>) {
    this.definition = definition;
    this.pipeline = pipeline;
    this.generator = generator;
    this.fnNumber = 0;
  }

  create() {
    return new ProjectFactoryInstance({
      builder: this,
      definition: this.definition,
      instanceName: this.getInstanceName(),
    });
  }

  getInstanceName() {
    return this.generator.varName(this.fnNumber++);
  }
}

interface ProjectFactoryInstanceProps<T extends ProjectFactoryObjectDefinition> {
  definition: Readonly<T>;
  builder: ProjectFactory<T>;
  fields?: [T["fields"][number]["sfdcName"], any][];
  relationships?: [T["relationships"][number]["sfdcName"], ProjectFactoryInstance<any>][];
  instanceName: string;
}

class ProjectFactoryInstance<T extends ProjectFactoryObjectDefinition> {
  private readonly definition: T;
  private readonly builder: ProjectFactory<T>;
  private readonly fields: Map<T["fields"][number]["sfdcName"], any>;
  public readonly relationships: Map<T["relationships"][number]["sfdcName"], ProjectFactoryInstance<any>>;
  public readonly instanceName: string;

  constructor({ definition, builder, fields, relationships, instanceName }: ProjectFactoryInstanceProps<T>) {
    this.definition = definition;
    this.builder = builder;
    this.fields = new Map(fields);
    this.relationships = new Map(relationships);
    this.instanceName = instanceName;
  }

  private setField<Key extends T["fields"][number]["sfdcName"], Row extends { sfdcName: Key } & T["fields"][number]>(
    sfdcName: Key,
    value: ProjectFactoryFieldTypeToJavaScriptType<Row>,
  ) {
    this.fields.set(sfdcName, value);
    return this;
  }

  private setRelationship<
    Key extends T["relationships"][number]["sfdcName"],
    Row extends { sfdcName: Key } & T["relationships"][number],
  >(sfdcName: Key, child: ProjectFactoryRelationshipToJavaScriptType<Row>) {
    this.relationships.set(sfdcName, child);
    return this;
  }

  set<Key extends T["fields"][number]["sfdcName"] | T["relationships"][number]["sfdcName"]>(entries: {
    [H in Key]:
      | ProjectFactoryFieldTypeToJavaScriptType<{ sfdcName: H } & T["fields"][number]>
      | ProjectFactoryRelationshipToJavaScriptType<{ sfdcName: H } & T["relationships"][number]>;
  }) {
    for (const [key, value] of Object.entries(entries)) {
      if (this.definition.fields.some(field => field.sfdcName === key)) {
        this.setField(key, value as any);
      } else if (this.definition.relationships.some(relationship => relationship.sfdcName === key)) {
        this.setRelationship(key, value as any);
      } else {
        throw new Error(`Cannot set key "${key}" because it is not in the definition`);
      }
    }
    return this;
  }

  getField<
    Key extends T["fields"][number]["sfdcName"] | T["relationships"][number]["sfdcName"],
    Row extends { sfdcName: Key } & T["fields"][number],
  >(key: Key): Readonly<undefined | ProjectFactoryFieldTypeToJavaScriptType<Row>> {
    return this.fields.get(key) ?? undefined;
  }

  copy(): ProjectFactoryInstance<T> {
    return new ProjectFactoryInstance<T>({
      builder: this.builder,
      fields: [...this.fields],
      relationships: [...this.relationships].map(([key, value]) => [key, value.copy()]),
      definition: this.definition,
      instanceName: this.builder.getInstanceName(),
    });
  }

  build(options: ProjectFactoryBuildOptions = {}) {
    return this.builder.pipeline({
      fields: Object.fromEntries(
        this.definition.fields.map(schema => [
          schema.sfdcName,
          { value: this.fields.get(schema.sfdcName), meta: schema },
        ]),
      ) as ProjectFactoryFieldsToRecord<T>,
      relationships: Object.fromEntries(
        this.definition.relationships.map(schema => [
          schema.sfdcName,
          { value: this.relationships.get(schema.sfdcName), meta: schema },
        ]),
      ) as ProjectFactoryRelationshipToRecord<T>,
      instanceName: this.instanceName,
      options,
    });
  }
}

export { ProjectFactory, ProjectFactoryInstance };

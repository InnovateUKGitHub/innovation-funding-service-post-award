import {
  SffFactoryObjectDefinition as AccFactoryObjectDefinition,
  SffFieldTypeToJsType,
  PipelineFunction,
  SffRelationshipToJsType,
  FieldsToRecord,
  RelationshipsToRecord,
} from "../types/SffFactoryDefinition";

interface AccFactoryProps<T extends AccFactoryObjectDefinition> {
  definition: Readonly<T>;
  generator: {
    varName: (x: number) => string;
  };
}

class AccFactory<T extends AccFactoryObjectDefinition> {
  public readonly definition: T;
  public readonly pipeline: PipelineFunction<T>;
  private readonly generator: {
    varName: (x: number) => string;
  };
  private fnNumber: number;

  constructor({ definition, generator }: AccFactoryProps<T>, pipeline: PipelineFunction<T>) {
    this.definition = definition;
    this.pipeline = pipeline;
    this.generator = generator;
    this.fnNumber = 0;
  }

  new() {
    return new AccFactoryInstance({ builder: this, definition: this.definition, instanceName: this.getInstanceName() });
  }

  getInstanceName() {
    return this.generator.varName(this.fnNumber++);
  }
}

interface AccFactoryInstanceProps<T extends AccFactoryObjectDefinition> {
  definition: Readonly<T>;
  builder: AccFactory<T>;
  fields?: Map<T["fields"][number]["sfdcName"], any>;
  relationships?: Map<T["relationships"][number]["sfdcName"], any>;
  instanceName: string;
}

class AccFactoryInstance<T extends AccFactoryObjectDefinition> {
  private readonly definition: T;
  private readonly builder: AccFactory<T>;
  private readonly fields: Map<T["fields"][number]["sfdcName"], any>;
  public readonly relationships: Map<T["relationships"][number]["sfdcName"], AccFactoryInstance<any>>;
  public readonly instanceName: string;

  constructor({ definition, builder, fields, relationships, instanceName }: AccFactoryInstanceProps<T>) {
    this.definition = definition;
    this.builder = builder;
    this.fields = new Map(fields);
    this.relationships = new Map(relationships);
    this.instanceName = instanceName;
  }

  setField<Key extends T["fields"][number]["sfdcName"], Row extends { sfdcName: Key } & T["fields"][number]>(
    sfdcName: Key,
    value: SffFieldTypeToJsType<Row>,
  ) {
    // const field = this.definition.fields.find(x => x.sfdcName === sfdcName)! as Row;
    this.fields.set(sfdcName, value);
    return this;
  }

  setRelationship<
    Key extends T["relationships"][number]["sfdcName"],
    Row extends { sfdcName: Key } & T["relationships"][number],
  >(sfdcName: Key, child: SffRelationshipToJsType<Row>) {
    this.relationships.set(sfdcName, child);
    return this;
  }

  copy() {
    return new AccFactoryInstance<T>({
      builder: this.builder,
      fields: this.fields,
      relationships: this.relationships,
      definition: this.definition,
      instanceName: this.builder.getInstanceName(),
    });
  }

  build() {
    return this.builder.pipeline({
      fields: Object.fromEntries(this.fields) as FieldsToRecord<T>,
      relationships: Object.fromEntries(this.relationships) as RelationshipsToRecord<T>,
      instanceName: this.instanceName,
    });
  }
}

export { AccFactory, AccFactoryInstance };

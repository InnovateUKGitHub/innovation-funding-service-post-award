import {
  SffFactoryObjectDefinition,
  SffRelationshipType,
  SffFieldTypeToJsType,
  PipelineFunction,
  SffRelationshipToJsType,
  FieldsToRecord,
  RelationshipsToRecord,
} from "../types/SffFactoryDefinition";

interface SffBuilderProps<T extends SffFactoryObjectDefinition> {
  definition: Readonly<T>;
}

class SffBuilder<T extends SffFactoryObjectDefinition> {
  public readonly definition: T;
  public readonly pipeline: PipelineFunction<T>;
  private fnNumber: number;

  constructor({ definition }: SffBuilderProps<T>, pipeline: PipelineFunction<T>) {
    this.definition = definition;
    this.pipeline = pipeline;
    this.fnNumber = 0;
  }

  new() {
    return new SffBuilderInstance({ builder: this, definition: this.definition });
  }

  getNextFnNumber() {
    return this.fnNumber++;
  }
}

interface SffBuilderInstanceProps<T extends SffFactoryObjectDefinition> extends SffBuilderProps<T> {
  builder: SffBuilder<T>;
  fields?: Map<T["fields"][number]["sfdcName"], any>;
  relationships?: Map<T["relationships"][number]["sfdcName"], any>;
}

class SffBuilderInstance<T extends SffFactoryObjectDefinition> {
  private readonly definition: T;
  private readonly builder: SffBuilder<T>;
  private readonly fields: Map<T["fields"][number]["sfdcName"], any>;
  private readonly relationships: Map<T["relationships"][number]["sfdcName"], any>;

  constructor({ definition, builder, fields, relationships }: SffBuilderInstanceProps<T>) {
    this.definition = definition;
    this.builder = builder;
    this.fields = new Map(fields);
    this.relationships = new Map(relationships);
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
    return new SffBuilderInstance<T>({
      builder: this.builder,
      fields: this.fields,
      relationships: this.relationships,
      definition: this.definition,
    });
  }

  build(fnBodies: string[] = []) {
    const fnName = this.builder.pipeline({
      fields: Object.fromEntries(this.fields) as FieldsToRecord<T>,
      relationships: Object.fromEntries(this.relationships) as RelationshipsToRecord<T>,
      fnNumber: this.builder.getNextFnNumber(),
      fnBodies,
    });

    return { fnBodies, fnName };
  }
}

export { SffBuilder };

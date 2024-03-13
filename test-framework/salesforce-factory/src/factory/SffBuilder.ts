import {
  SffFactoryObjectDefinition,
  SffFieldTypeToJsType,
  PipelineFunction,
  SffRelationshipToJsType,
  FieldsToRecord,
  RelationshipsToRecord,
} from "../types/SffFactoryDefinition";

interface SffBuilderProps<T extends SffFactoryObjectDefinition> {
  definition: Readonly<T>;
  generator: {
    fnName: (x: number) => string;
    varName: (x: number) => string;
  };
}

class SffBuilder<T extends SffFactoryObjectDefinition> {
  public readonly definition: T;
  public readonly pipeline: PipelineFunction<T>;
  public readonly generator: {
    fnName: (x: number) => string;
    varName: (x: number) => string;
  };
  private fnNumber: number;

  constructor({ definition, generator }: SffBuilderProps<T>, pipeline: PipelineFunction<T>) {
    this.definition = definition;
    this.pipeline = pipeline;
    this.generator = generator;
    this.fnNumber = 0;
  }

  new() {
    return new SffBuilderInstance({ builder: this, definition: this.definition });
  }

  getNextFnNumber() {
    return this.fnNumber++;
  }
}

interface SffBuilderInstanceProps<T extends SffFactoryObjectDefinition> {
  definition: Readonly<T>;
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

  build() {
    const fnNumber = this.builder.getNextFnNumber();
    const fnName = this.builder.generator.fnName(fnNumber);
    const varName = this.builder.generator.varName(fnNumber);

    const { code } = this.builder.pipeline({
      fields: Object.fromEntries(this.fields) as FieldsToRecord<T>,
      relationships: Object.fromEntries(this.relationships) as RelationshipsToRecord<T>,
      fnName,
      varName,
    });

    return { fnName, varName, code };
  }
}

export { SffBuilder, SffBuilderInstance };

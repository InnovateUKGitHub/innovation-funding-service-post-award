import {
  SffFactoryObjectDefinition,
  SffFieldType,
  SffRelationshipType,
  SffFieldTypeToJsType,
} from "../types/SffFactoryDefinition";

interface SffBuilderProps<T extends SffFactoryObjectDefinition> {
  definition: Readonly<T>;
}

class SffBuilder<T extends SffFactoryObjectDefinition> {
  public readonly definition: T;

  constructor({ definition }: SffBuilderProps<T>) {
    this.definition = definition;
  }

  new() {
    return new SffBuilderInstance({ builder: this, definition: this.definition });
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
    value: SffFieldTypeToJsType<Row["sfdcType"]>,
  ) {
    // const field = this.definition.fields.find(x => x.sfdcName === sfdcName)! as Row;
    this.fields.set(sfdcName, value);
    return this;
  }

  setRelationship<
    Key extends T["relationships"][number]["sfdcName"],
    Row extends { sfdcName: Key } & T["relationships"][number],
  >(
    sfdcName: Key,
    child: Row["sfdcType"] extends SffRelationshipType.SINGLE
      ? ReturnType<Row["sffBuilder"]["new"]>
      : ReturnType<Row["sffBuilder"]["new"]>[],
  ) {
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
}

export { SffBuilder };

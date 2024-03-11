import { DataEntryMap, SffFactoryObjectDefinition, SffFieldType, SffTypeToJsType } from "../types/SffFactoryDefinition";

interface SffBuilderProps<T extends SffFactoryObjectDefinition> {
  definition: Readonly<T>;
}

class SffBuilder<T extends SffFactoryObjectDefinition> {
  public readonly definition: T;

  constructor({ definition }: SffBuilderProps<T>) {
    this.definition = definition;
  }

  new(data: DataEntryMap<T>) {
    return new SffBuilderBuilder({ ...props, builder: this });
  }
}

interface SffBuilderInstanceProps<T extends SffFactoryObjectDefinition> {
  builder: SffBuilder<T>;
  fields?: Map<T["fields"][number]["sfdcName"], any>;
}

class SffBuilderBuilder<T extends SffFactoryObjectDefinition> {
  private readonly builder: SffBuilder<T>;
  private readonly fields: Map<T["fields"][number]["sfdcName"], any>;

  constructor({ builder, fields }: SffBuilderInstanceProps<T>) {
    this.builder = builder;
    this.fields = new Map(fields);
  }

  setField<Key extends T["fields"][number]["sfdcName"], Row extends { sfdcName: Key } & T["fields"][number]>(
    sfdcName: Key,
    value: SffTypeToJsType<Row["sfdcType"]>,
  ) {
    // const field = this.definition.fields.find(x => x.sfdcName === sfdcName)! as Row;
    this.fields.set(sfdcName, value);
    return this;
  }

  copy() {
    return new SffBuilderBuilder<T>({
      builder: this.builder,
      fields: this.fields,
    });
  }
}

export { SffBuilder };

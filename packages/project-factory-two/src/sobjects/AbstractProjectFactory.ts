import type { InspectOptionsStylized } from "node:util";
import { inspect } from "util";
import { ProjectFactoryMissingNonNullableFieldException } from "../exceptions/ProjectFactoryMissingNonNullableFieldException";
import { SObjectFieldType } from "../types/SObjectFieldType";

interface SObjectFieldMetadata<T> {
  name: string;
  nullable: boolean;
  readonly: boolean;
  set: boolean;
  value: SObjectFieldType<T>;
}

abstract class AbstractSObject {
  _fields: SObjectFieldMetadata<unknown>[];
  abstract sobject: string;

  constructor() {
    this._fields = [];
  }

  Id: string | undefined;

  [Symbol.for("nodejs.util.inspect.custom")](depth: number, opts: InspectOptionsStylized) {
    return `(SObject ${this.sobject}) ${inspect(this.toObject())}`;
  }

  checkForMissingFields() {
    const missingFields = this._fields.filter(x => !x.set && !x.nullable);

    if (missingFields.length) {
      throw new ProjectFactoryMissingNonNullableFieldException({
        sobject: this.sobject,
        fields: missingFields.map(x => x.name),
      });
    }
  }

  toObject() {
    return Object.fromEntries([
      ...(this.Id ? [["Id", this.Id]] : []),
      ...this._fields
        .filter(x => x.set && !x.readonly)
        // Call set thunks
        .map(x => [x.name, x.value]),
    ]);
  }
}

// Listen to any assignments to our field values.
function SObjectField({ nullable, readonly }: { nullable: boolean; readonly: boolean }) {
  return function <Input extends AbstractSObject, Output>(
    value: ClassAccessorDecoratorTarget<Input, Output>,
    context: ClassAccessorDecoratorContext<Input, Output>,
  ): ClassAccessorDecoratorResult<Input, Output> {
    const { get } = value;
    const fieldName = context.name as string;

    context.addInitializer(function (this: Input) {
      const metadata: SObjectFieldMetadata<Output> = {
        name: fieldName,
        nullable,
        readonly,
        set: false,
        value: get.call(this),
      };
      this._fields.push(metadata);
    });

    return {
      get() {
        const metadata = this._fields.find(x => x.name === fieldName);
        if (!metadata) throw new Error("Field not properly initialised.");
        if (typeof metadata?.value === "function") return metadata.value() as Output; // Execute thunk
        return metadata?.value as Output;
      },
      set(val: Output) {
        const metadata = this._fields.find(x => x.name === fieldName);
        if (!metadata) throw new Error("Field not properly initialised.");
        if (!nullable && val === undefined) throw new Error("Cannot set value of non-nullable to undefined.");
        if (!nullable && val === null) throw new Error("Cannot set value of non-nullable to null.");

        metadata.set = true;
        metadata.value = val;
      },
      init(initialValue: Output) {
        return initialValue;
      },
    };
  };
}

export { AbstractSObject, SObjectField };

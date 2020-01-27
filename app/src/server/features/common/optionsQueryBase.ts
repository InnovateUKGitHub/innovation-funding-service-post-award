import { QueryBase } from "./queryBase";
import { IContext } from "@framework/types";
import { Option } from "@framework/dtos/option";
import { PicklistEntry } from "jsforce";

export abstract class OptionsQueryBase<T extends (string | number)> extends QueryBase<Map<T, Option<T>>> {
  protected constructor(private key: string) {
    super();
  }

  protected async Run(context: IContext): Promise<Map<T, Option<T>>> {
    return context.caches.optionsLookup.fetchAsync(this.key, () => this.executeQuery(context));
  }

  private async executeQuery(context: IContext) {
    const statuses = await this.getPickListValues(context);
    return statuses.reduce<Map<T, Option<T>>>((acc, curr) => {
      const enumValue = this.mapToEnumValue(curr.value);
      return acc.set(enumValue, {
        value: enumValue,
        label: curr.label || curr.value,
        defaultValue: curr.defaultValue,
        active: curr.active,
      });
    }, new Map());
  }

  protected abstract getPickListValues(context: IContext): Promise<PicklistEntry[]>;

  protected abstract mapToEnumValue(value: string): T;
}

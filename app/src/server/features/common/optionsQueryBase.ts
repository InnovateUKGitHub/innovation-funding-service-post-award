import { QueryBase } from "./queryBase";
import { IContext, IPicklistEntry } from "@framework/types";
import { Option } from "@framework/dtos/option";

export abstract class OptionsQueryBase<T extends (string | number)> extends QueryBase<Option<T>[]> {
  protected constructor(private key: string) {
    super();
  }

  protected async Run(context: IContext): Promise<Option<T>[]> {
    return context.caches.optionsLookup.fetchAsync(this.key, () => this.executeQuery(context));
  }

  private async executeQuery(context: IContext) {
    const options = await this.getPickListValues(context);
    const map =  options.reduce<Map<T, Option<T>>>((acc, curr) => {
      const enumValue = this.mapToEnumValue(curr.value);
      if(!enumValue && enumValue !== 0) {
        return acc;
      }
      return acc.set(enumValue, {
        value: enumValue,
        label: curr.label || curr.value,
        active: curr.active,
      });
    }, new Map());
    return [...map.values()];
  }

  protected abstract getPickListValues(context: IContext): Promise<IPicklistEntry[]>;

  protected abstract mapToEnumValue(value: string): T;
}

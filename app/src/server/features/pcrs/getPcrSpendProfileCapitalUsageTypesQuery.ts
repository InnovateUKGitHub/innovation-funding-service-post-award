import { IContext, PCRSpendProfileCapitalUsageType } from "@framework/types";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { PcrSpendProfileCapitalUsageTypeMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";

export class GetPcrSpendProfileCapitalUsageTypesQuery extends OptionsQueryBase<PCRSpendProfileCapitalUsageType> {
  constructor() {
    super("PCRSpendProfileCapitalUsageTypes");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.pcrSpendProfile.getCapitalUsageTypes();
  }

  protected mapToEnumValue(value: string) {
    return new PcrSpendProfileCapitalUsageTypeMapper().mapFromSalesforcePcrSpendProfileCapitalUsageType(value);
  }
}

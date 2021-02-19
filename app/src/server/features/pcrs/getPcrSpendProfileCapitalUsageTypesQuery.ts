import { IContext, PCRSpendProfileCapitalUsageType } from "@framework/types";
import { PcrSpendProfileCapitalUsageTypeMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

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

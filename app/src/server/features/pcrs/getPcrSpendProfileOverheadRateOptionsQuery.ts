import { IContext, PCRSpendProfileOverheadRate } from "@framework/types";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import {
  PcrSpendProfileOverheadRateMapper
} from "@server/repositories/mappers/pcrSpendProfileMapper";

export class GetPcrSpendProfileOverheadRateOptionsQuery extends OptionsQueryBase<PCRSpendProfileOverheadRate> {
  constructor() {
    super("PCRSpendProfileOverheadRateOptions");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.pcrSpendProfile.getOverheadRateOptions();
  }

  protected mapToEnumValue(value: string) {
    return new PcrSpendProfileOverheadRateMapper().mapFromSalesforcePcrSpendProfileOverheadRateOption(value);
  }
}

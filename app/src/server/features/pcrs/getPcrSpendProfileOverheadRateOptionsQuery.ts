import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { PcrSpendProfileOverheadRateMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

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

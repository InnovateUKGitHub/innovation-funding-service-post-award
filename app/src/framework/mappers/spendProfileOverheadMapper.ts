import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";

export class PcrSpendProfileOverheadRateMapper {
  private readonly options = {
    zero: "0%",
    twenty: "20%",
    calculated: "Calculated",
  };

  public mapFromSalesforcePcrSpendProfileOverheadRateOption = (
    option: string | undefined,
  ): PCRSpendProfileOverheadRate => {
    switch (option) {
      case this.options.zero:
        return PCRSpendProfileOverheadRate.Zero;
      case this.options.twenty:
        return PCRSpendProfileOverheadRate.Twenty;
      case this.options.calculated:
        return PCRSpendProfileOverheadRate.Calculated;
      default:
        return PCRSpendProfileOverheadRate.Unknown;
    }
  };

  public mapToSalesforcePcrSpendProfileOverheadRateOption = (option: PCRSpendProfileOverheadRate | undefined) => {
    switch (option) {
      case PCRSpendProfileOverheadRate.Zero:
        return this.options.zero;
      case PCRSpendProfileOverheadRate.Twenty:
        return this.options.twenty;
      case PCRSpendProfileOverheadRate.Calculated:
        return this.options.calculated;
      default:
        return undefined;
    }
  };
}

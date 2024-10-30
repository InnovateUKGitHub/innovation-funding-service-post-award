import { PCRSpendProfileCapitalUsageType } from "@framework/constants/pcrConstants";

export class PcrSpendProfileCapitalUsageTypeMapper {
  private readonly types = {
    new: "New",
    existing: "Existing",
  };

  public mapFromSalesforcePcrSpendProfileCapitalUsageType = (types: string | null): PCRSpendProfileCapitalUsageType => {
    switch (types) {
      case this.types.new:
        return PCRSpendProfileCapitalUsageType.New;
      case this.types.existing:
        return PCRSpendProfileCapitalUsageType.Existing;
      default:
        return PCRSpendProfileCapitalUsageType.Unknown;
    }
  };

  public mapToSalesforcePcrSpendProfileCapitalUsageType = (types: PCRSpendProfileCapitalUsageType | undefined) => {
    switch (types) {
      case PCRSpendProfileCapitalUsageType.New:
        return this.types.new;
      case PCRSpendProfileCapitalUsageType.Existing:
        return this.types.existing;
      default:
        return null;
    }
  };
}

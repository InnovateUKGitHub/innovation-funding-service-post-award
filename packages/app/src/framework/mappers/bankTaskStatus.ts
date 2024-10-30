import { BankDetailsTaskStatus } from "@framework/constants/partner";

export class BankDetailsTaskStatusMapper {
  private readonly options = {
    toDo: "To do",
    incomplete: "In progress",
    complete: "Complete",
  };

  public mapFromSalesforce = (option: string | undefined): BankDetailsTaskStatus => {
    switch (option?.toLowerCase()) {
      case this.options.toDo.toLowerCase():
        return BankDetailsTaskStatus.ToDo;
      case this.options.incomplete.toLowerCase():
        return BankDetailsTaskStatus.Incomplete;
      case this.options.complete.toLowerCase():
        return BankDetailsTaskStatus.Complete;
      default:
        return BankDetailsTaskStatus.Unknown;
    }
  };

  public mapToSalesforce = (option: BankDetailsTaskStatus | undefined) => {
    switch (option) {
      case BankDetailsTaskStatus.ToDo:
        return this.options.toDo;
      case BankDetailsTaskStatus.Incomplete:
        return this.options.incomplete;
      case BankDetailsTaskStatus.Complete:
        return this.options.complete;
      default:
        return undefined;
    }
  };
}

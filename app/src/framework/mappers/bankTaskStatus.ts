import { BankDetailsTaskStatus } from "@framework/types";

export class BankDetailsTaskStatusMapper {
  private readonly options = {
    toDo: "To Do",
    incomplete: "In progress",
    complete: "Complete",
  };

  public mapFromSalesforce = (option: string | undefined): BankDetailsTaskStatus => {
    switch (option) {
      case this.options.toDo:
        return BankDetailsTaskStatus.ToDo;
      case this.options.incomplete:
        return BankDetailsTaskStatus.Incomplete;
      case this.options.complete:
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

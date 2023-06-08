import { SpendProfileStatus } from "@framework/types";

export class PartnerSpendProfileStatusMapper {
  private readonly options = {
    toDo: "To Do",
    incomplete: "In progress",
    complete: "Complete",
  };

  public mapFromSalesforce = (option: string | undefined): SpendProfileStatus => {
    switch (option) {
      case this.options.toDo:
        return SpendProfileStatus.ToDo;
      case this.options.incomplete:
        return SpendProfileStatus.Incomplete;
      case this.options.complete:
        return SpendProfileStatus.Complete;
      default:
        return SpendProfileStatus.Unknown;
    }
  };

  public mapToSalesforce = (option: SpendProfileStatus | undefined) => {
    switch (option) {
      case SpendProfileStatus.ToDo:
        return this.options.toDo;
      case SpendProfileStatus.Incomplete:
        return this.options.incomplete;
      case SpendProfileStatus.Complete:
        return this.options.complete;
      default:
        return undefined;
    }
  };
}

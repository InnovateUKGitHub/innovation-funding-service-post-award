import { IContext, PCRStatus } from "@framework/types";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { mapToPCRStatus } from "@server/repositories/mappers/projectChangeRequestMapper";

export class GetPcrStatusesQuery extends OptionsQueryBase<PCRStatus> {
  constructor() {
    super("PCRStatuses");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.projectChangeRequests.getPcrChangeStatuses();
  }

  protected mapToEnumValue(value: string) {
      return mapToPCRStatus(value);
  }
}

import { PCRStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { mapToPCRStatus } from "@framework/mappers/pcr";

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

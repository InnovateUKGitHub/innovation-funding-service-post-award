import { IContext, PCRParticipantSize } from "@framework/types";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { PcrParticipantSizeMapper } from "@server/repositories/mappers/projectChangeRequestMapper";

export class GetPcrParticipantSizesQuery extends OptionsQueryBase<PCRParticipantSize> {
  constructor() {
    super("PCRParticipantSize");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.projectChangeRequests.getParticipantSizes();
  }

  protected mapToEnumValue(value: string) {
    return new PcrParticipantSizeMapper().mapFromSalesforcePCRParticipantSize(value);
  }
}

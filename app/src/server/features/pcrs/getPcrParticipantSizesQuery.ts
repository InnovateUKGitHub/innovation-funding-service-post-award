import { PCRParticipantSize } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { PcrParticipantSizeMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

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

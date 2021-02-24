import { IContext, PCRProjectLocation } from "@framework/types";
import { PCRProjectLocationMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

export class GetPcrProjectLocationsQuery extends OptionsQueryBase<PCRProjectLocation> {
  constructor() {
    super("PCRProjectLocations");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.projectChangeRequests.getProjectLocations();
  }

  protected mapToEnumValue(value: string) {
    return new PCRProjectLocationMapper().mapFromSalesforecPCRProjectLocation(value);
  }
}

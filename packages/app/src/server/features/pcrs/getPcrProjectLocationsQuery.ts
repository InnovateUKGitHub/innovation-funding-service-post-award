import { PCRProjectLocation } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { PCRProjectLocationMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

export class GetPcrProjectLocationsQuery extends OptionsQueryBase<PCRProjectLocation> {
  public readonly runnableName: string = "GetPcrProjectLocationsQuery";
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

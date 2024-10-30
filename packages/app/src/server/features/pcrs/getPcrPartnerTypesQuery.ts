import { PCRPartnerType } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { PcrPartnerTypeMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

export class GetPcrPartnerTypesQuery extends OptionsQueryBase<PCRPartnerType> {
  public readonly runnableName: string = "GetPcrPartnerTypesQuery";
  constructor() {
    super("PCRPartnerTypes");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.projectChangeRequests.getPartnerTypes();
  }

  protected mapToEnumValue(value: string) {
    return new PcrPartnerTypeMapper().mapFromSalesforcePCRPartnerType(value);
  }
}

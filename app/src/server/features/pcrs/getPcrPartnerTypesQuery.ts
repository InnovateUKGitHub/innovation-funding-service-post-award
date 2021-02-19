import { IContext, PCRPartnerType } from "@framework/types";
import { PcrPartnerTypeMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

export class GetPcrPartnerTypesQuery extends OptionsQueryBase<PCRPartnerType> {
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

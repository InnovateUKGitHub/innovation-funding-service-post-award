import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { IContext } from "@framework/types/IContext";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { Params } from "@ui/containers/forecasts/update";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import {
  ProjectDashboardRoute,
  ProjectSetupParams,
  ProjectSetupRoute,
} from "@ui/containers";
import { PartnerDto } from "@framework/dtos";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";

export class ProjectSetupFormHandler extends StandardFormHandlerBase<ProjectSetupParams, "partner"> {
  constructor() {
    super(ProjectSetupRoute, ["default"], "partner");
  }
  protected async getDto(context: IContext, params: Params, button: IFormButton, body: { [key: string]: string; }): Promise<PartnerDto> {
    return context.runQuery(new GetPartnerByIdQuery(params.partnerId));
  }

  protected async run(context: IContext, params: Params, button: IFormButton, dto: PartnerDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePartnerCommand(dto));
    return ProjectDashboardRoute.getLink({});
  }

  protected getStoreKey(params: Params) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: Params, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], {showValidationErrors: false});
  }
}

import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";

import { storeKeys } from "@ui/redux/stores/storeKeys";
import {
  ProjectDashboardRoute,
  ProjectSetupParams,
  ProjectSetupRoute,
} from "@ui/containers";
import { PartnerDto } from "@framework/dtos";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { IFormButton, StandardFormHandlerBase } from "./formHandlerBase";

export class ProjectSetupFormHandler extends StandardFormHandlerBase<ProjectSetupParams, "partner"> {
  constructor() {
    super(ProjectSetupRoute, ["default"], "partner");
  }
  protected async getDto(context: IContext, params: ProjectSetupParams): Promise<PartnerDto> {
    return context.runQuery(new GetPartnerByIdQuery(params.partnerId));
  }

  protected async run(context: IContext, params: ProjectSetupParams, button: IFormButton, dto: PartnerDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePartnerCommand(dto));
    return ProjectDashboardRoute.getLink({});
  }

  protected getStoreKey(params: ProjectSetupParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: ProjectSetupParams, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], {showValidationErrors: false});
  }
}

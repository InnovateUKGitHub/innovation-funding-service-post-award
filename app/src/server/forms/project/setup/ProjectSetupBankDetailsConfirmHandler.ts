import { IContext, ILinkInfo, PartnerDto } from "@framework/types";
import { GetByIdQuery } from "@server/features/partners";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import {
  PartnerDetailsParams,
  ProjectSetupBankDetailsParams,
  ProjectSetupBankDetailsVerifyRoute,
} from "@ui/containers";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "../../formHandlerBase";

export class ProjectSetupBankDetailsConfirmHandler extends StandardFormHandlerBase<
  ProjectSetupBankDetailsParams,
  "partner"
> {
  constructor() {
    super(ProjectSetupBankDetailsVerifyRoute, ["default"], "partner");
  }

  protected async getDto(
    context: IContext,
    params: PartnerDetailsParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PartnerDto> {
    const dto = await context.runQuery(new GetByIdQuery(params.partnerId));
    return dto;
  }

  protected async run(
    context: IContext,
    params: ProjectSetupBankDetailsParams,
    button: IFormButton,
    dto: PartnerDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePartnerCommand(dto, false, true));
    return ProjectSetupBankDetailsVerifyRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectSetupBankDetailsParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: ProjectSetupBankDetailsParams, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], {
      showValidationErrors: false,
      validateBankDetails: false,
      failBankValidation: false,
    });
  }
}

import { BankDetailsTaskStatus } from "@framework/constants/partner";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { PartnerDetailsParams } from "@ui/pages/projects/partnerDetails/partnerDetailsEdit.page";
import { ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/pages/projects/setup/projectSetupBankStatement.page";
import { storeKeys } from "@server/features/common/storeKeys";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";

export class ProjectSetupBankStatementHandler extends StandardFormHandlerBase<
  ProjectSetupBankStatementParams,
  PartnerDto
> {
  constructor() {
    super(ProjectSetupBankStatementRoute, ["default"]);
  }

  protected async getDto(context: IContext, params: PartnerDetailsParams): Promise<PartnerDto> {
    const dto = await context.runQuery(new GetByIdQuery(params.partnerId));

    // Mark the DTO as intending to transition to Complete.
    // Write will fail if it's not actually possible, for example,
    // if the user hasn't uploaded any bank statements.
    dto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;

    return dto;
  }

  protected async run(
    context: IContext,
    params: ProjectSetupBankStatementParams,
    button: IFormButton,
    dto: PartnerDto,
  ): Promise<ILinkInfo> {
    // Attempt to update the partner information.
    // Will crash and burn if there are validation errors,
    // which will return to the current page as expected.
    await context.runCommand(new UpdatePartnerCommand(dto));

    // Accept that the user is done.
    return ProjectSetupRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectSetupBankStatementParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: ProjectSetupBankStatementParams, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], {
      showValidationErrors: false,
      validateBankDetails: false,
      failBankValidation: false,
    });
  }
}

import { BankDetailsTaskStatus, IContext, ILinkInfo, PartnerDto } from "@framework/types";
import { GetByIdQuery } from "@server/features/partners";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import {
  PartnerDetailsParams,
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
  ProjectSetupRoute,
} from "@ui/containers";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "../../formHandlerBase";

export class ProjectSetupBankStatementHandler extends StandardFormHandlerBase<
  ProjectSetupBankStatementParams,
  "partner"
> {
  constructor() {
    super(ProjectSetupBankStatementRoute, ["default"], "partner");
  }

  protected async getDto(
    context: IContext,
    params: PartnerDetailsParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PartnerDto> {
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
    await context.runCommand(new UpdatePartnerCommand(dto, false, false));

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

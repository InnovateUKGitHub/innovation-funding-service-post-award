import { BankCheckStatus } from "@framework/constants/partner";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { BankCheckStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { FailedBankCheckConfirmationRoute } from "@ui/containers/pages/projects/failedBankCheckConfirmation.page";
import { PartnerDetailsParams } from "@ui/containers/pages/projects/partnerDetails/partnerDetailsEdit.page";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import {
  ProjectSetupBankDetailsVerifyParams,
  ProjectSetupBankDetailsVerifyRoute,
} from "@ui/containers/pages/projects/setup/projectSetupBankDetailsVerify.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";

export class ProjectSetupBankDetailsVerifyHandler extends StandardFormHandlerBase<
  ProjectSetupBankDetailsVerifyParams,
  "partner"
> {
  constructor() {
    super(ProjectSetupBankDetailsVerifyRoute, ["default"], "partner");
  }

  protected async getDto(context: IContext, params: PartnerDetailsParams): Promise<PartnerDto> {
    const dto = await context.runQuery(new GetByIdQuery(params.partnerId));
    return dto;
  }

  protected async run(
    context: IContext,
    params: ProjectSetupBankDetailsVerifyParams,
    button: IFormButton,
    dto: PartnerDto,
  ): Promise<ILinkInfo> {
    // Obtain a mapper, which converts Salesforce status names to our enums.
    const bankCheckStatusMapper = new BankCheckStatusMapper();

    // Run an Experian verification on the DTO
    await context.runCommand(
      new UpdatePartnerCommand(dto, {
        verifyBankDetails: true,
      }),
    );

    // Re-obtain the new results
    const partnerDto = await context.repositories.partners.getById(dto.id);
    const bankStatus = bankCheckStatusMapper.mapFromSalesforce(partnerDto.bankCheckStatus);

    if (bankStatus === BankCheckStatus.VerificationPassed) {
      // We've passed - Go to the ProjectSetupRoute.
      return ProjectSetupRoute.getLink(params);
    } else if (bankStatus === BankCheckStatus.VerificationFailed) {
      // We've failed - Go to fallback screen.
      return FailedBankCheckConfirmationRoute.getLink(params);
    } else {
      // Unknown state! Go back to the first page entirely.
      return ProjectSetupRoute.getLink(params);
    }
  }

  protected getStoreKey(params: ProjectSetupBankDetailsVerifyParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: ProjectSetupBankDetailsVerifyParams, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], {
      showValidationErrors: false,
      validateBankDetails: false,
      failBankValidation: false,
    });
  }
}

import { BankCheckStatus, IContext, ILinkInfo, PartnerDto } from "@framework/types";
import { GetByIdQuery } from "@server/features/partners";
import { BankCheckStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import {
  FailedBankCheckConfirmationRoute,
  PartnerDetailsParams,
  ProjectSetupBankDetailsParams,
  ProjectSetupBankDetailsVerifyRoute,
  ProjectSetupRoute,
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
    // Obtain a mapper, which converts Salesforce status names to our enums.
    const bankCheckStatusMapper = new BankCheckStatusMapper();

    // Run an Experian verification on the DTO
    await context.runCommand(new UpdatePartnerCommand(dto, false, true));

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

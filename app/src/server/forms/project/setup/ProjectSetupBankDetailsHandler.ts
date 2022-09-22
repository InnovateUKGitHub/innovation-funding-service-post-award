import { IContext, ILinkInfo, PartnerDto } from "@framework/types";
import { GetByIdQuery } from "@server/features/partners";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import {
  PartnerDetailsParams,
  ProjectSetupBankDetailsParams,
  ProjectSetupBankDetailsRoute,
  ProjectSetupRoute,
} from "@ui/containers";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "../../formHandlerBase";

export class ProjectSetupBankDetailsHandler extends StandardFormHandlerBase<ProjectSetupBankDetailsParams, "partner"> {
  constructor() {
    super(ProjectSetupBankDetailsRoute, ["default"], "partner");
  }

  protected async getDto(
    context: IContext,
    params: PartnerDetailsParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PartnerDto> {
    const dto = await context.runQuery(new GetByIdQuery(params.partnerId));

    dto.bankDetails.companyNumber = body["companyNumber"];
    dto.bankDetails.sortCode = body["sortCode"];
    dto.bankDetails.accountNumber = body["accountNumber"];
    dto.bankDetails.address.accountBuilding = body["accountBuilding"];
    dto.bankDetails.address.accountLocality = body["accountLocality"];
    dto.bankDetails.address.accountPostcode = body["accountPostcode"];
    dto.bankDetails.address.accountStreet = body["accountStreet"];
    dto.bankDetails.address.accountTownOrCity = body["accountTownOrCity"];

    return dto;
  }

  protected async run(
    context: IContext,
    params: ProjectSetupBankDetailsParams,
    button: IFormButton,
    dto: PartnerDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePartnerCommand(dto, true, true));
    return ProjectSetupRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectSetupBankDetailsParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: ProjectSetupBankDetailsParams, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], {
      showValidationErrors: false,
      validateBankDetails: true,
      failBankValidation: true,
    });
  }
}

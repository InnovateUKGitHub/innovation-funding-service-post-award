import { PartnerDto } from "@framework/dtos/partnerDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { PartnerDetailsParams } from "@ui/containers/pages/projects/partnerDetails/partnerDetailsEdit.page";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import { ProjectSetupPartnerPostcodeRoute } from "@ui/containers/pages/projects/setup/projectSetupPartnerPostcode.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";

export class ProjectSetupPartnerPostcodeFormHandler extends StandardFormHandlerBase<PartnerDetailsParams, PartnerDto> {
  constructor() {
    super(ProjectSetupPartnerPostcodeRoute, ["default"]);
  }

  protected async getDto(
    context: IContext,
    params: PartnerDetailsParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PartnerDto> {
    const dto = await context.runQuery(new GetByIdQuery(params.partnerId));

    const newPostcode = "postcode";

    dto.postcode = body[newPostcode];

    return dto;
  }

  protected async run(
    context: IContext,
    params: PartnerDetailsParams,
    button: IFormButton,
    dto: PartnerDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePartnerCommand(dto));

    return ProjectSetupRoute.getLink(params);
  }

  protected getStoreKey(params: PartnerDetailsParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: PartnerDetailsParams, dto: PartnerDto) {
    return new PartnerDtoValidator(dto, dto, [], {
      showValidationErrors: false,
    });
  }
}

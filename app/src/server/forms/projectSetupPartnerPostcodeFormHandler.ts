import { PartnerDetailsParams, ProjectSetupPartnerPostcodeRoute, ProjectSetupRoute } from "@ui/containers";
import { IContext, ILinkInfo, PartnerDto } from "@framework/types";
import { GetByIdQuery } from "@server/features/partners";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "./formHandlerBase";

export class ProjectSetupPartnerPostcodeFormHandler extends StandardFormHandlerBase<PartnerDetailsParams, "partner"> {
  constructor() {
    super(ProjectSetupPartnerPostcodeRoute, ["default"], "partner");
  }

  protected async getDto(
    context: IContext,
    params: PartnerDetailsParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PartnerDto> {
    const dto = await context.runQuery(new GetByIdQuery(params.partnerId));

    const newPostcode = "new-postcode";

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

import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetUnfilteredCostCategoriesQuery } from "@server/features/claims/getCostCategoriesQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { BadRequestError } from "@shared/appError";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import {
  PcrDeleteSpendProfileCostParams,
  PCRSpendProfileDeleteCostRoute,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileDeleteCost.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export class ProjectChangeRequestSpendProfileDeleteCostHandler extends StandardFormHandlerBase<
  PcrDeleteSpendProfileCostParams,
  PCRDto
> {
  constructor() {
    super(PCRSpendProfileDeleteCostRoute, ["delete"]);
  }

  protected async getDto(
    context: IContext,
    params: PcrDeleteSpendProfileCostParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
    if (!body.id) {
      throw new BadRequestError("Cost not found");
    }
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId) as PCRItemForPartnerAdditionDto;

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const costCategory = costCategories.find(x => x.id === params.costCategoryId);

    if (!costCategory) {
      throw new BadRequestError("Unknown cost category");
    }

    const cost = item.spendProfile.costs.find(x => x.id === body.id && x.costCategoryId === params.costCategoryId);

    if (!cost) {
      throw new BadRequestError("Cost not found");
    }

    const index = item.spendProfile.costs.indexOf(cost);

    if (index === -1) {
      throw new BadRequestError("Cost not found in costs");
    }

    item.spendProfile.costs.splice(index, 1);

    return dto;
  }

  protected async run(
    context: IContext,
    params: PcrDeleteSpendProfileCostParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcr: dto,
        pcrStepType: PCRStepType.spendProfileStep,
      }),
    );

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    });
  }

  protected getStoreKey(params: PcrDeleteSpendProfileCostParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrDeleteSpendProfileCostParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
      pcrStepType: PCRStepType.spendProfileStep,
    });
  }
}

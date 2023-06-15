import { PCRItemStatus } from "@framework/constants";
import { IContext, ILinkInfo, PCRDto, PCRItemForPartnerAdditionDto, PCRStepId } from "@framework/types";
import { GetUnfilteredCostCategoriesQuery } from "@server/features/claims";
import { BadRequestError } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PcrDeleteSpendProfileCostParams,
  PCRSpendProfileCostsSummaryRoute,
  PCRSpendProfileDeleteCostRoute,
} from "@ui/containers";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validators";

export class ProjectChangeRequestSpendProfileDeleteCostHandler extends StandardFormHandlerBase<
  PcrDeleteSpendProfileCostParams,
  "pcr"
> {
  constructor() {
    super(PCRSpendProfileDeleteCostRoute, ["delete"], "pcr");
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
        pcrStepId: PCRStepId.spendProfileStep,
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
      pcrStepId: PCRStepId.spendProfileStep,
    });
  }
}

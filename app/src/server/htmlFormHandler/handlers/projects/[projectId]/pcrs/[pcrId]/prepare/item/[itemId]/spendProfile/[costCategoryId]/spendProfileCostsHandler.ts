import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { BadRequestError } from "@shared/appError";
import {
  PcrSpendProfileCostSummaryParams,
  PCRSpendProfileCostsSummaryRoute,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { PCRPrepareItemRoute } from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export class ProjectChangeRequestSpendProfileCostsSummaryHandler extends StandardFormHandlerBase<
  PcrSpendProfileCostSummaryParams,
  "pcr"
> {
  constructor() {
    super(PCRSpendProfileCostsSummaryRoute, ["default"], "pcr");
  }

  protected async getDto(
    context: IContext,
    params: PcrSpendProfileCostSummaryParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId) as PCRItemForPartnerAdditionDto;

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    return dto;
  }

  protected async run(
    context: IContext,
    params: PcrSpendProfileCostSummaryParams,
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

    const addPartnerItem = dto.items.find(x => x.id === params.itemId) as PCRItemForPartnerAdditionDto;

    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined);
    if (!summaryWorkflow) throw new Error("summary workflow is null");
    const spendProfileS = summaryWorkflow.findStepNumberByName(PCRStepType.spendProfileStep);
    const addPartnerWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, spendProfileS);
    const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId as PcrId,
      itemId: params.itemId as PcrItemId,
      step: (spendProfileStep && spendProfileStep.stepNumber) || undefined,
    });
  }

  protected getStoreKey(params: PcrSpendProfileCostSummaryParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrSpendProfileCostSummaryParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
      pcrStepType: PCRStepType.spendProfileStep,
    });
  }
}

import { IContext, ILinkInfo, PCRDto, PCRItemForPartnerAdditionDto, ProjectDto, ProjectRole } from "@framework/types";
import { BadRequestError, Configuration } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRPrepareItemRoute,
  PCRSpendProfileCostsSummaryRoute,
  PcrSpendProfileCostSummaryParams
} from "@ui/containers";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export class ProjectChangeRequestSpendProfileCostsSummaryHandler extends StandardFormHandlerBase<PcrSpendProfileCostSummaryParams, "pcr"> {
  constructor() {
    super(PCRSpendProfileCostsSummaryRoute, ["default"], "pcr");
  }

  protected async getDto(context: IContext, params: PcrSpendProfileCostSummaryParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId) as PCRItemForPartnerAdditionDto;

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    return dto;
  }

  protected async run(context: IContext, params: PcrSpendProfileCostSummaryParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));

    const addPartnerItem = dto.items.find(x => x.id === params.itemId) as PCRItemForPartnerAdditionDto;

    const summaryWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, undefined, Configuration.features);
    const spendProfileS = summaryWorkflow!.findStepNumberByName("spendProfileStep");
    const addPartnerWorkflow = PcrWorkflow.getWorkflow(addPartnerItem, spendProfileS, Configuration.features);
    const spendProfileStep = addPartnerWorkflow && addPartnerWorkflow.getCurrentStepInfo();

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: spendProfileStep && spendProfileStep.stepNumber || undefined,
    });
  }

  protected getStoreKey(params: PcrSpendProfileCostSummaryParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrSpendProfileCostSummaryParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, Configuration.features, dto);
  }
}

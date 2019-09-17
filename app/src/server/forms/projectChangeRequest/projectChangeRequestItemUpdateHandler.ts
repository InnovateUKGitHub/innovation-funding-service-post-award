import { PCRItemStatus, PCRItemType } from "@framework/entities";
import { IContext, ILinkInfo, PCRDto, PCRItemTypeDto, ProjectRole } from "@framework/types";
import { BadRequestError } from "@server/features/common";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestPrepareItemParams, ProjectChangeRequestPrepareItemRoute, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { getAllPcrTypes, getPcrEditor } from "@ui/redux/selectors";
import { dataStoreHelper } from "@ui/redux/selectors/common";
import { getPcr } from "@ui/redux/selectors/pcrs";
import { PCRDtoValidator } from "@ui/validators";

export class ProjectChangeRequestItemUpdateHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareItemParams, PCRDto, PCRDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareItemRoute, ["default"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId);

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    return dto;
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));
    return ProjectChangeRequestPrepareRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareItemParams): { key: string, store: string } {
    return getPcrEditor(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: PCRDto) {
    const projectChangeRequestItemTypes: PCRItemTypeDto[] = [{
      type: PCRItemType.AccountNameChange,
      displayName: "",
      recordTypeId: "",
      enabled: false
    }];
    return new PCRDtoValidator(dto, ProjectRole.Unknown, dto, projectChangeRequestItemTypes, false);
  }
}

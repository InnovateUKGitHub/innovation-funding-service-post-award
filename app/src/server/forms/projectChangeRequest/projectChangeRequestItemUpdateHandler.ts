import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity } from "@framework/entities";
import { IContext, ILinkInfo, PCRDto, ProjectRole } from "@framework/types";
import { BadRequestError } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestPrepareItemParams, ProjectChangeRequestPrepareItemRoute, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { getPcrEditor } from "@ui/redux/selectors";
import { PCRDtoValidator } from "@ui/validators";
import { DateTime } from "luxon";

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

    item.status = body.itemStatus === "true" ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete;

    if (item.type === ProjectChangeRequestItemTypeEntity.TimeExtension) {
      const projectEndDate = DateTime.fromFormat(`${body.endDate_month}/${body.endDate_year}`, "M/yyyy").endOf("month").startOf("day");
      item.projectEndDate = projectEndDate.toJSDate();
    }

    if(item.type === ProjectChangeRequestItemTypeEntity.ScopeChange) {
      item.publicDescription = body.description || "";
      item.projectSummary = body.summary || "";
    }

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
    return new PCRDtoValidator(dto, ProjectRole.Unknown, dto, [], false);
  }
}

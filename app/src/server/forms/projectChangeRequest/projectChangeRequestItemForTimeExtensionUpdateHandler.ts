import { DateTime } from "luxon";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity } from "@framework/entities";
import { IContext, ILinkInfo, PCRDto, PCRItemTypeDto, ProjectRole } from "@framework/types";
import { BadRequestError } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  ProjectChangeRequestPrepareItemForTimeExtensionParams,
  ProjectChangeRequestPrepareItemForTimeExtensionRoute,
  ProjectChangeRequestPrepareRoute
} from "@ui/containers";
import { getPcrEditor } from "@ui/redux/selectors";
import { PCRDtoValidator } from "@ui/validators";

export class ProjectChangeRequestItemForTimeExtensionUpdateHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareItemForTimeExtensionParams, PCRDto, PCRDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareItemForTimeExtensionRoute, ["default"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemForTimeExtensionParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId);

    if (!item || item.type !== ProjectChangeRequestItemTypeEntity.TimeExtension) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete;
    item.projectEndDate = DateTime.fromFormat(`${body.endDate_day}/${body.endDate_month}/${body.endDate_year}`, "d/M/yyyy").toJSDate();

    return dto;
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemForTimeExtensionParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));
    return ProjectChangeRequestPrepareRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareItemForTimeExtensionParams): { key: string, store: string } {
    return getPcrEditor(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemForTimeExtensionParams, dto: PCRDto) {
    const projectChangeRequestItemTypes: PCRItemTypeDto[] = [{
      type: ProjectChangeRequestItemTypeEntity.AccountNameChange,
      displayName: "",
      recordTypeId: "",
      enabled: false
    }];
    return new PCRDtoValidator(dto, ProjectRole.Unknown, dto, projectChangeRequestItemTypes, false);
  }
}

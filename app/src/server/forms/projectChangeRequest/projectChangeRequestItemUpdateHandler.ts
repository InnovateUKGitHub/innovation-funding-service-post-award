import { IContext, ILinkInfo, ProjectRole } from "@framework/types";
import { BadRequestError } from "@server/features/common";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestPrepareItemParams, ProjectChangeRequestPrepareItemRoute, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { getPcrEditor } from "@ui/redux/selectors";
import { PCRDtoValidator } from "@ui/validators";
import { DateTime } from "luxon";
import * as Dtos from "@framework/dtos";
import { PCRItemStatus, PCRItemType } from "@framework/constants";

export class ProjectChangeRequestItemUpdateHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareItemParams, Dtos.PCRDto, PCRDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareItemRoute, ["default"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody): Promise<Dtos.PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const item = dto.items.find(x => x.id === params.itemId);

    if (!item) {
      throw new BadRequestError();
    }

    item.status = body.itemStatus === "true" ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    if (item.type === PCRItemType.ScopeChange) {
      this.updateScopeChange(item, body);
    }

    if (item.type === PCRItemType.ProjectSuspension) {
      this.updateProjectSuspension(item, body);
    }

    if (item.type === PCRItemType.AccountNameChange) {
      this.updateNameChange(item, body);
    }
    return dto;
  }

  private updateProjectSuspension(item: Dtos.PCRItemForProjectSuspensionDto, body: IFormBody) {
    if (body.suspensionStartDate_month || body.suspensionStartDate_year) {
      const suspensionStartDate = DateTime.fromFormat(`${body.suspensionStartDate_month}/${body.suspensionStartDate_year}`, "M/yyyy").startOf("month").startOf("day");
      item.suspensionStartDate = suspensionStartDate.toJSDate();
    }
    else {
      item.suspensionStartDate = null;
    }
    if (body.suspensionEndDate_month || body.suspensionEndDate_year) {
      const suspensionEndDate = DateTime.fromFormat(`${body.suspensionEndDate_month}/${body.suspensionEndDate_year}`, "M/yyyy").endOf("month").startOf("day");
      item.suspensionEndDate = suspensionEndDate.toJSDate();
    }
    else {
      item.suspensionEndDate = null;
    }
  }

  private updateScopeChange(item: Dtos.PCRItemForScopeChangeDto, body: IFormBody) {
    item.publicDescription = body.description || "";
    item.projectSummary = body.summary || "";
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: Dtos.PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.pcrId, dto));
    return ProjectChangeRequestPrepareRoute.getLink(params);
  }

  private updateNameChange(item: Dtos.PCRItemForAccountNameChangeDto, body: IFormBody) {
    item.partnerId = body.partnerId;
    item.accountName = body.accountName;
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareItemParams): { key: string, store: string } {
    return getPcrEditor(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: Dtos.PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, dto);
  }
}

import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  ProjectChangeRequestAddTypeParams,
  ProjectChangeRequestAddTypeRoute,
  ProjectChangeRequestPrepareRoute,
} from "@ui/containers";
import { PCRDto, PCRItemDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { getPcrEditor } from "@ui/redux/selectors";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { PCRDtoValidator } from "@ui/validators";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";

export class ProjectChangeRequestAddTypeFormHandler extends StandardFormHandlerBase<ProjectChangeRequestAddTypeParams, PCRDto, PCRDtoValidator> {
  constructor() {
    super(ProjectChangeRequestAddTypeRoute, ["default"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestAddTypeParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.projectChangeRequestId));

    const originalTypes = dto.items.map(x => x.type);
    const formValuesAsArray: string[] = body.types ? Array.isArray(body.types) ? body.types : [body.types] : [];

    const formTypes = formValuesAsArray.map(x => parseInt(x, 10));
    const newItems = formTypes
      .filter(x => originalTypes.indexOf(x) < 0)
      .map(x => ({
        type: x,
        status: ProjectChangeRequestItemStatus.ToDo,
      } as PCRItemDto));

    return {
      ...dto,
      items: [ ...dto.items, ...newItems ]
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestAddTypeParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdatePCRCommand(params.projectId, params.projectChangeRequestId, dto));
    return ProjectChangeRequestPrepareRoute.getLink({projectId: params.projectId, pcrId: params.projectChangeRequestId});
  }

  protected getStoreInfo(params: ProjectChangeRequestAddTypeParams): { key: string; store: string; } {
    return getPcrEditor(params.projectId, params.projectChangeRequestId);
  }

  protected createValidationResult(params: ProjectChangeRequestAddTypeParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, dto, [], false);
  }
}

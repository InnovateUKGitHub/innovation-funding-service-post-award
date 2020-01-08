import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { CreateProjectChangeRequestParams, PCRCreateRoute, ProjectChangeRequestPrepareRoute, } from "@ui/containers";
import { PCRDto, PCRItemDto, PCRStandardItemDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus, PCRStatus } from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ProjectChangeRequestCreateFormHandler extends StandardFormHandlerBase<CreateProjectChangeRequestParams, "pcr"> {
  constructor() {
    super(PCRCreateRoute, ["default"], "pcr");
  }

  protected async getDto(context: IContext, params: CreateProjectChangeRequestParams, button: IFormButton, body: IFormBody): Promise<PCRDto> {

    const types: string[] = body.types ? Array.isArray(body.types) ? body.types : [body.types] : [];

    const items: Partial<PCRItemDto>[] = types.map((x: string) => ({
      type: parseInt(x, 10),
      status: PCRItemStatus.ToDo,
    }));

    const dto: Partial<PCRDto> = {
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      projectId: params.projectId,
      items: items as PCRStandardItemDto[]
    };

    return dto as PCRDto;
  }

  protected async run(context: IContext, params: CreateProjectChangeRequestParams, button: IFormButton, dto: PCRDto): Promise<ILinkInfo> {
    const id = await context.runCommand(new CreateProjectChangeRequestCommand(params.projectId, dto));
    return ProjectChangeRequestPrepareRoute.getLink({projectId: params.projectId, pcrId: id});
  }

  protected getStoreKey(params: CreateProjectChangeRequestParams) {
    return storeKeys.getPcrKey(params.projectId);
  }

  protected createValidationResult(params: CreateProjectChangeRequestParams, dto: PCRDto) {
    return new PCRDtoValidator(dto, ProjectRole.Unknown, [], false, {} as ProjectDto, dto);
  }
}

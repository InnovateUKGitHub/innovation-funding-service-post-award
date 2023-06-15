import { PCRItemStatus } from "@framework/constants";
import { PCRDto, PCRStandardItemDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestAddTypeRoute, ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { PcrUpdateParams } from "@ui/containers/pcrs/modifyOptions/PcrModifyOptions";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validators";

export class ProjectChangeRequestAddTypeFormHandler extends StandardFormHandlerBase<PcrUpdateParams, "pcr"> {
  constructor() {
    super(ProjectChangeRequestAddTypeRoute, ["default"], "pcr");
  }

  protected async getDto(
    context: IContext,
    params: PcrUpdateParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<PCRDto> {
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.projectChangeRequestId));

    const formValuesAsArray: string[] = body.types ? (Array.isArray(body.types) ? body.types : [body.types]) : [];

    const newItems = formValuesAsArray
      .map(x => parseInt(x, 10))
      .filter(x => !!x)
      .map(
        x =>
          ({
            type: x,
            status: PCRItemStatus.ToDo,
          } as PCRStandardItemDto),
      );

    return {
      ...dto,
      items: [...dto.items, ...newItems],
    };
  }

  protected async run(
    context: IContext,
    params: PcrUpdateParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.projectChangeRequestId,
        pcr: dto,
      }),
    );
    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.projectChangeRequestId,
    });
  }

  protected getStoreKey(params: PcrUpdateParams) {
    return storeKeys.getPcrKey(params.projectId, params.projectChangeRequestId);
  }

  protected createValidationResult(params: PcrUpdateParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
    });
  }
}

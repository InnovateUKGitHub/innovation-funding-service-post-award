import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { ProjectChangeRequestAddTypeRoute } from "@ui/containers/pages/pcrs/addType";
import { PcrUpdateParams } from "@ui/containers/pages/pcrs/modifyOptions/PcrModifyOptions";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

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
    const dto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const formValuesAsArray: string[] = body.types ? (Array.isArray(body.types) ? body.types : [body.types]) : [];

    const newItems = formValuesAsArray
      .map(x => parseInt(x, 10))
      .filter(x => !!x)
      .map(
        x =>
          ({
            type: x,
            status: PCRItemStatus.ToDo,
          } as PCRItemDto),
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
        projectChangeRequestId: params.pcrId,
        pcr: dto,
      }),
    );
    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    });
  }

  protected getStoreKey(params: PcrUpdateParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: PcrUpdateParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
    });
  }
}

import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemDto, PCRItemForPartnerAdditionDto, PCRStandardItemDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRCreateRoute } from "@ui/containers/pcrs/create";
import { PcrModifyParams } from "@ui/containers/pcrs/modifyOptions/PcrModifyOptions";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pcrs/overview/projectChangeRequestPrepare.page";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";

export class ProjectChangeRequestCreateFormHandler extends StandardFormHandlerBase<PcrModifyParams, "pcr"> {
  constructor() {
    super(PCRCreateRoute, ["default"], "pcr");
  }

  protected async getDto(
    context: IContext,
    params: PcrModifyParams,
    button: IFormButton,
    body: IFormBody & { types?: string | string[] },
  ): Promise<PCRDto> {
    const types: string[] = body.types ? (Array.isArray(body.types) ? body.types : [body.types]) : [];

    const items: Partial<PCRItemDto>[] = types.map((x: string) => ({
      type: parseInt(x, 10),
      status: PCRItemStatus.ToDo,
    }));

    const addPartnerItem = items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;

    if (addPartnerItem) {
      const initialSpendProfile = {
        costs: [],
        funds: [],
        pcrItemId: addPartnerItem.id,
      };

      addPartnerItem.spendProfile = initialSpendProfile;
    }

    const dto: Partial<PCRDto> = {
      status: PCRStatus.Draft,
      reasoningStatus: PCRItemStatus.ToDo,
      projectId: params.projectId,
      items: items as PCRStandardItemDto[],
    };

    return dto as PCRDto;
  }

  protected async run(
    context: IContext,
    params: PcrModifyParams,
    button: IFormButton,
    dto: PCRDto,
  ): Promise<ILinkInfo> {
    const id = (await context.runCommand(new CreateProjectChangeRequestCommand(params.projectId, dto))) as PcrId;
    return ProjectChangeRequestPrepareRoute.getLink({ projectId: params.projectId, pcrId: id });
  }

  protected getStoreKey(params: PcrModifyParams) {
    return storeKeys.getPcrKey(params.projectId);
  }

  protected createValidationResult(params: PcrModifyParams, dto: PCRDto) {
    return new PCRDtoValidator({
      model: dto,
      original: dto,
    });
  }
}

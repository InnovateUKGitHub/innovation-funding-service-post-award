import { IContext, ILinkInfo, PCRItemDto, PCRItemType } from "@framework/types";
import { Configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams
} from "@ui/containers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { getKey } from "@framework/util";
import { WorkFlow } from "@ui/containers/pcrs/workflow";

export class ProjectChangeRequestItemDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectChangeRequestPrepareItemParams, MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator> {
  constructor() {
    super(PCRPrepareItemRoute, ["uploadFile", "uploadFileAndContinue"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.itemId, dto));

    if (button.name === "uploadFileAndContinue") {
      const itemDto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId)).then(pcr => pcr.items.find(item => item.id === params.itemId)!);
      const workflow = WorkFlow.getWorkflow(itemDto, params.step);
      if (workflow) {
        const nextStep = workflow.getNextStepInfo();
        return PCRPrepareItemRoute.getLink({
          projectId: params.projectId,
          pcrId: params.pcrId,
          itemId: params.itemId,
          step: nextStep && nextStep.stepNumber
        });
      }
    }

    return PCRPrepareItemRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareItemParams): { key: string, store: string } {
    return {
      key: getKey("pcrs", params.projectId, params.itemId),
      store: "multipleDocuments"
    };
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true);
  }
}

import { IContext, ILinkInfo } from "@framework/types";
import { Configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams
} from "@ui/containers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export class ProjectChangeRequestItemDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectChangeRequestPrepareItemParams, "multipleDocuments"> {
  constructor() {
    super(PCRPrepareItemRoute, ["uploadFile", "uploadFileAndContinue"], "multipleDocuments");
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {

    if(dto.files.length || button.name === "uploadFile") {
      await context.runCommand(new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.itemId, dto));
    }

    if (button.name === "uploadFileAndContinue") {
      const itemDto = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId)).then(pcr => pcr.items.find(item => item.id === params.itemId)!);
      const workflow = PcrWorkflow.getWorkflow(itemDto, params.step, Configuration.features);
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

  protected getStoreKey(params: ProjectChangeRequestPrepareItemParams) {
    return storeKeys.getPcrKey(params.projectId, params.itemId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: MultipleDocumentUploadDto, button: IFormButton) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, button.name === "uploadFile", true, null);
  }
}

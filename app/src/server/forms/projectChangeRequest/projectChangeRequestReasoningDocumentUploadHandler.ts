import { DocumentDescription, IContext, ILinkInfo } from "@framework/types";
import { Configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRPrepareReasoningRoute, ProjectChangeRequestPrepareReasoningParams } from "@ui/containers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { reasoningWorkflowSteps } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export class ProjectChangeRequestReasoningDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectChangeRequestPrepareReasoningParams, "multipleDocuments"> {
  constructor() {
    super(PCRPrepareReasoningRoute, ["uploadFile", "uploadFileAndContinue"], "multipleDocuments");
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: parseInt(body.description, 10)
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    if (button.name === "uploadFile" || dto.files.length) {
      await context.runCommand(new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.pcrId, dto));
    }

    const nextStep = reasoningWorkflowSteps.find(x => x.stepNumber === (params.step ||0) + 1);

    return PCRPrepareReasoningRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      step: button.name === "uploadFile" ? params.step : nextStep && nextStep.stepNumber
    });
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareReasoningParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: MultipleDocumentUploadDto, button: IFormButton) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration.options, button.name === "uploadFile", true, null);
  }
}

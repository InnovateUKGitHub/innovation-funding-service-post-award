import { IContext, ILinkInfo } from "@framework/types";
import { Configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRPrepareReasoningRoute, ProjectChangeRequestPrepareReasoningParams } from "@ui/containers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { getKey } from "@framework/util";
import { reasoningWorkflowSteps } from "@ui/containers/pcrs/reasoning/workflowMetadata";

export class ProjectChangeRequestReasoningDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectChangeRequestPrepareReasoningParams, "multipleDocuments"> {
  constructor() {
    super(PCRPrepareReasoningRoute, ["uploadFile", "uploadFileAndContinue"], "multipleDocuments");
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
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
    return getKey("pcrs", params.projectId, params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: MultipleDocumentUploadDto, button: IFormButton) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, button.name === "uploadFile", true);
  }
}

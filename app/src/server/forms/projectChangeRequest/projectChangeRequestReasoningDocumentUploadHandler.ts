import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { reasoningWorkflowSteps } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import {
  ProjectChangeRequestPrepareReasoningParams,
  PCRPrepareReasoningRoute,
} from "@ui/containers/pcrs/reasoning/workflow.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

export class ProjectChangeRequestReasoningDocumentUploadHandler extends MultipleFileFormHandlerBase<
  ProjectChangeRequestPrepareReasoningParams,
  "multipleDocuments"
> {
  constructor() {
    super(PCRPrepareReasoningRoute, ["uploadFile", "uploadFileAndContinue"], "multipleDocuments");
  }

  protected async getDto(
    context: IContext,
    params: ProjectChangeRequestPrepareReasoningParams,
    button: IFormButton,
    body: IFormBody,
    files: IFileWrapper[],
  ): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: Number(body.description) || undefined,
    };
  }

  protected async run(
    context: IContext,
    params: ProjectChangeRequestPrepareReasoningParams,
    button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    if (button.name === "uploadFile" || dto.files.length) {
      await context.runCommand(
        new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.pcrId, dto),
      );
    }

    const nextStep = reasoningWorkflowSteps.find(x => x.stepNumber === (params.step || 0) + 1);

    return PCRPrepareReasoningRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      step: button.name === "uploadFile" ? params.step : nextStep && nextStep.stepNumber,
    });
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareReasoningParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(
    params: ProjectChangeRequestPrepareReasoningParams,
    dto: MultipleDocumentUploadDto,
    button: IFormButton,
  ) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, button.name === "uploadFile", true, null);
  }
}

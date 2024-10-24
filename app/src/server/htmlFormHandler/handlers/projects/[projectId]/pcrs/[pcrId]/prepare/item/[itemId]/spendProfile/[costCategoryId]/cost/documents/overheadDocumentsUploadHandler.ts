import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@server/features/common/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFileWrapper } from "@framework/types/fileWrapper";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import {
  OverheadDocumentsPageParams,
  PCRSpendProfileOverheadDocumentRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";

export class OverheadDocumentsUploadHandler extends MultipleFileFormHandlerBase<
  OverheadDocumentsPageParams,
  MultipleDocumentUploadDto
> {
  constructor() {
    super(PCRSpendProfileOverheadDocumentRoute, ["uploadFile"]);
  }

  protected async getDto(
    context: IContext,
    params: OverheadDocumentsPageParams,
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
    params: OverheadDocumentsPageParams,
    button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(
      new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.itemId, dto),
    );

    return PCRSpendProfileOverheadDocumentRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      costCategoryId: params.costCategoryId,
      itemId: params.itemId,
    });
  }

  protected getStoreKey(params: OverheadDocumentsPageParams): string {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: OverheadDocumentsPageParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, true, null);
  }
}

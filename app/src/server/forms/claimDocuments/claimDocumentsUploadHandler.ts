import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { UploadClaimDocumentsCommand } from "@server/features/documents/uploadClaimDocuments";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "../formHandlerBase";
import { IFileWrapper } from "@framework/types/fileWapper";
import { configuration } from "@server/features/common/config";
import { ClaimDocumentsPageParams, ClaimDocumentsRoute } from "@ui/containers/claims/claimDocuments.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

export class ClaimDocumentsUploadHandler extends MultipleFileFormHandlerBase<
  ClaimDocumentsPageParams,
  "multipleDocuments"
> {
  constructor() {
    super(ClaimDocumentsRoute, ["upload"], "multipleDocuments");
  }

  protected async getDto(
    context: IContext,
    params: ClaimDocumentsPageParams,
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
    params: ClaimDocumentsPageParams,
    button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    const claimDocumentsKey = { projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId };

    await context.runCommand(new UploadClaimDocumentsCommand(claimDocumentsKey, dto));

    return ClaimDocumentsRoute.getLink(params);
  }

  protected getStoreKey(params: ClaimDocumentsPageParams) {
    return storeKeys.getClaimKey(params.partnerId, params.periodId);
  }

  protected createValidationResult(params: ClaimDocumentsPageParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, true, null);
  }
}

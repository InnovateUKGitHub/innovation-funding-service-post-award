import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "../formHandlerBase";
import { ClaimDocumentsPageParams, ClaimDocumentsRoute } from "../../../ui/containers";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Configuration } from "@server/features/common";
import { UploadClaimDocumentsCommand } from "@server/features/documents/uploadClaimDocuments";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";

export class ClaimDocumentsUploadHandler extends MultipleFileFormHandlerBase<ClaimDocumentsPageParams, "multipleDocuments"> {
  constructor() {
    super(ClaimDocumentsRoute, ["upload"], "multipleDocuments");
  }

  protected async getDto(context: IContext, params: ClaimDocumentsPageParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
    };
  }

  protected async run(context: IContext, params: ClaimDocumentsPageParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    const claimDocumentsKey = { projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId };

    await context.runCommand(new UploadClaimDocumentsCommand(claimDocumentsKey, dto));

    return ClaimDocumentsRoute.getLink(params);
  }

  protected getStoreKey(params: ClaimDocumentsPageParams) {
    return storeKeys.getClaimKey(params.partnerId, params.periodId);
  }

  protected createValidationResult(params: ClaimDocumentsPageParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true, true);
  }
}

import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common";
import { UploadClaimDocumentsCommand } from "@server/features/documents/uploadClaimDocuments";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFileWrapper } from "@framework/types";
import { ReviewClaimParams, ReviewClaimRoute } from "@ui/containers";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "../formHandlerBase";

export class ClaimReviewDocumentsUploadHandler extends MultipleFileFormHandlerBase<
  ReviewClaimParams,
  "multipleDocuments"
> {
  constructor() {
    super(ReviewClaimRoute, ["reviewDocuments"], "multipleDocuments");
  }

  protected async getDto(
    _context: IContext,
    _params: ReviewClaimParams,
    _button: IFormButton,
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
    params: ReviewClaimParams,
    _button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UploadClaimDocumentsCommand(params, dto));

    return ReviewClaimRoute.getLink(params);
  }

  protected getStoreKey(params: ReviewClaimParams) {
    return storeKeys.getClaimKey(params.partnerId, params.periodId);
  }

  protected createValidationResult(params: ReviewClaimParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, true, null);
  }
}

import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { UploadClaimDocumentsCommand } from "@server/features/documents/uploadClaimDocuments";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { IFileWrapper } from "@framework/types/fileWapper";
import { configuration } from "@server/features/common/config";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { ReviewClaimParams, ReviewClaimRoute } from "@ui/containers/pages/claims/review/claimReview.page";

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

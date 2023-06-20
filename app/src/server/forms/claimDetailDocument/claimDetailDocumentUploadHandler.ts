import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { UploadClaimDetailDocumentCommand } from "../../features/documents/uploadClaimDetailDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "../formHandlerBase";
import { IFileWrapper } from "@framework/types/fileWapper";
import { configuration } from "@server/features/common/config";
import {
  ClaimDetailDocumentsPageParams,
  ClaimDetailDocumentsRoute,
} from "@ui/containers/claims/claimDetailDocuments.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

export class ClaimDetailDocumentUploadHandler extends MultipleFileFormHandlerBase<
  ClaimDetailDocumentsPageParams,
  "multipleDocuments"
> {
  constructor() {
    super(ClaimDetailDocumentsRoute, ["default"], "multipleDocuments");
  }

  protected async getDto(
    context: IContext,
    params: ClaimDetailDocumentsPageParams,
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
    params: ClaimDetailDocumentsPageParams,
    button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    const claimDetailKey = {
      projectId: params.projectId,
      partnerId: params.partnerId,
      periodId: params.periodId,
      costCategoryId: params.costCategoryId,
    };

    await context.runCommand(new UploadClaimDetailDocumentCommand(claimDetailKey, dto));

    return ClaimDetailDocumentsRoute.getLink(params);
  }

  protected getStoreKey(params: ClaimDetailDocumentsPageParams) {
    return storeKeys.getClaimDetailKey(params.partnerId, params.periodId, params.costCategoryId);
  }

  protected createValidationResult(params: ClaimDetailDocumentsPageParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, true, null);
  }
}

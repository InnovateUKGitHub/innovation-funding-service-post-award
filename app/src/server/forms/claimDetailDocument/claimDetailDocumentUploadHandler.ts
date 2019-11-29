import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "../formHandlerBase";
import { ClaimDetailDocumentsPageParams, ClaimDetailDocumentsRoute } from "../../../ui/containers";
import { UploadClaimDetailDocumentCommand } from "../../features/documents/uploadClaimDetailDocument";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { Configuration } from "@server/features/common";
import { getClaimDetailDocumentEditor } from "@ui/redux/selectors";

export class ClaimDetailDocumentUploadHandler extends MultipleFileFormHandlerBase<ClaimDetailDocumentsPageParams, "multipleDocuments"> {
  constructor() {
    super(ClaimDetailDocumentsRoute, ["default"], "multipleDocuments");
  }

  protected async getDto(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
    };
  }

  protected async run(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    const claimDetailKey = { projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId };

    await context.runCommand(new UploadClaimDetailDocumentCommand(claimDetailKey, dto));

    return ClaimDetailDocumentsRoute.getLink(params);
  }

  protected getStoreKey(params: ClaimDetailDocumentsPageParams) {
    return getClaimDetailDocumentEditor({ projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId }, Configuration).key;
  }

  protected createValidationResult(params: ClaimDetailDocumentsPageParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true, true);
  }
}

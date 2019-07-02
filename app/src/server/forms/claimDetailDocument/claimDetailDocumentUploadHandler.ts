import { getClaimDetailDocumentEditor } from "../../../ui/redux/selectors";
import { FormHandlerBase, IFormBody, IFormButton } from "../formHandlerBase";
import { ClaimDetailDocumentsPageParams, ClaimDetailDocumentsRoute } from "../../../ui/containers";
import { UploadClaimDetailDocumentCommand } from "../../features/documents/uploadClaimDetailDocument";
import { upload } from "../memoryStorage";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { DocumentUploadDtoValidator } from "@ui/validators";
import { Configuration } from "@server/features/common";

export class ClaimDetailDocumentUploadHandler extends FormHandlerBase<ClaimDetailDocumentsPageParams, DocumentUploadDto, DocumentUploadDtoValidator> {
    constructor() {
      super(ClaimDetailDocumentsRoute, ["default"], [upload.single("attachment")]);
    }

    protected async getDto(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, body: IFormBody, file: IFileWrapper): Promise<DocumentUploadDto> {
        return {
            file
        };
    }

    protected async run(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, dto: DocumentUploadDto): Promise<ILinkInfo> {
        const claimDetailKey = { projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId };

        await context.runCommand(new UploadClaimDetailDocumentCommand(claimDetailKey, dto));

        return ClaimDetailDocumentsRoute.getLink(params);
    }

    protected getStoreInfo(params: ClaimDetailDocumentsPageParams): { key: string, store: string } {
        return getClaimDetailDocumentEditor({ projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId }, Configuration.maxFileSize);
    }

    protected createValidationResult(params: ClaimDetailDocumentsPageParams, dto: DocumentUploadDto) {
        return new DocumentUploadDtoValidator(dto, Configuration.maxFileSize, true);
    }
}

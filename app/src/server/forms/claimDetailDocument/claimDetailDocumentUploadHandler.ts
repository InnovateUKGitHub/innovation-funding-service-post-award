import { getClaimDetailDocumentEditor } from "../../../ui/redux/selectors";
import { FormHandlerBase, IFormBody, IFormButton } from "../formHandlerBase";
import { Results } from "../../../ui/validation/results";
import { ClaimDetailDocumentsPageParams, ClaimDetailDocumentsRoute } from "../../../ui/containers";
import { FileUpload } from "../../../types/FileUpload";
import { UploadClaimDetailDocumentCommand } from "../../features/documents/uploadClaimDetailDocument";
import { upload } from "../memoryStorage";
import { ILinkInfo } from "../../../types/ILinkInfo";
import { IContext } from "../../../types/IContext";

export class ClaimDetailDocumentUploadHandler extends FormHandlerBase<ClaimDetailDocumentsPageParams, FileUpload> {
    constructor() {
      super(ClaimDetailDocumentsRoute, ["default"], [upload.single("attachment")]);
    }

    protected async getDto(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, body: IFormBody, file: FileUpload): Promise<FileUpload> {
        return file;
    }

    protected async run(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, dto: FileUpload): Promise<ILinkInfo> {
        const claimDetailKey = { projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId };

        await context.runCommand(new UploadClaimDetailDocumentCommand(claimDetailKey, dto));

        return ClaimDetailDocumentsRoute.getLink(params);
    }

    protected getStoreInfo(params: ClaimDetailDocumentsPageParams): { key: string, store: string } {
        return getClaimDetailDocumentEditor({ projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId });
    }

    protected createValidationResult(params: ClaimDetailDocumentsPageParams, dto: FileUpload): Results<FileUpload> {
        return new Results(dto, false);
    }
}

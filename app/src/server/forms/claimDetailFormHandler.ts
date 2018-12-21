import { getClaimDetailDocumentEditor, getClaimEditor } from "../../ui/redux/selectors";
import { FormHandlerBase } from "./formHandlerBase";
import { Results } from "../../ui/validation/results";
import { ClaimDetailDocumentsPageParams, ClaimDetailDocumentsRoute } from "../../ui/containers";
import { IContext } from "../features/common/context";
import { FileUpload } from "../../types/FileUpload";
import { UploadClaimDetailDocumentCommand } from "../features/documents/uploadClaimDetailDocument";

export class ClaimDetailFormHandler extends FormHandlerBase<ClaimDetailDocumentsPageParams, FileUpload> {
    constructor() {
        super(ClaimDetailDocumentsRoute);
    }

    protected async getDto(context: IContext, params: ClaimDetailDocumentsPageParams, button: string, body: { [key: string]: string }, file: FileUpload): Promise<FileUpload> {
        return file;
    }

    protected async run(context: IContext, params: ClaimDetailDocumentsPageParams, button: string, dto: FileUpload): Promise<ILinkInfo> {
        const claimDetailKey = { partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId };

        await context.runCommand(new UploadClaimDetailDocumentCommand(claimDetailKey, dto));

        return ClaimDetailDocumentsRoute.getLink(params);
    }

    protected getStoreInfo(params: ClaimDetailDocumentsPageParams): { key: string, store: string } {
        return getClaimDetailDocumentEditor({partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId });
    }

    protected createValidationResult(params: ClaimDetailDocumentsPageParams, dto: FileUpload): Results<FileUpload> {
        return new Results(dto, false);
    }
}

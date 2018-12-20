import { getClaimDetailDocumentEditor, getClaimEditor } from "../../ui/redux/selectors";
import { FormHandlerBase } from "./formHandlerBase";
import { Results } from "../../ui/validation/results";
import { ClaimDetailDocumentsRoute, ClaimDetailParams } from "../../ui/containers";
import { IContext } from "../features/common/context";
import { FileUpload } from "../../types/FileUpload";
import { UploadClaimDetailDocumentCommand } from "../features/documents/uploadClaimDetailDocument";

export class ClaimDetailFormHandler extends FormHandlerBase<ClaimDetailParams, FileUpload> {
    constructor() {
        super(ClaimDetailDocumentsRoute);
    }

    protected async getDto(context: IContext, params: ClaimDetailParams, button: string, body: { [key: string]: string }, file: any): Promise<FileUpload> {
        return file;
    }

    protected async run(context: IContext, params: ClaimDetailParams, button: string, dto: FileUpload): Promise<ILinkInfo> {
        const claimDetailKey = { partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId };

        await context.runCommand(new UploadClaimDetailDocumentCommand(claimDetailKey, dto));

        return ClaimDetailDocumentsRoute.getLink(params);
    }

    protected getStoreInfo(params: ClaimDetailParams): { key: string, store: string } {
        return getClaimDetailDocumentEditor({partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId });
    }

    protected createValidationResult(params: ClaimDetailParams, dto: FileUpload): Results<FileUpload> {
        return new Results(dto, false);
    }
}

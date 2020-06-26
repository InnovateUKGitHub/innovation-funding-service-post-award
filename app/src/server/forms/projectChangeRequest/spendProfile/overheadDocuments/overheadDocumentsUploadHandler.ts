import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { OverheadDocumentsPageParams, PCRSpendProfileOverheadDocumentRoute } from "@ui/containers";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import {UploadProjectChangeRequestDocumentOrItemDocumentCommand} from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import {MultipleDocumentUpdloadDtoValidator} from "@ui/validators";
import { Configuration } from "@server/features/common";

export class OverheadDocumentsUploadHandler extends MultipleFileFormHandlerBase<OverheadDocumentsPageParams, "multipleDocuments"> {
    constructor() {
        super(PCRSpendProfileOverheadDocumentRoute, ["uploadFile"], "multipleDocuments");
    }

    protected async getDto(context: IContext, params: OverheadDocumentsPageParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
        return {
            files,
            description: parseInt(body.description, 10)
        };
    }

    protected async run(context: IContext, params: OverheadDocumentsPageParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {

        await context.runCommand(new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.itemId, dto));

        return PCRSpendProfileOverheadDocumentRoute.getLink({
            projectId: params.projectId,
            pcrId: params.pcrId,
            costCategoryId: params.costCategoryId,
            itemId: params.itemId
        });
    }

    protected getStoreKey(params: OverheadDocumentsPageParams, dto: MultipleDocumentUploadDto): string {
        return storeKeys.getPcrKey(params.projectId, params.pcrId);
    }

    protected createValidationResult(params: OverheadDocumentsPageParams, dto: MultipleDocumentUploadDto) {
        return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true, true, null);
    }
}

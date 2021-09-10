import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { OverheadDocumentsPageParams, PCRSpendProfileOverheadDocumentRoute } from "@ui/containers";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import {UploadProjectChangeRequestDocumentOrItemDocumentCommand} from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import {MultipleDocumentUploadDtoValidator} from "@ui/validators";
import { configuration } from "@server/features/common";
import { IFileWrapper, ILinkInfo } from "@framework/types";

export class OverheadDocumentsUploadHandler extends MultipleFileFormHandlerBase<OverheadDocumentsPageParams, "multipleDocuments"> {
    constructor() {
        super(PCRSpendProfileOverheadDocumentRoute, ["uploadFile"], "multipleDocuments");
    }

    protected async getDto(context: IContext, params: OverheadDocumentsPageParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
        return {
            files,
            description: Number(body.description) || undefined
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

    protected getStoreKey(params: OverheadDocumentsPageParams): string {
        return storeKeys.getPcrKey(params.projectId, params.pcrId);
    }

    protected createValidationResult(params: OverheadDocumentsPageParams, dto: MultipleDocumentUploadDto) {
        return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, true, null);
    }
}

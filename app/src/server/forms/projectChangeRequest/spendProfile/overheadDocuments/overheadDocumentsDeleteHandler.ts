import {
    IFormBody,
    IFormButton,
    StandardFormHandlerBase
} from "@server/forms/formHandlerBase";
import { OverheadDocumentsPageParams, PCRSpendProfileOverheadDocumentRoute } from "@ui/containers";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import {MultipleDocumentUpdloadDtoValidator} from "@ui/validators";
import { Configuration } from "@server/features/common";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";

type Dto = MultipleDocumentUploadDto & {id: string};

export class OverheadDocumentsDeleteHandler extends StandardFormHandlerBase<OverheadDocumentsPageParams, "multipleDocuments"> {
    constructor() {
        super(PCRSpendProfileOverheadDocumentRoute, ["delete"], "multipleDocuments");
    }

    protected getDto(context: IContext, params: OverheadDocumentsPageParams, button: IFormButton, body: IFormBody): Promise<Dto> {
        return Promise.resolve({ id: button.value, files: [] });
    }

    protected async run(context: IContext, params: OverheadDocumentsPageParams, button: IFormButton, dto: Dto): Promise<ILinkInfo> {
        await context.runCommand(new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.itemId));

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
        return new MultipleDocumentUpdloadDtoValidator(dto, Configuration.options, false, false, null);
    }
}

import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { configuration } from "@server/features/common/config";
import {
  OverheadDocumentsPageParams,
  PCRSpendProfileOverheadDocumentRoute,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";

type Dto = MultipleDocumentUploadDto & { id: string };

export class OverheadDocumentsDeleteHandler extends StandardFormHandlerBase<
  OverheadDocumentsPageParams,
  "multipleDocuments"
> {
  constructor() {
    super(PCRSpendProfileOverheadDocumentRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: OverheadDocumentsPageParams, button: IFormButton): Promise<Dto> {
    return Promise.resolve({ id: button.value, files: [] });
  }

  protected async run(
    context: IContext,
    params: OverheadDocumentsPageParams,
    button: IFormButton,
    dto: Dto,
  ): Promise<ILinkInfo> {
    await context.runCommand(
      new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.itemId),
    );

    return PCRSpendProfileOverheadDocumentRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      costCategoryId: params.costCategoryId,
      itemId: params.itemId,
    });
  }

  protected getStoreKey(params: OverheadDocumentsPageParams): string {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected createValidationResult(params: OverheadDocumentsPageParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }
}

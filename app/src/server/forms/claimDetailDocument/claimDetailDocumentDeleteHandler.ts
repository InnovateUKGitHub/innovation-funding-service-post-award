import { IFormBody, IFormButton, StandardFormHandlerBase } from "../formHandlerBase";
import {
  ClaimDetailDocumentsPageParams,
  ClaimDetailDocumentsRoute
} from "../../../ui/containers";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { DeleteClaimDetailDocumentCommand } from "@server/features/documents/deleteClaimDetailDocument";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { Configuration } from "@server/features/common";
import { getClaimDetailDocumentDeleteEditorStoreInfo } from "@ui/redux/selectors";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ClaimDetailDocumentDeleteHandler extends StandardFormHandlerBase<ClaimDetailDocumentsPageParams, "multipleDocuments"> {

  constructor() {
    super(ClaimDetailDocumentsRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, body: IFormBody) {
    return Promise.resolve({ id: button.value, files: [] });
  }
  protected createValidationResult(params: ClaimDetailDocumentsPageParams, dto: Document) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, false, false);
  }

  protected getStoreKey(params: ClaimDetailDocumentsPageParams) {
    return getClaimDetailDocumentDeleteEditorStoreInfo({ projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId }, []).key;
  }

  protected async run(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteClaimDetailDocumentCommand(dto.id, params);
    await context.runCommand(command);
    return ClaimDetailDocumentsRoute.getLink(params);
  }
}

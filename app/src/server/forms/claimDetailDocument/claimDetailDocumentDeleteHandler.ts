import { FormHandlerBase, IFormBody, IFormButton } from "../formHandlerBase";
import {
  ClaimDetailDocumentsPageParams,
  ClaimDetailDocumentsRoute
} from "../../../ui/containers";
import {
  getClaimDetailDocumentDeleteEditorStoreInfo
} from "../../../ui/redux/selectors";
import { DeleteDocumentCommand } from "../../features/documents/deleteDocument";
import { Results } from "../../../ui/validation/results";
import { ILinkInfo } from "../../../types/ILinkInfo";
import { IContext } from "../../../types/IContext";

interface Document {
  id: string;
}

export class ClaimDetailDocumentDeleteHandler extends FormHandlerBase<ClaimDetailDocumentsPageParams, Document> {

  constructor() {
    super(ClaimDetailDocumentsRoute, ["delete"]);
  }

  protected getDto(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, body: IFormBody) {
    return Promise.resolve({ id: button.value });
  }
  protected createValidationResult(params: ClaimDetailDocumentsPageParams, dto: Document) {
    return new Results(dto, false);
  }

  protected getStoreInfo(params: ClaimDetailDocumentsPageParams): { key: string; store: string; } {
    return getClaimDetailDocumentDeleteEditorStoreInfo({ partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId }, []);
  }

  protected async run(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteDocumentCommand(dto.id);
    await context.runCommand(command);
    return ClaimDetailDocumentsRoute.getLink(params);
  }
}

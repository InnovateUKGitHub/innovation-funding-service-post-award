import { IFormBody, IFormButton, StandardFormHandlerBase } from "../formHandlerBase";
import {
  ClaimDetailDocumentsPageParams,
  ClaimDetailDocumentsRoute
} from "../../../ui/containers";
import {
  getClaimDetailDocumentDeleteEditorStoreInfo
} from "../../../ui/redux/selectors";
import { Results } from "../../../ui/validation/results";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { DeleteClaimDetailDocumentCommand } from "@server/features/documents/deleteClaimDetailDocument";

interface Document {
  id: string;
}

export class ClaimDetailDocumentDeleteHandler extends StandardFormHandlerBase<ClaimDetailDocumentsPageParams, Document, Results<{}>> {

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
    return getClaimDetailDocumentDeleteEditorStoreInfo({ projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId }, []);
  }

  protected async run(context: IContext, params: ClaimDetailDocumentsPageParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteClaimDetailDocumentCommand(dto.id, params);
    await context.runCommand(command);
    return ClaimDetailDocumentsRoute.getLink(params);
  }
}

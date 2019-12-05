import { IFormBody, IFormButton, StandardFormHandlerBase } from "../formHandlerBase";
import { ClaimDocumentsPageParams, ClaimDocumentsRoute } from "../../../ui/containers";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Configuration } from "@server/features/common";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { getClaimDocumentsKey } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ClaimDocumentsDeleteHandler extends StandardFormHandlerBase<ClaimDocumentsPageParams, "multipleDocuments"> {

  constructor() {
    super(ClaimDocumentsRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ClaimDocumentsPageParams, button: IFormButton, body: IFormBody) {
    return Promise.resolve({ id: button.value, files: [] });
  }
  protected createValidationResult(params: ClaimDocumentsPageParams, dto: Document) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, false, false);
  }

  protected getStoreKey(params: ClaimDocumentsPageParams) {
    return getClaimDocumentsKey(params.partnerId, params.periodId);
  }

  protected async run(context: IContext, params: ClaimDocumentsPageParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteClaimDocumentCommand(dto.id, params);
    await context.runCommand(command);
    return ClaimDocumentsRoute.getLink(params);
  }
}

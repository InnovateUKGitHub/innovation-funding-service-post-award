import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFormButton, StandardFormHandlerBase } from "../formHandlerBase";
import { configuration } from "@server/features/common/config";
import { ClaimDocumentsPageParams, ClaimDocumentsRoute } from "@ui/containers/claims/claimDocuments.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ClaimDocumentsDeleteHandler extends StandardFormHandlerBase<
  ClaimDocumentsPageParams,
  "multipleDocuments"
> {
  constructor() {
    super(ClaimDocumentsRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ClaimDocumentsPageParams, button: IFormButton) {
    return Promise.resolve({ id: button.value, files: [] });
  }
  protected createValidationResult(params: ClaimDocumentsPageParams, dto: Document) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }

  protected getStoreKey(params: ClaimDocumentsPageParams) {
    return storeKeys.getClaimKey(params.partnerId, params.periodId);
  }

  protected async run(
    context: IContext,
    params: ClaimDocumentsPageParams,
    button: IFormButton,
    dto: Document,
  ): Promise<ILinkInfo> {
    const command = new DeleteClaimDocumentCommand(dto.id, params);
    await context.runCommand(command);
    return ClaimDocumentsRoute.getLink(params);
  }
}

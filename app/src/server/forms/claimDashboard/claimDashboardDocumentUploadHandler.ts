import { getClaimDocumentEditor } from "../../../ui/redux/selectors";
import { FormHandlerBase, IFormBody, IFormButton } from "../formHandlerBase";
import { Results } from "../../../ui/validation/results";
import { ClaimDashboardPageParams, ClaimsDashboardRoute } from "../../../ui/containers";
import { IContext } from "../../features/common/context";
import { FileUpload } from "../../../types/FileUpload";
import { UploadClaimDocumentCommand } from "../../features/documents/uploadClaimDocument";
import { DocumentDescription } from "../../../types/constants";
import { FileUploadValidator } from "../../../ui/validators/documentUploadValidator";
import { upload } from "../memoryStorage";
import { ILinkInfo } from "../../../types/ILinkInfo";

interface Data {
  file: FileUpload;
  periodId: number;
}

export class ClaimDashboardDocumentUploadHandler extends FormHandlerBase<ClaimDashboardPageParams, Data, FileUpload> {

  constructor() {
    super(ClaimsDashboardRoute, ["upload"], [upload.single("attachment")]);
  }

  protected async getDto(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, body: IFormBody, file: FileUpload): Promise<Data> {
    return {
      file: { ...file, description: body.description as DocumentDescription },
      periodId: parseInt(body.periodId, 10)
    };
  }

  protected async run(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, dto: Data): Promise<ILinkInfo> {
    const claimKey = { partnerId: params.partnerId, periodId: dto.periodId };
    await context.runCommand(new UploadClaimDocumentCommand(claimKey, dto.file));

    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreInfo(params: ClaimDashboardPageParams, dto: Data): { key: string, store: string } {
    const claimKey = { partnerId: params.partnerId, periodId: dto.periodId };
    const file = dto.file || {};
    return getClaimDocumentEditor(claimKey, file.description);
  }

  protected createValidationResult(params: ClaimDashboardPageParams, dto: Data): Results<FileUpload> {
    return new FileUploadValidator(dto.file, false);
  }
}

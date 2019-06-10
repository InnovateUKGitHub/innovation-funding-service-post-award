import { getClaimDocumentEditor } from "@ui/redux/selectors";
import { UploadClaimDocumentCommand } from "@server/features/documents/uploadClaimDocument";
import { Results } from "@ui/validation/results";
import { AllClaimsDashboardParams, AllClaimsDashboardRoute } from "@ui/containers";
import { FileUploadValidator } from "@ui/validators/documentUploadValidator";
import { DocumentDescription } from "@framework/constants";
import { FileUpload, IContext, ILinkInfo } from "@framework/types";
import { FormHandlerBase, IFormBody, IFormButton } from "../formHandlerBase";
import { upload } from "../memoryStorage";

interface Data {
  file: FileUpload;
  partnerId: string;
  periodId: number;
}

export class AllClaimDashboardDocumentUploadHandler extends FormHandlerBase<AllClaimsDashboardParams, Data, FileUpload> {
  constructor() {
    super(AllClaimsDashboardRoute, ["upload"], [upload.single("attachment")]);
  }

  protected async getDto(context: IContext, params: AllClaimsDashboardParams, button: IFormButton, body: IFormBody, file: FileUpload): Promise<Data> {
    return {
      file: { ...file, description: body.description as DocumentDescription },
      partnerId: body.partnerId,
      periodId: parseInt(body.periodId, 10)
    };
  }

  protected async run(context: IContext, params: AllClaimsDashboardParams, button: IFormButton, dto: Data): Promise<ILinkInfo> {
    const claimKey = this.createClaimKey(params, dto);
    await context.runCommand(new UploadClaimDocumentCommand(claimKey, dto.file));

    return AllClaimsDashboardRoute.getLink(params);
  }

  protected getStoreInfo(params: AllClaimsDashboardParams, dto: Data): { key: string, store: string } {
    const claimKey = this.createClaimKey(params, dto);
    const file = dto.file || {};
    return getClaimDocumentEditor(claimKey, file.description);
  }

  protected createValidationResult(params: AllClaimsDashboardParams, dto: Data): Results<FileUpload> {
    return new FileUploadValidator(dto.file, false);
  }

  private createClaimKey(params: AllClaimsDashboardParams, dto: Data) {
    return {
      projectId: params.projectId,
      partnerId: dto.partnerId,
      periodId: dto.periodId
    };
  }
}

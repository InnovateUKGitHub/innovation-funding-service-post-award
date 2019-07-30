import { getClaimDocumentEditor } from "@ui/redux/selectors";
import { UploadClaimDocumentCommand } from "@server/features/documents/uploadClaimDocument";
import { AllClaimsDashboardParams, AllClaimsDashboardRoute } from "@ui/containers";
import { DocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { IContext, ILinkInfo } from "@framework/types";
import { IFormBody, IFormButton, SingleFileFormHandlerBase } from "../formHandlerBase";
import { upload } from "../memoryStorage";
import { Configuration } from "@server/features/common";

interface Data extends DocumentUploadDto {
  partnerId: string;
  periodId: number;
}

export class AllClaimDashboardDocumentUploadHandler extends SingleFileFormHandlerBase<AllClaimsDashboardParams, Data, DocumentUploadDtoValidator> {
  constructor() {
    super(AllClaimsDashboardRoute, ["upload"]);
  }

  protected async getDto(context: IContext, params: AllClaimsDashboardParams, button: IFormButton, body: IFormBody, file: IFileWrapper): Promise<Data> {
    return {
      file,
      description: body.description,
      partnerId: body.partnerId,
      periodId: parseInt(body.periodId, 10)
    };
  }

  protected async run(context: IContext, params: AllClaimsDashboardParams, button: IFormButton, dto: Data): Promise<ILinkInfo> {
    const claimKey = this.createClaimKey(params, dto);
    await context.runCommand(new UploadClaimDocumentCommand(claimKey, dto));

    return AllClaimsDashboardRoute.getLink(params);
  }

  protected getStoreInfo(params: AllClaimsDashboardParams, dto: Data): { key: string, store: string } {
    const claimKey = this.createClaimKey(params, dto);
    return getClaimDocumentEditor(claimKey, Configuration.maxFileSize);
  }

  protected createValidationResult(params: AllClaimsDashboardParams, dto: Data) {
    return new DocumentUploadDtoValidator(dto, Configuration.maxFileSize, false);
  }

  private createClaimKey(params: AllClaimsDashboardParams, dto: Data) {
    return {
      projectId: params.projectId,
      partnerId: dto.partnerId,
      periodId: dto.periodId
    };
  }
}

import { getClaimDocumentEditor } from "../../../ui/redux/selectors";
import { IFormBody, IFormButton, SingleFileFormHandlerBase } from "../formHandlerBase";
import { ClaimDashboardPageParams, ClaimsDashboardRoute } from "../../../ui/containers";
import { UploadClaimDocumentCommand } from "../../features/documents/uploadClaimDocument";
import { upload } from "../memoryStorage";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { Configuration } from "@server/features/common";
import { DocumentUploadDtoValidator } from "@ui/validators";

interface Data extends DocumentUploadDto {
  periodId: number;
}

export class ClaimDashboardDocumentUploadHandler extends SingleFileFormHandlerBase<ClaimDashboardPageParams, DocumentUploadDto, DocumentUploadDtoValidator> {

  constructor() {
    super(ClaimsDashboardRoute, ["upload"]);
  }

  protected async getDto(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, body: IFormBody, file: IFileWrapper): Promise<Data> {
    return {
      file,
      description: body.description,
      periodId: parseInt(body.periodId, 10)
    };
  }

  protected async run(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, dto: Data): Promise<ILinkInfo> {
    const claimKey = { projectId: params.projectId, partnerId: params.partnerId, periodId: dto.periodId };
    await context.runCommand(new UploadClaimDocumentCommand(claimKey, dto));

    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreInfo(params: ClaimDashboardPageParams, dto: Data): { key: string, store: string } {
    const claimKey = { projectId: params.projectId, partnerId: params.partnerId, periodId: dto.periodId };
    return getClaimDocumentEditor(claimKey, Configuration.maxFileSize);
  }

  protected createValidationResult(params: ClaimDashboardPageParams, dto: Data) {
    return new DocumentUploadDtoValidator(dto, Configuration.maxFileSize, false);
  }
}

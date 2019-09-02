import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";
import { BadRequestError } from "@server/features/common";
import { AllClaimsDashboardParams, AllClaimsDashboardRoute } from "@ui/containers";
import { getDocumentDeleteEditor } from "@ui/redux/selectors";
import { Results } from "@ui/validation";
import { IContext, ILinkInfo } from "@framework/types";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "../formHandlerBase";

interface Data extends DocumentSummaryDto {
  partnerId: string;
  periodId: number;
}

export class AllClaimDashboardDocumentDeleteHandler extends StandardFormHandlerBase<AllClaimsDashboardParams, Data, Results<{}>> {

  constructor() {
    super(AllClaimsDashboardRoute, ["delete"]);
  }

  protected async getDto(context: IContext, params: AllClaimsDashboardParams, button: IFormButton, body: IFormBody) {
    const periodId = parseInt(body.periodId, 10);
    const partnerId = body.partnerId;
    const claimKey = {
      projectId: params.projectId,
      partnerId,
      periodId
    };
    const query = new GetClaimDocumentsQuery(claimKey);
    const documentSummary = await context.runQuery(query).then(x => x && x.find(y => y.id === button.value));

    if (!documentSummary) throw new BadRequestError("Document does not exist");

    return { ...documentSummary, partnerId, periodId };
  }

  protected createValidationResult(params: AllClaimsDashboardParams, dto: Data) {
    return new Results(dto, false);
  }

  protected getStoreInfo(params: AllClaimsDashboardParams, dto: Data): { key: string; store: string; } {
    return getDocumentDeleteEditor(dto);
  }

  protected async run(context: IContext, params: AllClaimsDashboardParams, button: IFormButton, dto: Data): Promise<ILinkInfo> {
    const claimKey = {
      projectId: params.projectId,
      partnerId: dto.partnerId,
      periodId: dto.periodId
    };
    const command = new DeleteClaimDocumentCommand(dto.id, claimKey);
    await context.runCommand(command);
    return AllClaimsDashboardRoute.getLink(params);
  }
}

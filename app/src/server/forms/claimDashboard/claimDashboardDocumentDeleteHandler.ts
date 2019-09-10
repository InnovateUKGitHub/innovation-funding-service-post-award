import { IContext, ILinkInfo } from "@framework/types";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";
import { ClaimDashboardPageParams, ClaimsDashboardRoute } from "@ui/containers";
import { BadRequestError } from "@server/features/common";
import { getDocumentDeleteEditor } from "@ui/redux/selectors";
import { Result, Results } from "@ui/validation";

import { IFormBody, IFormButton, StandardFormHandlerBase } from "../formHandlerBase";

interface DocumentWithPeriodId extends DocumentSummaryDto {
  periodId: number;
}

export class ClaimDashboardDocumentDeleteHandler extends StandardFormHandlerBase<ClaimDashboardPageParams, DocumentWithPeriodId, Results<{}>> {

  constructor() {
    super(ClaimsDashboardRoute, ["delete"]);
  }

  protected async getDto(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, body: IFormBody) {
    // @TODO: should this come from a query rather than the form?
    const periodId = parseInt(body.periodId, 10);

    const query = new GetClaimDocumentsQuery({ projectId: params.projectId, partnerId: params.partnerId, periodId });
    const documentSummary = await context.runQuery(query).then(x => x && x.find(y => y.id === button.value));

    if (!documentSummary) throw new BadRequestError("Document does not exist");

    return {...documentSummary, periodId};
  }

  protected createValidationResult(params: ClaimDashboardPageParams, dto: DocumentWithPeriodId) {
    return new Results(dto, false);
  }

  protected getStoreInfo(params: ClaimDashboardPageParams, dto: DocumentWithPeriodId): { key: string; store: string; } {
    return getDocumentDeleteEditor(dto);
  }

  protected async run(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, dto: DocumentWithPeriodId): Promise<ILinkInfo> {
    const command = new DeleteClaimDocumentCommand(dto.id, { projectId: params.projectId, partnerId: params.partnerId, periodId: dto.periodId });
    await context.runCommand(command);
    return ClaimsDashboardRoute.getLink(params);
  }
}

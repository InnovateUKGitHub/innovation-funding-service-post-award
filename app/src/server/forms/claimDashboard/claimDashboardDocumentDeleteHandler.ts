import { FormHandlerBase, IFormBody, IFormButton } from "../formHandlerBase";
import {
  ClaimDashboardPageParams,
  ClaimsDashboardRoute
} from "../../../ui/containers";
import {
  getDocumentDeleteEditor
} from "../../../ui/redux/selectors";
import { Results } from "../../../ui/validation/results";
import { GetDocumentsSummaryQuery } from "../../features/documents/getDocumentsSummary";
import { BadRequestError } from "../../features/common/appError";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";

interface DocumentWithPeriodId {
  documentSummary: DocumentSummaryDto;
  periodId: number;
}
export class ClaimDashboardDocumentDeleteHandler extends FormHandlerBase<ClaimDashboardPageParams, DocumentWithPeriodId> {

  constructor() {
    super(ClaimsDashboardRoute, ["delete"]);
  }

  protected async getDto(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, body: IFormBody) {
    const periodId = parseInt(body.periodId, 10);
    const dto = await context.runQuery(new GetDocumentsSummaryQuery([button.value]));
    if (!dto || !dto[0]) throw new BadRequestError("Document does not exist");
    return {
      documentSummary: dto[0],
      periodId
    };
  }

  protected createValidationResult(params: ClaimDashboardPageParams, dto: DocumentWithPeriodId) {
    return new Results(dto.documentSummary, false);
  }

  protected getStoreInfo(params: ClaimDashboardPageParams, dto: DocumentWithPeriodId): { key: string; store: string; } {
    return getDocumentDeleteEditor(dto.documentSummary);
  }

  protected async run(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, dto: DocumentWithPeriodId): Promise<ILinkInfo> {
    const command = new DeleteClaimDocumentCommand(dto.documentSummary.id, {projectId: params.projectId, partnerId: params.partnerId, periodId: dto.periodId}  );
    await context.runCommand(command);
    return ClaimsDashboardRoute.getLink(params);
  }
}

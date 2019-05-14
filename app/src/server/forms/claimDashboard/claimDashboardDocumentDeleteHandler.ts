import { FormHandlerBase, IFormBody, IFormButton } from "../formHandlerBase";
import {
  ClaimDashboardPageParams,
  ClaimsDashboardRoute
} from "../../../ui/containers";
import {
  getDocumentDeleteEditor
} from "../../../ui/redux/selectors";
import { DeleteDocumentCommand } from "../../features/documents/deleteDocument";
import { Results } from "../../../ui/validation/results";
import { GetDocumentsSummaryQuery } from "../../features/documents/getDocumentsSummary";
import { BadRequestError } from "../../features/common/appError";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";

export class ClaimDashboardDocumentDeleteHandler extends FormHandlerBase<ClaimDashboardPageParams, DocumentSummaryDto> {

  constructor() {
    super(ClaimsDashboardRoute, ["delete"]);
  }

  protected async getDto(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, body: IFormBody) {
    const dto = await context.runQuery(new GetDocumentsSummaryQuery([button.value]));
    if (!dto || !dto[0]) throw new BadRequestError("Document does not exist");
    return dto[0];
  }

  protected createValidationResult(params: ClaimDashboardPageParams, dto: DocumentSummaryDto) {
    return new Results(dto, false);
  }

  protected getStoreInfo(params: ClaimDashboardPageParams, dto: DocumentSummaryDto): { key: string; store: string; } {
    return getDocumentDeleteEditor(dto);
  }

  protected async run(context: IContext, params: ClaimDashboardPageParams, button: IFormButton, dto: DocumentSummaryDto): Promise<ILinkInfo> {
    const command = new DeleteDocumentCommand(dto.id);
    await context.runCommand(command);
    return ClaimsDashboardRoute.getLink(params);
  }
}

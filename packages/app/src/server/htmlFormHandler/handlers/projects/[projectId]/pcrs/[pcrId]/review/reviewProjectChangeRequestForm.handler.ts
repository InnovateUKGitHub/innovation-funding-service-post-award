import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { PCRReviewParams, PCRReviewRoute } from "@ui/pages/pcrs/pcrReview";
import { pcrReviewErrorMap, PcrReviewSchema, pcrReviewSchema } from "@ui/pages/pcrs/pcrReview.zod";
import { PCRsDashboardRoute } from "@ui/pages/pcrs/dashboard/PCRDashboard.page";
import { PCRStatus } from "@framework/constants/pcrConstants";

export class ProjectChangeRequestReviewFormHandler extends ZodFormHandlerBase<PcrReviewSchema, PCRReviewParams> {
  constructor() {
    super({
      routes: [PCRReviewRoute],
      forms: [FormTypes.PcrReview],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrReviewSchema,
      errorMap: pcrReviewErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PcrReviewSchema>> {
    return {
      form: input.form,
      status: input.status,
      comments: input.comments,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<PcrReviewSchema>;
    context: IContext;
    params: PCRReviewParams;
  }): Promise<string> {
    const pcr = await context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
    pcr.comments = input.comments;
    pcr.status = parseInt(input.status, 10) || PCRStatus.Unknown;

    await context.runCommand(
      new UpdatePCRCommand({ projectId: params.projectId, projectChangeRequestId: params.pcrId, pcr }),
    );
    return PCRsDashboardRoute.getLink({ projectId: params.projectId }).path;
  }
}

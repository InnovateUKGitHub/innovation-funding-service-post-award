import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRItemForMultiplePartnerFinancialVirementDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  FinancialVirementsSummaryValidatorSchema,
  financialVirementsSummaryErrorMap,
  getFinancialVirementsSummaryValidator,
} from "@ui/containers/pages/pcrs/financialVirements/summary/FinancialVirementsSummary.zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemFinancialVirementsSummaryUpdate extends ZodFormHandlerBase<
  FinancialVirementsSummaryValidatorSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      route: PCRPrepareItemRoute,
      forms: [FormTypes.PcrFinancialVirementsSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({
    input,
    context,
  }: {
    input: z.input<FinancialVirementsSummaryValidatorSchema>;
    context: IContext;
  }) {
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));
    const financialVirementsForParticipantsPromise = await context.repositories.financialVirements.getAllForPcr(
      input.pcrItemId as PcrItemId,
    );

    const [partners, financialVirementsForParticipants] = await Promise.all([
      partnersPromise,
      financialVirementsForParticipantsPromise,
    ]);

    return {
      schema: getFinancialVirementsSummaryValidator({
        partners,
        financialVirementsForCosts: financialVirementsForParticipants.flatMap(x => x.virements),
        financialVirementsForParticipants,
        pcrItemId: input.pcrItemId as PcrItemId,
      }),
      errorMap: financialVirementsSummaryErrorMap,
    };
  }

  protected async mapToZod({
    input,
  }: {
    input: AnyObject;
  }): Promise<z.input<FinancialVirementsSummaryValidatorSchema>> {
    return {
      form: FormTypes.PcrFinancialVirementsSummary,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      grantMovingOverFinancialYear: input.grantMovingOverFinancialYear,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<FinancialVirementsSummaryValidatorSchema>;
    context: IContext;
  }): Promise<string> {
    const pcrItem = {
      id: input.pcrItemId,
      grantMovingOverFinancialYear: input.grantMovingOverFinancialYear
        ? parseFloat(input.grantMovingOverFinancialYear)
        : undefined,
      status: input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
    } as Pick<PCRItemForMultiplePartnerFinancialVirementDto, "id" | "grantMovingOverFinancialYear" | "status" | "type">;

    await context.runCommand(
      new UpdatePCRCommand({
        projectId: input.projectId,
        projectChangeRequestId: input.pcrId,
        pcr: {
          projectId: input.projectId,
          id: input.pcrId,
          items: [pcrItem],
        },
      }),
    );

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
    }).path;
  }
}

export { ProjectChangeRequestItemFinancialVirementsSummaryUpdate };

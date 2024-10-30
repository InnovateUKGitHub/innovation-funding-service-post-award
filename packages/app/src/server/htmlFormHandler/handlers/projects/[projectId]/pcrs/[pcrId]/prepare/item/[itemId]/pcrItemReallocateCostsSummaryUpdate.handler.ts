import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRItemForMultiplePartnerFinancialVirementDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  ReallocateCostsSummaryValidatorSchema,
  reallocateCostsSummaryErrorMap,
  getReallocateCostsSummaryValidator,
} from "@ui/pages/pcrs/reallocateCosts/summary/ReallocateCostsSummary.zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemReallocateCostsSummaryUpdate extends ZodFormHandlerBase<
  ReallocateCostsSummaryValidatorSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrReallocateCostsSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({
    input,
    context,
  }: {
    input: z.input<ReallocateCostsSummaryValidatorSchema>;
    context: IContext;
  }) {
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));
    const financialVirementsForParticipantsPromise = await context.repositories.financialVirements.getAllForPcr(
      input.pcrItemId as PcrItemId,
    );
    const projectChangeRequestPromise = context.runQuery(
      new GetPCRByIdQuery(input.projectId as ProjectId, input.pcrId as PcrId),
    );

    const [partners, financialVirementsForParticipants, pcr] = await Promise.all([
      partnersPromise,
      financialVirementsForParticipantsPromise,
      projectChangeRequestPromise,
    ]);

    const pcrItem = pcr.items.find(x => x.id === input.pcrItemId);

    if (!pcrItem) throw new Error("cannae find pcr item");

    return {
      schema: getReallocateCostsSummaryValidator({
        mapFinancialVirementProps: {
          partners,
          financialVirementsForCosts: financialVirementsForParticipants.flatMap(x => x.virements),
          financialVirementsForParticipants,
          pcrItemId: input.pcrItemId as PcrItemId,
        },
      }),
      errorMap: reallocateCostsSummaryErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ReallocateCostsSummaryValidatorSchema>> {
    return {
      form: FormTypes.PcrReallocateCostsSummary,
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
    input: z.output<ReallocateCostsSummaryValidatorSchema>;
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

export { ProjectChangeRequestItemReallocateCostsSummaryUpdate };

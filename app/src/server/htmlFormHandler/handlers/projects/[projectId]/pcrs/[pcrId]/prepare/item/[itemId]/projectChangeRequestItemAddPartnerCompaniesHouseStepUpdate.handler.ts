import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PcrAddPartnerCompaniesHouseStepSchemaType,
  getPcrAddPartnerCompaniesHouseStepSchema,
  pcrAddPartnerCompaniesHouseStepErrorMap,
} from "@ui/containers/pages/pcrs/addPartner/steps/schemas/companiesHouse.zod";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemAddPartnerCompaniesHouseStepUpdateHandler extends ZodFormHandlerBase<
  PcrAddPartnerCompaniesHouseStepSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      route: PCRPrepareItemRoute,
      forms: [
        FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue,
        FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit,
      ],
    });
  }

  public readonly acceptFiles = false;

  private async getItem({
    context,
    projectId,
    pcrId,
    pcrItemId,
  }: {
    context: IContext;
    projectId: ProjectId;
    pcrId: PcrId;
    pcrItemId: PcrItemId;
  }) {
    const pcr = await context.runQuery(new GetPCRByIdQuery(projectId, pcrId));
    const item = pcr.items.find(x => x.id === pcrItemId);
    if (!item) throw new Error("Cannot find PCR item ID");
    return item as PCRItemForPartnerAdditionDto;
  }

  protected async getZodSchema({
    context,
    input,
  }: {
    context: IContext;
    input: z.input<PcrAddPartnerCompaniesHouseStepSchemaType>;
  }) {
    const item = await this.getItem({
      context,
      projectId: input.projectId as ProjectId,
      pcrId: input.pcrId as PcrId,
      pcrItemId: input.pcrItemId as PcrItemId,
    });

    return {
      schema: getPcrAddPartnerCompaniesHouseStepSchema(item?.status === PCRItemStatus.Complete),
      errorMap: pcrAddPartnerCompaniesHouseStepErrorMap,
    };
  }

  protected async mapToZod({
    input,
  }: {
    input: AnyObject;
  }): Promise<z.input<PcrAddPartnerCompaniesHouseStepSchemaType>> {
    return {
      form: input.form,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      organisationName: input.organisationName,
      registeredAddress: input.registeredAddress,
      registrationNumber: input.registrationNumber,
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<PcrAddPartnerCompaniesHouseStepSchemaType>;
    context: IContext;
  }): Promise<string> {
    const item = await this.getItem({
      context,
      projectId: input.projectId as ProjectId,
      pcrId: input.pcrId as PcrId,
      pcrItemId: input.pcrItemId as PcrItemId,
    });

    await context.runCommand(
      new UpdatePCRCommand({
        projectId: input.projectId,
        projectChangeRequestId: input.pcrId,
        pcr: {
          projectId: input.projectId,
          id: input.pcrId,
          items: [
            {
              id: input.pcrItemId,
              organisationName: input.organisationName,
              registeredAddress: input.registeredAddress,
              registrationNumber: input.registrationNumber,
            },
          ],
        },
      }),
    );

    const summaryWorkflow = PcrWorkflow.getWorkflow(item, undefined);
    const companiesHouseStep = summaryWorkflow?.findStepNumberByName(PCRStepType.companiesHouseStep);
    const companiesHouseStepWorkflow = PcrWorkflow.getWorkflow(item, companiesHouseStep);
    const nextInfo = companiesHouseStepWorkflow?.getNextStepInfo();

    if (!nextInfo) throw new Error("Cannot find next workflow step to navigate to");

    return PCRPrepareItemRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
      itemId: input.pcrItemId,
      step: input.form === FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue ? nextInfo.stepNumber : undefined,
    }).path;
  }
}

export { ProjectChangeRequestItemAddPartnerCompaniesHouseStepUpdateHandler };

import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
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
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { getNextAddPartnerStep, updatePcrItem } from "./addPartnerUtils";

class ProjectChangeRequestItemAddPartnerCompaniesHouseStepUpdateHandler extends ZodFormHandlerBase<
  PcrAddPartnerCompaniesHouseStepSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
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
    params,
  }: {
    input: z.output<PcrAddPartnerCompaniesHouseStepSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams & { step?: number };
  }): Promise<string> {
    await updatePcrItem({
      params,
      context,
      data: {
        organisationName: input.organisationName,
        registeredAddress: input.registeredAddress,
        registrationNumber: input.registrationNumber,
      },
    });

    return await getNextAddPartnerStep({
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      context,
      toSummary: input.form === FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit,
      stepNumber: params.step,
    });
  }
}

export { ProjectChangeRequestItemAddPartnerCompaniesHouseStepUpdateHandler };

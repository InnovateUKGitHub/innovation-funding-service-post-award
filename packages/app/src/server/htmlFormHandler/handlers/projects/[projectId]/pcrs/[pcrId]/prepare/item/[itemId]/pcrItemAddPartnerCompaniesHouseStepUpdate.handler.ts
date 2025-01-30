import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PcrAddPartnerCompaniesHouseStepSchemaType,
  getPcrAddPartnerCompaniesHouseStepSchema,
  pcrAddPartnerCompaniesHouseStepErrorMap,
} from "@ui/pages/pcrs/addPartner/steps/schemas/companiesHouse.zod";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

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

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getPcrAddPartnerCompaniesHouseStepSchema(input.markedAsComplete === "on"),
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
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_OrganisationName__c: input.organisationName,
      Acc_RegistrationNumber__c: input.registrationNumber,
      Acc_RegisteredAddress__c: input.registeredAddress,
    });

    return await getNextAddPartnerStep({
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
      context,
      toSummary: input.form === FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit,
      stepNumber: params.step,
    });
  }
}

export { ProjectChangeRequestItemAddPartnerCompaniesHouseStepUpdateHandler };

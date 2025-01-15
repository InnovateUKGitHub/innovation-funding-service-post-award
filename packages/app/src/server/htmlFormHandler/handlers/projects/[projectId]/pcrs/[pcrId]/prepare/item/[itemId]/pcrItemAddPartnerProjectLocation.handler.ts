import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import {
  ProjectLocationSchemaType,
  getProjectLocationSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/projectLocation.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRProjectLocationMapper } from "@framework/mappers/projectLocation";

export class PcrItemAddPartnerProjectLocationHandler extends ZodFormHandlerBase<
  ProjectLocationSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerProjectLocationStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getProjectLocationSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ProjectLocationSchemaType>> {
    return {
      form: input.form,
      markedAsComplete: input.markedAsComplete === "true",
      button_submit: input.button_submit,
      projectLocation: input.projectLocation,
      projectCity: input.projectCity,
      projectPostcode: input.projectPostcode,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ProjectLocationSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_ProjectPostcode__c: input.projectPostcode,
      Acc_ProjectCity__c: input.projectCity,
      Acc_Location__c: new PCRProjectLocationMapper().mapToSalesforcePCRProjectLocation(input.projectLocation),
    });

    return await getNextAddPartnerStep({
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
      context,
      toSummary: input.button_submit === "returnToSummary",
      stepNumber: params.step,
    });
  }
}

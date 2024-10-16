import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import express from "express";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  AcademicOrganisationSearchSchemaType,
  academicOrganisationSearchSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/academicOrganisation.zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { GetJesAccountsByNameQuery } from "@server/features/accounts/GetJesAccountsByNameQuery";
import { AccountDto } from "@framework/dtos/accountDto";

export class PcrItemAddPartnerAcademicOrganisationSearchStepHandler extends ZodFormHandlerBase<
  AcademicOrganisationSearchSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerAcademicOrganisationSearchStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: academicOrganisationSearchSchema,
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<AcademicOrganisationSearchSchemaType>> {
    return {
      form: input.form,
      searchJesOrganisations: input.searchJesOrganisations,
    };
  }

  protected async run({
    input,
    context,
    res,
  }: {
    input: z.output<AcademicOrganisationSearchSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams & { step?: number };
    res: express.Response;
  }) {
    let jesSearchResults: AccountDto[] = [];

    if (!!input.searchJesOrganisations) {
      jesSearchResults = await new GetJesAccountsByNameQuery(input.searchJesOrganisations).execute(context);
    }

    res.locals.preloadedData = { jesSearchResults };
  }
}

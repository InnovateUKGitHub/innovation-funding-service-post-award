import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";

import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { isNil } from "lodash";

import { makeZodI18nMap } from "@shared/zodi18n";

const filesSchema = z.object({
  form: z.union([
    z.literal(FormTypes.PcrRenamePartnerFilesStep),
    z.literal(FormTypes.PcrRemovePartnerFilesStep),
    z.literal(FormTypes.PcrAddPartnerAgreementFilesStep),
    z.literal(FormTypes.PcrAddPartnerJesFormStep),
    z.literal(FormTypes.PcrAddPartnerDeMinimisFilesStep),
  ]),
});

type FilesSchema = typeof filesSchema;

export class PcrItemFilesStepHandler extends ZodFormHandlerBase<FilesSchema, ProjectChangeRequestPrepareItemParams> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [
        FormTypes.PcrRenamePartnerFilesStep,
        FormTypes.PcrRemovePartnerFilesStep,
        FormTypes.PcrAddPartnerAgreementFilesStep,
        FormTypes.PcrAddPartnerJesFormStep,
        FormTypes.PcrAddPartnerDeMinimisFilesStep,
      ],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: filesSchema,
      errorMap: makeZodI18nMap({ keyPrefix: [] }),
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<FilesSchema>> {
    return {
      form: input.form,
    };
  }

  protected async run({
    input,
    params,
  }: {
    input: z.output<FilesSchema>;
    params: { step?: number; projectId: ProjectId; pcrId: PcrId; itemId: PcrItemId };
  }): Promise<string> {
    let goToSummary = false;

    if (
      input.form === FormTypes.PcrRenamePartnerFilesStep ||
      input.form === FormTypes.PcrRemovePartnerFilesStep ||
      input.form === FormTypes.PcrAddPartnerAgreementFilesStep
    ) {
      goToSummary = true;
    }

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: isNil(params.step) || goToSummary ? undefined : Number(params.step) + 1,
    }).path;
  }
}

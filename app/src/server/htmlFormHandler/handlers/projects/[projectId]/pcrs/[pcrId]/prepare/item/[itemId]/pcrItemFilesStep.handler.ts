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
  form: z.literal(FormTypes.PcrRenamePartnerFilesStep),
});

type FilesSchema = typeof filesSchema;

export class PcrItemFilesStepHandler extends ZodFormHandlerBase<FilesSchema, ProjectChangeRequestPrepareItemParams> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrRenamePartnerFilesStep],
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

    if (input.form === FormTypes.PcrRenamePartnerFilesStep) {
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

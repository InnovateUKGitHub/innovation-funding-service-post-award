import { IContext } from "@framework/types/IContext";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PartnerDetailsEditRoute } from "@ui/components/templates/PartnerDetailsEdit/PartnerDetailsEdit";
import {
  PostcodeSchema,
  postcodeErrorMap,
  postcodeSchema,
} from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { PartnerDetailsRoute } from "@ui/pages/projects/partnerDetails/partnerDetails.page";
import { PartnerDetailsParams } from "@ui/pages/projects/partnerDetails/partnerDetailsEdit.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class PartnerDetailsEditFormHandler extends ZodFormHandlerBase<PostcodeSchema, PartnerDetailsParams> {
  constructor() {
    super({
      routes: [PartnerDetailsEditRoute],
      forms: [FormTypes.ProjectSetupPostcode, FormTypes.PartnerDetailsEdit],
    });
  }

  public acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: postcodeSchema,
      errorMap: postcodeErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PostcodeSchema>> {
    return {
      partnerStatus: Number(input.partnerStatus),
      postcodeStatus: Number(input.postcodeStatus),
      postcode: input.postcode,
      form: input.form,
      isSetup: input.isSetup === "true",
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<PostcodeSchema>;
    params: PartnerDetailsParams;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(new UpdatePartnerCommand({ id: params.partnerId, projectId: params.projectId, ...input }));
    return PartnerDetailsRoute.getLink(params).path;
  }
}

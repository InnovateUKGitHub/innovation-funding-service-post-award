import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PostcodeSchema,
  postcodeErrorMap,
  postcodeSchema,
} from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { PartnerDetailsParams } from "@ui/pages/projects/partnerDetails/partnerDetailsEdit.page";
import { ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
import { ProjectSetupPartnerPostcodeRoute } from "@ui/pages/projects/setup/projectSetupPartnerPostcode.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class ProjectSetupPartnerPostcodeFormHandler extends ZodFormHandlerBase<PostcodeSchema, PartnerDetailsParams> {
  constructor() {
    super({
      routes: [ProjectSetupPartnerPostcodeRoute],
      forms: [FormTypes.ProjectSetupPostcode],
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
    await context.repositories.partners.update({
      Id: params.partnerId,
      Acc_Postcode__c: input.postcode,
    });
    return ProjectSetupRoute.getLink(params).path;
  }
}

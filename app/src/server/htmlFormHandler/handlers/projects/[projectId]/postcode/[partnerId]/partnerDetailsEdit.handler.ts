import { PostcodeTaskStatus } from "@framework/constants/partner";
import { IContext } from "@framework/types/IContext";
import { MutationNode, postMutation } from "@server/htmlFormHandler/postMutation";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PartnerDetailsEditRoute,
  PartnerDetailsParams,
} from "@ui/components/templates/PartnerDetailsEdit/PartnerDetailsEdit";
import { partnerDetailsEditMutation } from "@ui/components/templates/PartnerDetailsEdit/PartnerDetailsEdit.mutation";
import {
  partnerDetailsEditErrorMap,
  PartnerDetailsEditSchema,
  partnerDetailsEditSchema,
} from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { PartnerDetailsRoute } from "@ui/pages/projects/partnerDetails/partnerDetails.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class PartnerDetailsEditHandler extends ZodFormHandlerBase<PartnerDetailsEditSchema, PartnerDetailsParams> {
  constructor() {
    super({ routes: [PartnerDetailsEditRoute], forms: [FormTypes.PartnerDetailsEdit] });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    const schema = partnerDetailsEditSchema;
    return {
      schema,
      errorMap: partnerDetailsEditErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PartnerDetailsEditSchema>> {
    console.log("mapToZod", input);

    const mappedinputs = {
      form: input.form,
      postcodeStatus: Number(input.postcodeStatus) as PostcodeTaskStatus,
      postcode: input.postcode,
      partnerStatus: Number(input.partnerStatus),
    };

    console.log("mapToZod mapped", mappedinputs);
    return mappedinputs;
  }

  protected async run({
    input,
    context,
    params,
  }: {
    params: PartnerDetailsParams;
    input: z.output<PartnerDetailsEditSchema>;
    context: IContext;
  }): Promise<string> {
    await postMutation(context, partnerDetailsEditMutation as MutationNode, {
      partnerId: params.partnerId,
      postcode: input.postcode,
      projectId: params.projectId,
      partnerIdStr: params.partnerId,
    });

    return PartnerDetailsRoute.getLink({ projectId: params.projectId, partnerId: params.partnerId }).path;
  }
}

import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRItemDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetAvailableItemTypesQuery } from "@server/features/pcrs/getAvailableItemTypesQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { toArray } from "@shared/toArray";
import { ProjectChangeRequestAddTypeRoute } from "@ui/containers/pages/pcrs/addType";
import { PcrUpdateParams } from "@ui/containers/pages/pcrs/modifyOptions/PcrModifyOptions";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { getPcrUpdateTypesSchema, pcrModifyErrorMap, PcrUpdateTypesSchemaType } from "@ui/zod/pcrValidator.zod";
import { z } from "zod";

class ProjectChangeRequestAddTypeHandler extends ZodFormHandlerBase<PcrUpdateTypesSchemaType, PcrUpdateParams> {
  constructor() {
    super({
      routes: [ProjectChangeRequestAddTypeRoute],
      forms: [FormTypes.ProjectChangeRequestUpdateTypes],
    });
  }

  acceptFiles = false;

  protected async getZodSchema({ params, context }: { params: PcrUpdateParams; context: IContext }) {
    const typesPromise = context.runQuery(new GetAvailableItemTypesQuery(params.projectId, params.pcrId));
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(params.projectId));
    const pcrsPromise = context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const [types, partners, pcrs] = await Promise.all([typesPromise, partnersPromise, pcrsPromise]);

    return {
      schema: getPcrUpdateTypesSchema({
        pcrItemInfo: types,
        numberOfPartners: partners.length,
        currentPcrItems: pcrs.items,
      }),
      errorMap: pcrModifyErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PcrUpdateTypesSchemaType>> {
    return {
      form: FormTypes.ProjectChangeRequestUpdateTypes,
      projectId: input.projectId,
      pcrId: input.pcrId,
      types: toArray(input.types),
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<PcrUpdateTypesSchemaType>;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: input.projectId,
        projectChangeRequestId: input.pcrId,
        pcr: {
          projectId: input.projectId,
          id: input.pcrId,
          items: input.types.map(x => ({
            status: PCRItemStatus.ToDo,
            type: x,
          })) as PCRItemDto[],
        },
      }),
    );

    return ProjectChangeRequestPrepareRoute.getLink({ pcrId: input.pcrId, projectId: input.projectId }).path;
  }
}

export { ProjectChangeRequestAddTypeHandler };

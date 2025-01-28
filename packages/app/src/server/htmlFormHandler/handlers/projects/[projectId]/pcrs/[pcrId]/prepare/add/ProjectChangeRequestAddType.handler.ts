import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetAllPCRItemTypesQuery } from "@server/features/pcrs/getAllItemTypesQuery";
import { GetAvailableItemTypesQuery } from "@server/features/pcrs/getAvailableItemTypesQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { toIntArray } from "@shared/toArray";
import { ProjectChangeRequestAddTypeRoute } from "@ui/pages/pcrs/addType";
import { PcrUpdateParams } from "@ui/pages/pcrs/modifyOptions/PcrModifyOptions";
import {
  pcrCreateSchema,
  PcrCreateSchemaType,
  pcrModifyErrorMap,
} from "@ui/pages/pcrs/modifyOptions/pcrModifyOptions.zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestAddTypeHandler extends ZodFormHandlerBase<PcrCreateSchemaType, PcrUpdateParams> {
  constructor() {
    super({
      routes: [ProjectChangeRequestAddTypeRoute],
      forms: [FormTypes.ProjectChangeRequestUpdateTypes],
    });
  }

  acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrCreateSchema,
      errorMap: pcrModifyErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
    context,
  }: {
    input: AnyObject;
    params: PcrUpdateParams;
    context: IContext;
  }): Promise<z.input<PcrCreateSchemaType>> {
    const typesPromise = context.runQuery(new GetAvailableItemTypesQuery(params.projectId));
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(params.projectId));
    const pcrsPromise = context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));
    const [types, partners, pcrs] = await Promise.all([typesPromise, partnersPromise, pcrsPromise]);

    return {
      form: FormTypes.ProjectChangeRequestCreate,
      types: toIntArray(input.types),
      numberOfPartners: partners.length,
      pcrItemInfo: types,
      currentPcrItems: pcrs.items.map(x => x.type),
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<PcrCreateSchemaType>;
    context: IContext;
    params: PcrUpdateParams;
  }): Promise<string> {
    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(params.projectId));

    await context.repositories.projectChangeRequests.addPcrTypes({
      id: params.pcrId,
      projectId: params.projectId,
      items: input.types.map(type => {
        const matchedItem = itemTypes.find(t => t.type === type);
        if (!matchedItem) throw new Error(`cannot find item matching ${type}`);
        return {
          projectId: params.projectId,
          recordTypeId: matchedItem.recordTypeId,
          developerRecordTypeName: matchedItem.developerRecordTypeName,
          status: PCRItemStatus.ToDo,
        };
      }),
    });

    return ProjectChangeRequestPrepareRoute.getLink({ pcrId: params.pcrId, projectId: params.projectId }).path;
  }
}

export { ProjectChangeRequestAddTypeHandler };

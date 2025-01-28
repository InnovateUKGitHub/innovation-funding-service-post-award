import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetAvailableItemTypesQuery } from "@server/features/pcrs/getAvailableItemTypesQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { toIntArray } from "@shared/toArray";
import { ManageTeamMembersDashboardRoute } from "@ui/pages/pcrs/manageTeamMembers/dashboard/ManageTeamMembersDashboard.page";
import { PCRCreateRoute } from "@ui/pages/pcrs/create";
import { PcrModifyParams } from "@ui/pages/pcrs/modifyOptions/PcrModifyOptions";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  pcrCreateSchema,
  PcrCreateSchemaType,
  pcrModifyErrorMap,
} from "@ui/pages/pcrs/modifyOptions/pcrModifyOptions.zod";
import { GetAllPCRItemTypesQuery } from "@server/features/pcrs/getAllItemTypesQuery";

class ProjectChangeRequestCreateHandler extends ZodFormHandlerBase<PcrCreateSchemaType, PcrModifyParams> {
  constructor() {
    super({
      routes: [PCRCreateRoute],
      forms: [FormTypes.ProjectChangeRequestCreate],
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
    context,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: PcrModifyParams;
  }): Promise<z.input<PcrCreateSchemaType>> {
    const typesPromise = context.runQuery(new GetAvailableItemTypesQuery(params.projectId));
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(params.projectId));

    const [types, partners] = await Promise.all([typesPromise, partnersPromise]);

    return {
      form: FormTypes.ProjectChangeRequestCreate,
      types: toIntArray(input.types),
      numberOfPartners: partners.length,
      pcrItemInfo: types,
      currentPcrItems: [],
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<PcrCreateSchemaType>;
    context: IContext;
    params: PcrModifyParams;
  }): Promise<string> {
    // Run away to the Manage Team Members page and defer creating the PCR.
    if (input.types.length === 1 && input.types[0] === PCRItemType.ManageTeamMembers) {
      return ManageTeamMembersDashboardRoute.getLink({ projectId: params.projectId }).path;
    }

    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(params.projectId));

    const newPCR = {
      projectId: params.projectId,
      reasoningStatus: PCRItemStatus.ToDo,
      status: PCRStatus.DraftWithProjectManager,
      manageTeamMemberStatus: PCRStatus.Unknown,
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
    };

    const pcrId = await context.repositories.projectChangeRequests.createProjectChangeRequest(newPCR);

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: pcrId,
      Acc_ExternalComment__c: "",
      Acc_ParticipantVisibility__c: true,
    });

    return ProjectChangeRequestPrepareRoute.getLink({ pcrId, projectId: params.projectId }).path;
  }
}

export { ProjectChangeRequestCreateHandler };

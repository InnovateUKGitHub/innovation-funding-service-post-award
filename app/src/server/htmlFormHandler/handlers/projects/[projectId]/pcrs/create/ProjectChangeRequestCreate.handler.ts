import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { PCRItemDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { GetAvailableItemTypesQuery } from "@server/features/pcrs/getAvailableItemTypesQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { toIntArray } from "@shared/toArray";
import { ManageTeamMembersDashboardRoute } from "@ui/pages/pcrs/manageTeamMembers/dashboard/ManageTeamMembersDashboard.page";
import { PCRCreateRoute } from "@ui/pages/pcrs/create";
import { PcrModifyParams } from "@ui/pages/pcrs/modifyOptions/PcrModifyOptions";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { getPcrCreateSchema, PcrCreateSchemaType, pcrModifyErrorMap } from "@ui/zod/pcrValidator.zod";
import { z } from "zod";

class ProjectChangeRequestCreateHandler extends ZodFormHandlerBase<PcrCreateSchemaType, PcrModifyParams> {
  constructor() {
    super({
      routes: [PCRCreateRoute],
      forms: [FormTypes.ProjectChangeRequestCreate],
    });
  }

  acceptFiles = false;

  protected async getZodSchema({ params, context }: { params: PcrModifyParams; context: IContext }) {
    const typesPromise = context.runQuery(new GetAvailableItemTypesQuery(params.projectId));
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(params.projectId));

    const [types, partners] = await Promise.all([typesPromise, partnersPromise]);

    return {
      schema: getPcrCreateSchema({ pcrItemInfo: types, numberOfPartners: partners.length, currentPcrItems: [] }),
      errorMap: pcrModifyErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PcrCreateSchemaType>> {
    return {
      form: FormTypes.ProjectChangeRequestCreate,
      projectId: input.projectId,
      types: toIntArray(input.types),
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<PcrCreateSchemaType>;
    context: IContext;
    params: PcrModifyParams;
  }): Promise<string> {
    // Run away to the Manage Team Members page and defer creating the PCR.
    if (input.types.length === 1 && input.types[0] === PCRItemType.ManageTeamMembers) {
      return ManageTeamMembersDashboardRoute.getLink({ projectId: input.projectId }).path;
    }

    const newPcr = await context.runCommand(
      new CreateProjectChangeRequestCommand(input.projectId, {
        projectId: input.projectId,
        reasoningStatus: PCRItemStatus.ToDo,
        manageTeamMemberStatus: PCRStatus.Unknown,
        status: PCRStatus.DraftWithProjectManager,
        items: input.types.map(x => ({
          status: PCRItemStatus.ToDo,
          type: x,
        })) as PCRItemDto[],
      }),
    );

    return ProjectChangeRequestPrepareRoute.getLink({ pcrId: newPcr, projectId: input.projectId }).path;
  }
}

export { ProjectChangeRequestCreateHandler };

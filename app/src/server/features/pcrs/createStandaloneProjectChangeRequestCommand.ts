/* eslint-disable @typescript-eslint/naming-convention */

import { GetAvailableItemTypesQuery } from "./getAvailableItemTypesQuery";
import { ProjectRole } from "@framework/constants/project";
import { PCRItemTypeDto, StandalonePcrDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";

import { BadRequestError } from "../common/appError";
import { CommandBase } from "../common/commandBase";

export class CreateStandaloneProjectChangeRequestCommand extends CommandBase<string> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly projectChangeRequestDto: Pick<StandalonePcrDto, "type" | "projectId" | "status">,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  private async insertProjectChangeRequest(
    context: IContext,
    projectChangeRequestDto: Pick<StandalonePcrDto, "type" | "projectId" | "status">,
    itemTypes: PCRItemTypeDto[],
  ): Promise<PcrId> {
    const matchedRecordType = itemTypes.find(t => t.type === projectChangeRequestDto.type)?.recordTypeId ?? "unknown";

    const newPcr = {
      projectId: projectChangeRequestDto.projectId,
      recordTypeId: matchedRecordType,
      status: projectChangeRequestDto.status,
    };

    return context.repositories.projectChangeRequests.createStandaloneProjectChangeRequest(newPcr);
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string): Promise<string> {
    const pcrToBeChanged = {
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: "",
      Acc_ParticipantVisibility__c: true,
    };

    return await context.repositories.projectChangeRequestStatusChange.createStatusChange(pcrToBeChanged);
  }

  protected async run(context: IContext) {
    if ("id" in this.projectChangeRequestDto) {
      throw new BadRequestError("Project change request has already been created");
    }

    if (this.projectChangeRequestDto.projectId !== this.projectId) {
      throw new BadRequestError("Project type does not match change request project type");
    }

    const itemTypes = await context.runQuery(new GetAvailableItemTypesQuery(this.projectId));

    // Standalone PCR should not create a header PCR and instead just a single PCR is created
    const projectChangeRequestId = await this.insertProjectChangeRequest(
      context,
      this.projectChangeRequestDto,
      itemTypes,
    );

    await this.insertStatusChange(context, projectChangeRequestId);

    return projectChangeRequestId;
  }
}

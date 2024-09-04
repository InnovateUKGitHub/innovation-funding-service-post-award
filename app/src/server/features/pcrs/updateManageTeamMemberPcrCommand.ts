import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { ManageTeamMemberPcrDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { InActiveProjectError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { GetPCRByIdQuery } from "./getPCRByIdQuery";
import { mergePcrData } from "@framework/util/pcrHelper";

type PcrData = Pick<ManageTeamMemberPcrDto, "id" | "status" | "firstName" | "lastName" | "email" | "organisation">;

export class UpdatePCRCommand extends CommandBase<boolean> {
  private readonly projectId: ProjectId;
  private readonly projectChangeRequestId: PcrId;
  private readonly pcr: PcrData;

  constructor({
    projectId,
    projectChangeRequestId,
    pcr,
  }: {
    projectId: ProjectId;
    projectChangeRequestId: PcrId;
    pcr: PcrData;
  }) {
    super();
    this.projectId = projectId;
    this.projectChangeRequestId = projectChangeRequestId;
    this.pcr = pcr;
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  private async insertStatusChange(
    context: IContext,
    projectChangeRequestId: string,
    comments: string,
    originalStatus: PCRStatus,
    newStatus: PCRStatus,
  ): Promise<void> {
    const nowSubmittedToMo = newStatus === PCRStatus.SubmittedToMonitoringOfficer;
    const nowQueriedToMo = newStatus === PCRStatus.QueriedByMonitoringOfficer;
    const nowQueriedToInnovateUk = newStatus === PCRStatus.SubmittedToInnovateUK;
    const previouslyQueriedByInnovateUk = originalStatus === PCRStatus.QueriedToProjectManager;
    const shouldPmSee = nowSubmittedToMo || nowQueriedToMo || (nowQueriedToInnovateUk && previouslyQueriedByInnovateUk);

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: comments,
      Acc_ParticipantVisibility__c: shouldPmSee,
    });
  }

  protected async run(context: IContext): Promise<boolean> {
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));
    if (!isProjectActive) throw new InActiveProjectError();

    const pcr = await context.runQuery(new GetPCRByIdQuery(this.projectId, this.projectChangeRequestId));

    const mergedPcr = mergePcrData(this.pcr, pcr);
    await context.repositories.projectChangeRequests.updateManageTeamMemberPcr(mergedPcr);

    return true;
  }
}

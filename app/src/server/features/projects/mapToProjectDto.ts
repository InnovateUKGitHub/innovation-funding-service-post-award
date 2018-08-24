import { IContext, IQuery } from "../common/context";
import { ProjectDto } from "../../../models";
import { ISalesforceProject } from "../../repositories/projectsRepository";

export class MapToProjectDtoCommand implements IQuery<ProjectDto> {
  constructor(readonly item: ISalesforceProject) { }

  async Run(context: IContext) {
    return Promise.resolve({
      id: this.item.Id,
      title: this.item.Acc_ProjectTitle__c,
      summary: this.item.Acc_ProjectSummary__c,
      competition: this.item.Acc_CompetitionId__c,
      startDate: new Date(this.item.Acc_StartDate__c),
      endDate: new Date(this.item.Acc_EndDate__c),
      projectNumber: this.item.Acc_ProjectNumber__c,
      applicationUrl: this.item.Acc_ProjectSource__c === "IFS" ? "#" : undefined,
      grantOfferLetterUrl: this.item.Acc_ProjectSource__c === "IFS" ? "#" : undefined,
    });
  }
}

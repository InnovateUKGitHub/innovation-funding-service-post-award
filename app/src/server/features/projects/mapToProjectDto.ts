import { IContext, IQuery } from "../common/context";
import { ProjectDto } from "../../../models";
import { ISalesforceProject } from "../../repositories/projectsRepository";

export class MapToProjectDtoCommand implements IQuery<ProjectDto> {
  constructor(readonly item: ISalesforceProject) {}

  async Run(context: IContext) {
      return Promise.resolve({
        id: this.item.Id,
        title: this.item.ProjectTitle__c,
        summary: this.item.ProjectSummary__c,
        competition: this.item.Competetion__c,
        startDate: this.item.StartDate__c,
        endDate: this.item.EndDate__c,
        applicationUrl: "#",
        grantOfferLetterUrl: "#"
    });
  }
}

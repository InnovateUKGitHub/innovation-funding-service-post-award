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
      applicationUrl: this.getIFSUrl(this.item, context.config.ifsApplicationUrl),
      grantOfferLetterUrl: this.getIFSUrl(this.item, context.config.ifsGrantLetterUrl),
    });
  }

  private getIFSUrl(project: ISalesforceProject, ifsUrl: string): string | null {
    if (ifsUrl && project.Acc_ProjectSource__c === "IFS") {
      /// foreach prop in project build regex replacing <<PROP_NAME>> with value and then replace the expected value in string
      return Object.keys(project)
        .map(key => ({ regEx: new RegExp(`<<${key}>>`, "g"), val: (project as any)[key] }))
        .reduce((url, item) => url.replace(item.regEx, item.val), ifsUrl);
    }
    return null;
  }
}

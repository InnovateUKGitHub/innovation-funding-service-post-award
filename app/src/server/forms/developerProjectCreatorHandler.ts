import { DeveloperProjectCreateDto } from "@framework/dtos/developerProjectCreate";
import { Logger } from "@shared/developmentLogger";
import { DeveloperProjectCreatorPage } from "@ui/containers/developer/ProjectCreator.page";
import express from "express";
import { configuration } from "../features/common/config";
import { IFormHandler } from "./formHandlerBase";
import { ISession } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import createProject from "../apex/createProject.apex";
import postCreateProject from "../apex/postCreateProject.apex";
import { apex } from "@server/util/salesforce-string-helpers";
import { DeveloperHomePage } from "@ui/containers/developer/home.page";
import { sleep } from "@shared/sleep";

export class DeveloperProjectCreatorHandler implements IFormHandler {
  public readonly routePath = DeveloperProjectCreatorPage.routePath;
  public readonly middleware: express.RequestHandler[] = [];
  private readonly logger: Logger = new Logger("Project Creator");

  constructor() {
    this.handle = this.handle.bind(this);
  }

  private getCreateApexCode({
    claimFrequency,
    competitionCode,
    competitionType,
    participantOrgType,
    participantType,
    projectDuration,
    projectId,
    projectName,
    startDate,
    impactManagementParticipation,
  }: DeveloperProjectCreateDto) {
    return (
      apex`
Integer NoOfParticipants = 3;
String ProjectName = ${projectName};
String Acc_ClaimFrequency = ${claimFrequency};
String Acc_CompetitionType = ${competitionType};
Integer projectDur = ${projectDuration};
Boolean PMFinanceContact = true;
Integer offsetVal = 1;
String participantType = ${participantType};
String participantOrgType = ${participantOrgType};
String Acc_CompetitionCode = ${competitionCode};
String Acc_CompetitionName = 'SteveTest';
Double accProjNo = ${projectId};
Date startDate = ${startDate};
String Impact_Management_participation__c = ${impactManagementParticipation};
` + createProject
    );
  }

  public async handle({
    req,
    res,
    next,
  }: {
    req: express.Request;
    res: express.Response;
    next: express.NextFunction;
  }): Promise<void> {
    // Pretend this handler does not exist if we happen to run it
    // outside of a development environment.
    if (configuration.sso.enabled) return next();

    const dto: DeveloperProjectCreateDto = {
      projectName: req.body.projectCreatorProjectName,
      competitionType: req.body.projectCreatorCompetitionType,
      claimFrequency: req.body.projectCreatorClaimFrequency,
      projectDuration: parseInt(req.body.projectCreatorProjectDuration, 10),
      participantType: req.body.projectParticipantType,
      participantOrgType: req.body.projectParticipantOrgType,
      projectId: parseInt(req.body.projectCreatorProjectId, 10),
      competitionCode: req.body.projectCreatorCompetitionCode,
      impactManagementParticipation: req.body.projectCreatorImpactManagementParticipation,
      startDate: new Date(
        Date.UTC(
          parseInt(req.body.projectCreatorStartDate_year, 10),
          parseInt(req.body.projectCreatorStartDate_month, 10) - 1,
          parseInt(req.body.projectCreatorStartDate_day, 10),
        ),
      ),
    };

    const session: ISession = { user: req.session?.user };
    const context = contextProvider.start(session);

    const connection = await context.getSalesforceConnection();

    const apex = this.getCreateApexCode(dto);
    this.logger.debug("Creating project...", dto, apex);

    // Start off by creating the new project.
    const createRes = await connection.tooling.executeAnonymous(apex);
    this.logger.debug("Project created! Waiting 10 seconds before running post-create tasks...", createRes);
    res.redirect(DeveloperHomePage.routePath);

    // After 10 seconds, run the post-create tasks.
    await sleep(10000);
    this.logger.debug("Running post-create tasks...");
    try {
      const postCreateRes = await connection.tooling.executeAnonymous(postCreateProject);
      this.logger.debug("Post-create tasks done!", postCreateRes);
    } catch (e) {
      this.logger.error("Failed to run post-create tasks.", e);
    }
  }
}

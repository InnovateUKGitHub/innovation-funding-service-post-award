import { AbstractProjectFactoryScript } from "@innovateuk/project-factory-two/scripts/AbstractProjectFactoryScript";
import { AbstractSObject } from "@innovateuk/project-factory-two/sobjects/AbstractProjectFactory";
import { ITsforceConnection } from "@innovateuk/tsforce/types/ITsforceConnection";
import { SfdcApi } from "../sfdc/SfdcApi";
import { ProjectState } from "./ProjectState";

export abstract class ProjectFactory<Context extends Record<string, AbstractSObject>, Arguments> {
  protected readonly sfdcApi: SfdcApi;
  protected projectState: ProjectState | null;
  protected prefix: string | null = null;

  constructor({ projectState, sfdcApi }: { projectState: ProjectState; sfdcApi: SfdcApi }) {
    this.sfdcApi = sfdcApi;
    this.projectState = projectState;
  }

  protected abstract getScript({
    connection,
  }: {
    connection: ITsforceConnection;
  }): AbstractProjectFactoryScript<Context, Arguments>;

  protected async createProject(args: Arguments) {
    // Project has already been created once.
    if (this.projectState.context.project) return
    const connection = await this.sfdcApi.getTsforceConnection();
    const script = this.getScript({ connection });
    this.projectState.context = await script.run(args);
  }
}
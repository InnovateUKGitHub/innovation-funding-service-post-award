import { sleep } from "../../helpers/sleep";
import { SfdcApi } from "../sfdc/SfdcApi";
import { ProjectState } from "./ProjectState";
import { ITsforceConnection } from "@innovateuk/tsforce/types/ITsforceConnection";
import { AbstractProjectFactoryScript } from "@innovateuk/project-factory-two/scripts/AbstractProjectFactoryScript";

export abstract class ProjectFactory<Context> {
  public static projectState: ProjectState | null;
  protected readonly sfdcApi: SfdcApi;
  protected projectState: ProjectState | null;
  protected prefix: string | null = null;
  protected context: Context | null = null;

  constructor({ projectState, sfdcApi }: { projectState: ProjectState; sfdcApi: SfdcApi }) {
    this.sfdcApi = sfdcApi;
    this.projectState = projectState;
  }

  protected abstract getScript({
    connection,
  }: {
    connection: ITsforceConnection;
  }): AbstractProjectFactoryScript<Context>;

  protected async createProject() {
    const connection = await this.sfdcApi.getTsforceConnection();
    const script = this.getScript({ connection });
    this.context = await script.run();
  }
}

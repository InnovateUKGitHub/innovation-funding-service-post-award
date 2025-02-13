import { AbstractApexScript } from "@innovateuk/project-factory-two/scripts/AbstractApexScript";
import { ProjectFactory } from "./ProjectFactory";
import { ITsforceConnection } from "@innovateuk/tsforce/index";

export abstract class AbstractProjectFactoryApexScript<Arguments> extends ProjectFactory<{}, Arguments> {
  abstract getScript({ connection }: { connection: ITsforceConnection }): AbstractApexScript<Arguments>;

  protected async createProject(args: Arguments): Promise<void> {
    const connection = await this.sfdcApi.getTsforceConnection();
    const script = this.getScript({ connection });
    await script.run(args);
  }
}

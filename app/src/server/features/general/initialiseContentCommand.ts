import { CommandBase } from "../common/commandBase";
import { IContext } from "@framework/types";

const defaultContentMarker = new Date("1970/01/01");

export class InitialiseContentCommand extends CommandBase<boolean> {

  protected async Run(context: IContext) {
    const lastUpdated = context.caches.contentStoreLastUpdated;

    // will eventually have custom content too so assigning to result
    let result = false;

    if (!lastUpdated) {
      await this.setDefaultContent(context);
      result = true;
    }
    return result;
  }

  private async setDefaultContent(context: IContext) {
    const defaultContent = JSON.parse(await context.resources.defaultContent.getContent());
    context.internationalisation.addResourceBundle(defaultContent);
    context.caches.contentStoreLastUpdated = defaultContentMarker;
  }
}

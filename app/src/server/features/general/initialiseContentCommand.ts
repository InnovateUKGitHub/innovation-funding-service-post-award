import { CommandBase } from "../common/commandBase";
import { IContext } from "@framework/types";

const defaultContentMarker = new Date("1970/01/01");

export class InitialiseContentCommand extends CommandBase<boolean> {

  protected async Run(context: IContext) {
    const lastUpdated = context.caches.contentStoreLastUpdated;
    const customLastModified = lastUpdated && context.config.features.customContent ? 
      await context.resources.customContent.getInfo().then(x => x.lastModified) : 
      null;

    // will eventually have custom content too so assigning to result
    let result = false;

    if (!lastUpdated || (customLastModified && customLastModified > lastUpdated)) {
      await this.setDefaultContent(context);
      if(context.config.features.customContent) {
        await this.setCustomContent(context);
      }
      result = true;
    }

    return result;
  }

  private async setDefaultContent(context: IContext) {
    const defaultContent = JSON.parse(await context.resources.defaultContent.getContent());
    context.internationalisation.addResourceBundle(defaultContent);
    context.caches.contentStoreLastUpdated = defaultContentMarker;
    context.logger.info("Set default content", context.caches.contentStoreLastUpdated);
  }

  private async setCustomContent(context: IContext) {
    const customContent = JSON.parse(await context.resources.customContent.getContent());
    context.internationalisation.addResourceBundle(customContent);
    context.caches.contentStoreLastUpdated = context.clock.now();
    context.logger.info("Set custom content", context.caches.contentStoreLastUpdated);
  }
}

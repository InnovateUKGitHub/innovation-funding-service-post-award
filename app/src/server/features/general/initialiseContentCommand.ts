import { CommandBase, NonAuthorisedCommandBase } from "../common/commandBase";
import { IContext } from "@framework/types";

const defaultContentMarker = new Date("1970/01/01");

export class InitialiseContentCommand extends NonAuthorisedCommandBase<boolean> {
  constructor(private readonly loadCustom: boolean) {
    super();
  }

  protected async Run(context: IContext) {
    const useCustomContent = this.loadCustom && context.config.features.customContent;

    // if we have never set default content then contentStoreLastUpdated will be null
    const defaultContentUpdateRequired = context.caches.contentStoreLastUpdated === null;

    // if we are using custom content then check if last modified is greater than last updated
    const lastUpdated = context.caches.contentStoreLastUpdated || defaultContentMarker;
    const customContentUpdateRequired = useCustomContent && await this.checkCustomContentModified(context, lastUpdated);

    if (defaultContentUpdateRequired || customContentUpdateRequired) {
      // need to set default content even if its only custom content updated
      // allows values to be removed from the custom content because reset to default content first
      await this.setCRDCompetitionContent(context);
      await this.setDefaultContent(context);
      if (customContentUpdateRequired) {
        await this.setCustomContent(context);
      }
      return true;
    }

    return false;
  }

  private checkCustomContentModified(context: IContext, lastUpdated: Date) {
    return context.resources.customContent.getInfo()
      .then(x => x.lastModified > lastUpdated);
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

  private async setCRDCompetitionContent(context: IContext) {
    const crdCompetitionContent = JSON.parse(await context.resources.crdCompetitionContent.getContent());
    context.internationalisation.addResourceBundle(crdCompetitionContent);
    context.logger.info("Set crd content", context.caches.contentStoreLastUpdated);
  }
}

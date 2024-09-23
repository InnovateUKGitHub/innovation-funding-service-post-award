import {
  enCopy,
  ktpEnCopy,
  loansEnCopy,
  sbriEnCopy,
  horizonEuropeParticipationEnCopy,
  CopyNamespaces,
} from "@copy/data";
import { IContext } from "@framework/types/IContext";
import { NonAuthorisedCommandBase } from "../common/commandBase";

const defaultContentMarker = new Date("1970/01/01");

export class InitialiseContentCommand extends NonAuthorisedCommandBase<boolean> {
  constructor(private readonly loadCustom: boolean) {
    super();
  }

  protected async run(context: IContext): Promise<boolean> {
    const useCustomContent = this.loadCustom && context.config.features.customContent;

    // if we have never set default content then contentStoreLastUpdated will be null
    const defaultContentUpdateRequired = context.caches.contentStoreLastUpdated === null;

    // if we are using custom content then check if last modified is greater than last updated
    const lastUpdated = context.caches.contentStoreLastUpdated || defaultContentMarker;
    const customContentUpdateRequired =
      useCustomContent && (await this.checkCustomContentModified(context, lastUpdated));

    if (defaultContentUpdateRequired || customContentUpdateRequired) {
      // need to set default content even if its only custom content updated
      // allows values to be removed from the custom content because reset to default content first
      this.setCompetitionContent(context);
      this.setDefaultContent(context);

      if (customContentUpdateRequired) {
        await this.setCustomContent(context);
      }
      return true;
    }

    return false;
  }

  private checkCustomContentModified(context: IContext, lastUpdated: Date) {
    return context.resources.customContent.getInfo().then(x => x.lastModified > lastUpdated);
  }

  private setDefaultContent(context: IContext): void {
    context.internationalisation.addResourceBundle(enCopy, "default");
    context.caches.contentStoreLastUpdated = defaultContentMarker;
    context.logger.info("Set default content", context.caches.contentStoreLastUpdated);
  }

  private async setCustomContent(context: IContext): Promise<void> {
    const customContent = JSON.parse(await context.resources.customContent.getContent());
    context.internationalisation.addResourceBundle(customContent, "default");
    context.caches.contentStoreLastUpdated = context.clock.now();
    context.logger.info("Set custom content", context.caches.contentStoreLastUpdated);
  }

  private setCompetitionContent(context: IContext): void {
    context.internationalisation.addResourceBundle(ktpEnCopy, CopyNamespaces.KTP);
    context.internationalisation.addResourceBundle(sbriEnCopy, CopyNamespaces.SBRI);
    context.internationalisation.addResourceBundle(sbriEnCopy, CopyNamespaces.SBRI_IFS);
    context.internationalisation.addResourceBundle(loansEnCopy, CopyNamespaces.LOANS);
    context.internationalisation.addResourceBundle(
      horizonEuropeParticipationEnCopy,
      CopyNamespaces.HORIZON_EUROPE_PARTICIPATION,
    );
    context.logger.info("Set crd content", context.caches.contentStoreLastUpdated);
  }
}

import i18next from "i18next";
import { Content } from "./content";
import { ContentBase } from "./contentBase";

export abstract class ContentPageBase extends ContentBase {
  protected constructor(parent: Content, pageName: string, competitionType?: string) {
    super(parent, `pages.${pageName}`, competitionType);
  }

  public title() {
    const prefix = super.getNameParts().join(".");

    const originalHtmlKey = `${prefix}.title.html`;
    const originalDisplayKey = `${prefix}.title.display`;

    // Note: We check he if the dev has custom html/display object keys
    const hasCustomDisplay = i18next.exists(originalHtmlKey) || i18next.exists(originalDisplayKey);

    if (hasCustomDisplay) {
      const { key: htmlKey, content: htmlContent } = this.getContent(originalHtmlKey);
      const { key: displayKey, content: displayContent } = this.getContent(originalDisplayKey);

      return {
        htmlTitle: htmlContent,
        htmlTitleKey: htmlKey,
        displayTitle: displayContent,
        displayTitleKey: displayKey,
      };
    }

    const { key: generalKey, content: generalContent } = this.getContent(`${prefix}.title`);

    return {
      htmlTitle: generalContent,
      htmlTitleKey: generalKey,
      displayTitle: generalContent,
      displayTitleKey: generalKey,
    };
  }
}

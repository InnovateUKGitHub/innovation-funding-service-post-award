import i18next from "i18next";
import { ContentBase } from "./contentBase";
import { Content } from "./content";
import { ProjectDto } from "@framework/dtos";

export abstract class ContentPageBase extends ContentBase {

  protected constructor(parent: Content, pageName: string, protected project?: ProjectDto | null | undefined) {
    super(parent, `pages.${pageName}`, project);
  }

  public title() {
    const prefix = super.getNameParts().join(".");
    const htmlKey = `${prefix}.title.html`;
    const displayKey = `${prefix}.title.display`;

    const html = i18next.exists(htmlKey) ? i18next.t(htmlKey) : null;
    const display = i18next.exists(displayKey) ? i18next.t(displayKey) : null;

    if (html || display) {
      return {
        htmlTitle: html || htmlKey,
        htmlTitleKey: htmlKey,
        displayTitle: display || displayKey,
        displayTitleKey: displayKey,
      };
    }

    const generalKey = `${prefix}.title`;
    const general = i18next.exists(generalKey) ? i18next.t(generalKey) : null;
    return {
      htmlTitle: general || generalKey,
      htmlTitleKey: generalKey,
      displayTitle: general || generalKey,
      displayTitleKey: generalKey,
    };

  }
}

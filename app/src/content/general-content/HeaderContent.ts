import { Content } from "../../content";
import { ContentPageBase } from "@content/contentPageBase";

export class HeaderContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "site");
  }

  public readonly siteName: string = "Innovation Funding Service";
  public readonly mobileNavigationLabel = this.getContent("site.header.mobileNavigationLabel");
  public readonly dashboard = this.getContent("site.header.navigation.dashboard");
  public readonly profile = this.getContent("site.header.navigation.profile");
  public readonly signOut = this.getContent("site.header.navigation.signOut");
}

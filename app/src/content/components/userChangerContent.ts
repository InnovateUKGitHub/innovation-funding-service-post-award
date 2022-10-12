import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class UserChangerContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "userChanger", competitionType);
  }

  public readonly sectionTitle = this.getContent("components.userChanger.section-title");
  public readonly pickUserSubtitle = this.getContent("components.userChanger.pick-user-subtitle");
  public readonly enterUserSubtitle = this.getContent("components.userChanger.enter-user-subtitle");
  public readonly projectDropdownPlaceholder = this.getContent("components.userChanger.project-dropdown-placeholder");
  public readonly contactDropdownPlaceholder = this.getContent("components.userChanger.contact-dropdown-placeholder");
  public readonly contactListEmpty = this.getContent("components.userChanger.contact-list-empty");
  public readonly changeUserMessage = this.getContent("components.userChanger.change-user-message");
  public readonly resetUserMessage = this.getContent("components.userChanger.reset-user-message");
  public readonly invalidUserMessage = this.getContent("components.userChanger.invalid-user-message");
}

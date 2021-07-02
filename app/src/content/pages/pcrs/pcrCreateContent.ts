import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class PCRCreateContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-create", competitionType);
  }

  public readonly guidanceIntroMessage = this.getContent("guidance-intro-message");
  public readonly guidanceListRow1 = this.getContent("pages.pcr-create.guidance-list.row-1");
  public readonly guidanceListRow2 = this.getContent("pages.pcr-create.guidance-list.row-2");

  public readonly selectRequestTypesTitle = this.getContent("select-request-types-title");
  public readonly selectTypesHint = this.getContent("select-types-hint");
  public readonly backLink = this.getContent("back-link");
  public readonly createRequestButton = this.getContent("button-create-request");
  public readonly cancelRequestButton = this.getContent("button-cancel-request");
  public readonly learnMoreAboutTitle = this.getContent("learn-more-title");
  public readonly reallocateCostsTitle = this.getContent("reallocate-costs-title");
  public readonly reallocateCostsMessage = this.getContent("reallocate-costs-message");
  public readonly removePartnerTitle = this.getContent("remove-partner-title");
  public readonly removePartnerMessage = this.getContent("remove-partner-message");
  public readonly addPartnerTitle = this.getContent("add-partner-title");
  public readonly addPartnerMessage = this.getContent("add-partner-message");
  public readonly changeScopeTitle = this.getContent("change-scope-title");
  public readonly changeScopeMessage = this.getContent("change-scope-message");
  public readonly changeDurationTitle = this.getContent("change-duration-title");
  public readonly changeDurationMessage = this.getContent("change-duration-message");
  public readonly changePartnersNameTitle = this.getContent("change-partners-name-title");
  public readonly changePartnersNameMessage = this.getContent("change-partners-name-message");
  public readonly putProjectOnHoldTitle = this.getContent("put-project-on-hold-title");
  public readonly putProjectOnHoldMessage = this.getContent("put-project-on-hold-message");
  public readonly endProjectEarlyTitle = this.getContent("end-project-early-title");
  public readonly endProjectEarlyMessage = this.getContent("end-project-early-message");
}

import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRAddPartnerStateAidEligibilityContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-add-partner-state-aid-eligibility");
  }

  public readonly pcrItem = new PCRItem(this);
  public readonly labels = new PCRAddPartnerLabels(this);
  public readonly documentLabels = new DocumentLabels(this);
  public readonly documentMessages = new DocumentMessages(this);

  public readonly stateAidTitle = () => this.getContent("form-section-title-state-aid");
  public readonly deMinimisTitle = () => this.getContent("form-section-title-de-minimis");
  public readonly nonAidFundingTitle = () => this.getContent("form-section-title-non-aid-funding");
  public readonly stateAidGuidance = () => this.getContent("guidance-state-aid", {markdown: true});
  public readonly deMinimisGuidance = () => this.getContent("guidance-de-minimis", {markdown: true});
  public readonly nonAidFundingGuidance = () => this.getContent("guidance-non-aid-funding", {markdown: true});
  public readonly templateSectionTitle = () => this.getContent("section-title-template");
  public readonly uploadDeclarationSectionTitle = () => this.getContent("section-title-upload-declaration");
}

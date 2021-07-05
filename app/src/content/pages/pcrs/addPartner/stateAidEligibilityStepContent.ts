import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerStateAidEligibilityContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-state-aid-eligibility", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);

  public readonly stateAidTitle = this.getContent("form-section-title-state-aid");
  public readonly deMinimisTitle = this.getContent("form-section-title-de-minimis");
  public readonly nonAidFundingTitle = this.getContent("form-section-title-non-aid-funding");
  public readonly stateAidGuidance = this.getContent("guidance-state-aid", { markdown: true });
  public readonly deMinimisGuidance = this.getContent("guidance-de-minimis", { markdown: true });
  public readonly nonAidFundingGuidance = this.getContent("guidance-non-aid-funding", { markdown: true });
  public readonly templateSectionTitle = this.getContent("section-title-template");
  public readonly uploadDeclarationSectionTitle = this.getContent("section-title-upload-declaration");
}

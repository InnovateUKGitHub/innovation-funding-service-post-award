import { DateFormat, formatDate } from "@framework/util";
import { ContentBase } from "../contentBase";

export class ClaimMessages extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "claims-messages", competitionType);
  }

  public readonly guidanceMessage = this.getContent("guidance-message", { markdown: true });
  public readonly submitClaimConfirmation = this.getContent("submit-claim-confirmation");
  public readonly noOpenClaimsMessage = (nextClaimStartDate: Date) =>
    this.getContent("no-open-claims", { nextClaimStartDate: formatDate(nextClaimStartDate, DateFormat.FULL_DATE) });
  public readonly noRemainingClaims = this.getContent("no-remaining-claims");
  public readonly noClosedClaims = this.getContent("no-closed-claims");
  public readonly finalClaimMessage = this.getContent("final-claim");
  public readonly iarRequired = this.getContent("iar-required");
  public readonly iarRequiredAdvice = this.getContent("iar-required-advice");
  public readonly sbriDocumentAdvice = this.getContent("sbri-document-advice");
  public readonly sbriInvoiceBullet1 = this.getContent("sbri-invoice-bullet-1");
  public readonly sbriInvoiceBullet2 = this.getContent("sbri-invoice-bullet-2");
  public readonly sbriInvoiceBullet3 = this.getContent("sbri-invoice-bullet-3");
  public readonly sbriMoAdvice = this.getContent("sbri-mo-advice");
  public readonly claimQueried = this.getContent("claim-queried");
  public readonly claimApproved = this.getContent("claim-approved");
  public readonly finalClaimIarAdvice = this.getContent("final-claim-iar-advice");
  public readonly finalClaimNonIarAdvice = this.getContent("final-claim-non-iar-advice");
  public readonly finalClaimGuidanceParagraph1 = this.getContent("final-claim-guidance-content-1");
  public readonly finalClaimGuidanceParagraph2 = this.getContent("final-claim-guidance-content-2");
  public readonly finalClaimStep1 = this.getContent("final-claim-step-1");
  public readonly finalClaimStep2 = this.getContent("final-claim-step-2");
  public readonly finalClaimStep3 = this.getContent("final-claim-step-3");
  public readonly usefulTip = this.getContent("useful-tip");
  public readonly requiredUploadAdvice = this.getContent("required-upload-advice");
  public readonly requiredUploadStep1 = this.getContent("required-upload-step-1");
  public readonly requiredUploadStep2 = this.getContent("required-upload-step-2");
  public readonly frequencyChangeMessage = this.getContent("frequency-change-message");
  public readonly lastChanceToChangeForecast = (periodId: number) =>
    this.getContent("last-chance-to-change-forecast", { periodId });
  public readonly documentDisclaimerMessage = this.getContent("document-disclaimer-message");
  public readonly documentValidationMessage = this.getContent("document-validation-message");
  public readonly documentDetailGuidance = this.getContent("document-detail-guidance");
  public readonly interimClaimMessage = this.getContent("interim-claim-message", { markdown: true });
  public readonly editClaimLineItemGuidance = this.getContent("edit-claim-line-item-guidance");
  public readonly editClaimLineItemCurrencyGbp = this.getContent("edit-claim-line-item-convert-gbp");

  public readonly sbriDocumentDetailGuidance = (costCategoryName: string) =>
    this.getContent("sbri-document-detail-guidance", { costCategoryName });
  public readonly sbriSupportingDocumentGuidance = this.getContent("sbri-supporting-document-guidance");
  public readonly editClaimLineItemOtherCostsTotal = this.getContent("edit-claim-line-item-other-costs-total-costs");
  public readonly editClaimLineItemVatRegistered = this.getContent("edit-claim-line-item-vat-registered");
  public readonly editClaimLineItemContactMo = this.getContent("edit-claim-line-item-contact-mo");
  public readonly editClaimLineItemUploadEvidence = this.getContent("edit-claim-line-item-upload-evidence");
  public readonly editClaimLineItemClaimDocuments = this.getContent("edit-claim-line-item-claim-documents");

  public readonly editClaimLineItemDocumentGuidance = this.getContent("edit-claim-line-item-document-guidance");
  public readonly negativeClaimWarning = this.getContent("negative-claim-warning");
  public readonly claimSummaryWarning = this.getContent("claim-summary-warning");
  public readonly claimSavedMessage = this.getContent("claim-saved-message");
}

import { ContentBase } from "@content/contentBase";

export class PCRAddPartnerLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "pcr-add-partner-labels");
  }
  public readonly roleHeading = () => this.getContent("role-heading");
  public readonly commercialWorkHeading = () => this.getContent("commercial-work-heading");
  public readonly commercialWorkHint = () => this.getContent("commercial-work-label-hint");
  public readonly commercialWorkLabel = () => this.getContent("commercial-work-label");
  public readonly commercialWorkNo = () => this.getContent("commercial-work-no");
  public readonly commercialWorkYes = () => this.getContent("commercial-work-yes");
  public readonly organisationHeading = () => this.getContent("organisation-heading");

  public readonly contactFirstNameHeading = () => this.getContent("contact-first-name-heading");
  public readonly contactLastNameHeading = () => this.getContent("contact-last-name-heading");
  public readonly contactPhoneNumberHeading = () => this.getContent("contact-phone-number-heading");
  public readonly contactEmailHeading = () => this.getContent("contact-email-heading");

  public readonly deMinimisDeclarationForm = () => this.getContent("de-minimis-declaration-form");

  public readonly organisationNameHeading = () => this.getContent("organisation-name-heading");
  public readonly registrationNumberHeading = () => this.getContent("registration-number-heading");
  public readonly registeredAddressHeading = () => this.getContent("registered-address-heading");

  public readonly organisationSizeHeading = () => this.getContent("organisation-size-heading");
  public readonly employeeCountHeading = () => this.getContent("employee-count-heading");

  public readonly financialYearEndHeading = () => this.getContent("financial-year-end-heading");

  public readonly projectLocationHeading = () => this.getContent("project-location-heading");
  public readonly townOrCityHeading = () => this.getContent("town-or-city-heading");
  public readonly postcodeHeading = () => this.getContent("postcode-heading");

  public readonly jesFormHeading = () => this.getContent("jes-form-heading");

  public readonly tsbReferenceHeading = () => this.getContent("tsb-reference-heading");

  public readonly projectCostsHeading = () => this.getContent("project-costs-heading");

  public readonly otherFundingSourcesHeading = () => this.getContent("other-funding-sources-heading");
  public readonly otherFundsYes = () => this.getContent("other-funds-yes");
  public readonly otherFundsNo = () => this.getContent("other-funds-no");

  public readonly amountOfOtherFundingHeading = () => this.getContent("amount-of-other-funding-heading");
  public readonly fundingLevelHeading = () => this.getContent("funding-level-heading");
  public readonly fundingSoughtHeading = () => this.getContent("funding-sought-heading");
  public readonly partnerContributionsHeading = () => this.getContent("partner-contributions-heading");

  public readonly organisationSectionTitle = () => this.getContent("organisation-section-title");
  public readonly commercialWorkSummaryHeading = () => this.getContent("commercial-work-summary-heading");
  public readonly aidEligibilityDeclaration = () => this.getContent("aid-eligibility-declaration");
  public readonly turnoverHeading = () => this.getContent("turnover-summary-heading");
  public readonly contactsSectiontitle = () => this.getContent("contacts-section-title");
  public readonly financeContactHeading = () => this.getContent("finance-contact-heading");
  public readonly projectLeadContactHeading = () => this.getContent("project-lead-contact-heading");
  public readonly fundingSectionTitle = () => this.getContent("funding-section-title");

  public readonly agreementToPcrHeading = () => this.getContent("agreement-to-pcr-heading");
  public readonly agreementSectionTitle = () => this.getContent("agreement-section-title");
}

import { ContentBase } from "../contentBase";

export class PartnerLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "partner-labels", competitionType);
  }

  public readonly organisationName = this.getContent("organisation-name");
  public readonly companyNumber = this.getContent("company-number");
  public readonly companyNumberHint = this.getContent("company-number-hint");
  public readonly sortCode = this.getContent("sort-code");
  public readonly sortCodeHint = this.getContent("sort-code-hint");
  public readonly accountNumber = this.getContent("account-number");
  public readonly accountNumberHint = this.getContent("account-number-hint");
  public readonly firstName = this.getContent("first-name");
  public readonly lastName = this.getContent("last-name");
  public readonly accountBuilding = this.getContent("account-building");
  public readonly accountStreet = this.getContent("account-street");
  public readonly accountLocality = this.getContent("account-locality");
  public readonly accountTownOrCity = this.getContent("account-town-or-city");
  public readonly accountPostcode = this.getContent("account-postcode");
}

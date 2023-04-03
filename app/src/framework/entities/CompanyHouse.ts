type ICompanyHouseDescriptionIdentifier =
  | "administration"
  | "closed-on"
  | "closed"
  | "converted-closed-on"
  | "dissolved-on"
  | "first-uk-establishment-opened-on"
  | "formed-on"
  | "incorporated-on"
  | "insolvency-proceedings"
  | "liquidation"
  | "opened-on"
  | "receivership"
  | "registered-on"
  | "voluntary-arrangement";

export type ICompanyHouseCompanyType =
  | "assurance-company"
  | "converted-or-closed"
  | "eeig"
  | "european-public-limited-liability-company-se"
  | "icvc-securities"
  | "icvc-umbrella"
  | "icvc-warrant"
  | "industrial-and-provident-society"
  | "investment-company-with-variable-capital"
  | "limited-partnership"
  | "llp"
  | "ltd"
  | "northern-ireland-other"
  | "northern-ireland"
  | "old-public-company"
  | "other"
  | "oversea-company"
  | "plc"
  | "private-limited-guarant-nsc-limited-exemption"
  | "private-limited-guarant-nsc"
  | "private-limited-shares-section-30-exemption"
  | "private-unlimited-nsc"
  | "private-unlimited"
  | "royal-charter"
  | "unregistered-company";

export type ICompanyHouseCompanyStatus =
  | "active"
  | "administration"
  | "converted-closed"
  | "dissolved"
  | "insolvency-proceedings"
  | "liquidation"
  | "receivership"
  | "voluntary-arrangement";

type ICompanyHouseCountry =
  | "England"
  | "Great Britain"
  | "Northern Ireland"
  | "Not specified"
  | "Scotland"
  | "United Kingdom"
  | "Wales";

export interface ICompanyHouse {
  address: {
    address_line_1: string;
    address_line_2?: string;
    care_of?: string;
    country?: ICompanyHouseCountry;
    locality?: string;
    premises?: string;
    po_box?: string;
    postal_code?: string;
    region?: string;
  };
  address_snippet: string;
  company_number: string;
  company_status: ICompanyHouseCompanyStatus;
  company_type: ICompanyHouseCompanyType;
  date_of_cessation?: Date;
  date_of_creation: Date;
  description?: string;
  description_identifier?: ICompanyHouseDescriptionIdentifier[];
  kind: string;
  links: {
    self?: string;
  };
  matches?: {
    address_snippet?: number[];
    snippet?: number[];
    title?: number[];
  };
  snippet?: string;
  title: string;
}

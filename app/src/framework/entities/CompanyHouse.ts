type ICompanyHouseDescriptionIdentifier =
  | "incorporated-on"
  | "registered-on"
  | "formed-on"
  | "dissolved-on"
  | "converted-closed-on"
  | "closed-on"
  | "closed"
  | "first-uk-establishment-opened-on"
  | "opened-on"
  | "voluntary-arrangement"
  | "receivership"
  | "insolvency-proceedings"
  | "liquidation"
  | "administration";

export type ICompanyHouseCompanyType =
  | "private-unlimited"
  | "ltd"
  | "plc"
  | "old-public-company"
  | "private-limited-guarant-nsc-limited-exemption"
  | "limited-partnership"
  | "private-limited-guarant-nsc"
  | "converted-or-closed"
  | "private-unlimited-nsc"
  | "private-limited-shares-section-30-exemption"
  | "assurance-company"
  | "oversea-company"
  | "eeig"
  | "icvc-securities"
  | "icvc-warrant"
  | "icvc-umbrella"
  | "industrial-and-provident-society"
  | "northern-ireland"
  | "northern-ireland-other"
  | "royal-charter"
  | "investment-company-with-variable-capital"
  | "unregistered-company"
  | "llp"
  | "other"
  | "european-public-limited-liability-company-se";

export type ICompanyHouseCompanyStatus =
  | "active"
  | "dissolved"
  | "liquidation"
  | "receivership"
  | "administration"
  | "voluntary-arrangement"
  | "converted-closed"
  | "insolvency-proceedings";

type ICompanyHouseCountry =
  | "Wales"
  | "England"
  | "Scotland"
  | "Great Britain"
  | "Not specified"
  | "United Kingdom"
  | "Northern Ireland";

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

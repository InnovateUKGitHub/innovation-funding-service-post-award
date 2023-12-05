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
  company_number: string;
  title: string;
}

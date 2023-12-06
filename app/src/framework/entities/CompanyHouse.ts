export interface ICompaniesHouseAddress {
  address_line_1: string;
  address_line_2?: string;
  care_of?: string;
  country?: string;
  locality?: string;
  premises?: string;
  po_box?: string;
  postal_code?: string;
  region?: string;
}

export interface ICompaniesHouseResponse {
  address: ICompaniesHouseAddress;
  company_number: string;
  title: string;
}

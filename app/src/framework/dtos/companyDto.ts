export interface CompanyDto {
  title: string;
  status?: string;
  registrationNumber: string;
  companyType: string;
  addressFull?: string;
  address?: {
    premises?: string;
    addressLine1?: string;
    addressLine2?: string;
    postcode?: string;
    locality?: string;
    region?: string;
  };
}

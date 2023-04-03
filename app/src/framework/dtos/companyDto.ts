export interface CompanyDto {
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    postcode?: string;
    premises?: string;
    region?: string;
  };
  addressFull?: string;
  companyType: string;
  registrationNumber: string;
  status?: string;
  title: string;
}

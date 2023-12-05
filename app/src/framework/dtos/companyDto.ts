export interface CompanyDto {
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    postcode?: string;
    premises?: string;
    region?: string;
    country?: string;
  };
  addressFull?: string;
  registrationNumber: string;
  title: string;
}

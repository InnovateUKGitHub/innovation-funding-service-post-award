export interface CompanyDto {
  address: {
    addressLine1: string;
    addressLine2: string;
    locality: string;
    postalCode: string;
    premises: string;
    region: string;
  };
  companyNumber: string;
  title: string;
}

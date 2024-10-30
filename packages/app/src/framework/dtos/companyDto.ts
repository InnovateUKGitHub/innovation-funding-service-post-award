export interface CompanyDto {
  address: GQL.Maybe<{
    addressLine1: GQL.Maybe<string>;
    addressLine2: GQL.Maybe<string>;
    locality: GQL.Maybe<string>;
    postcode: GQL.Maybe<string>;
    premises: GQL.Maybe<string>;
    region: GQL.Maybe<string>;
    country: GQL.Maybe<string>;
  }>;
  addressFull: GQL.Maybe<string>;
  registrationNumber: string;
  title: string;
}

import { CompanyDto } from "@framework/dtos/companyDto";
import { ICompanyHouse } from "@framework/entities/CompanyHouse";

export const trimmed = <T>(field: T): T | string => (typeof field === "string" ? field.trim() : field);

export const mapCompaniesHouse = (x: ICompanyHouse): CompanyDto => ({
  title: x.title,
  status: x.company_status ?? undefined,
  registrationNumber: trimmed(x.company_number),
  companyType: trimmed(x.company_type),
  addressFull: trimmed(x.address_snippet),
  address: x.address
    ? {
        premises: trimmed(x.address.premises),
        addressLine1: trimmed(x.address.address_line_1),
        addressLine2: trimmed(x.address.address_line_2),
        postcode: trimmed(x.address.postal_code),
        locality: trimmed(x.address.locality),
        region: trimmed(x.address.region),
      }
    : undefined,
});

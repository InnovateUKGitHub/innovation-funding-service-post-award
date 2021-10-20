import { CompanyDto } from "@framework/dtos/companyDto";
import { ICompanyHouse } from "@framework/entities/CompanyHouse";

export const mapCompaniesHouse = (x: ICompanyHouse): CompanyDto => ({
  title: x.title,
  status: x.company_status ?? undefined,
  registrationNumber: x.company_number.trim(),
  companyType: x.company_type.trim(),
  addressFull: x.address_snippet?.trim(),
  address: x.address
    ? {
        premises: x.address.premises?.trim(),
        addressLine1: x.address.address_line_1?.trim(),
        addressLine2: x.address.address_line_2?.trim(),
        postcode: x.address.postal_code?.trim(),
        locality: x.address.locality?.trim(),
        region: x.address.region?.trim(),
      }
    : undefined,
});

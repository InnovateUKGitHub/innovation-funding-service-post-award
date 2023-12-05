import { CompanyDto } from "@framework/dtos/companyDto";
import { ICompanyHouse } from "@framework/entities/CompanyHouse";

export const trimmed = <T>(field: T): T | string => (typeof field === "string" ? field.trim() : field);

export const mapCompaniesHouse = (x: ICompanyHouse): CompanyDto => {
  const registrationNumber = trimmed(x.company_number);
  const premises = trimmed(x.address?.premises);
  const addressLine1 = trimmed(x.address?.address_line_1);
  const addressLine2 = trimmed(x.address?.address_line_2);
  const postcode = trimmed(x.address?.postal_code);
  const locality = trimmed(x.address?.locality);
  const region = trimmed(x.address?.region);
  const country = trimmed(x.address?.country);

  // Re-create the company full address
  const addressFull = [`${premises ?? ""} ${addressLine1 ?? ""}`, addressLine2, locality, region, country, postcode]
    .filter<string>((x): x is string => typeof x === "string")
    .filter(x => x.length > 0)
    .map(x => x.trim())
    .join(", ");

  return {
    title: x.title,
    registrationNumber,
    address: x.address
      ? {
          premises,
          addressLine1,
          addressLine2,
          postcode,
          locality,
          region,
          country,
        }
      : undefined,
    addressFull: addressFull === "" ? undefined : addressFull,
  };
};

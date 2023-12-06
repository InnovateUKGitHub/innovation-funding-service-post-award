import { ICompaniesHouseResponse } from "@framework/entities/CompanyHouse";
import { mapCompaniesHouse } from "../../repositories/mapCompaniesHouse";

const sfDto = {
  address: {
    address_line_1: "1 Pipers Way",
    address_line_2: "by the roundabout",
    country: "England",
    locality: " Swindon",
    premises: "Wakefield House ",
    postal_code: "SN3 1AB",
    region: "South West",
  },
  company_number: "12345678",
  title: "Wizard Kings",
} as ICompaniesHouseResponse;

it("should map salesforce DTO into a POJO", () => {
  expect(mapCompaniesHouse(sfDto)).toEqual({
    address: {
      addressLine1: "1 Pipers Way",
      addressLine2: "by the roundabout",
      locality: "Swindon",
      postcode: "SN3 1AB",
      premises: "Wakefield House",
      region: "South West",
      country: "England",
    },
    addressFull: "Wakefield House 1 Pipers Way, by the roundabout, Swindon, South West, England, SN3 1AB",
    registrationNumber: "12345678",
    title: "Wizard Kings",
  });
});

it("should return undefined for address and status if nullish fields from sf", () => {
  // @ts-expect-error handling salesforce edge cases, but really if this can come back null then the dto interface should accept it
  expect(mapCompaniesHouse({ ...sfDto, address: undefined, company_status: null, address_snippet: undefined })).toEqual(
    {
      address: undefined,
      addressFull: undefined,
      registrationNumber: "12345678",
      title: "Wizard Kings",
    },
  );
});

it("should return undefined for missing address fields", () => {
  expect(mapCompaniesHouse({ ...sfDto, address: { ...sfDto.address, address_line_2: undefined } })).toEqual({
    address: {
      addressLine1: "1 Pipers Way",
      addressLine2: undefined,
      locality: "Swindon",
      postcode: "SN3 1AB",
      premises: "Wakefield House",
      region: "South West",
      country: "England",
    },
    addressFull: "Wakefield House 1 Pipers Way, Swindon, South West, England, SN3 1AB",
    registrationNumber: "12345678",
    title: "Wizard Kings",
  });
});

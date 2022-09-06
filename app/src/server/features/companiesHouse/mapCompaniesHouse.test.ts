import { ICompanyHouse } from "@framework/entities/CompanyHouse";
import { mapCompaniesHouse } from "./mapCompaniesHouse";

const sfDto: ICompanyHouse = {
  address: {
    address_line_1: "1 Pipers Way",
    address_line_2: "by the roundabout",
    country: "England",
    locality: " Swindon",
    premises: "Wakefield House ",
    postal_code: "SN3 1AB",
    region: "South West",
  },
  address_snippet: "1 Pipers Way, Swindon",
  company_number: "12345678",
  company_status: "active",
  company_type: "ltd",
  date_of_creation: new Date(2018, 4, 23),
  kind: "Magic",
  links: {},
  snippet: "Neil Little ate my lunch",
  title: "Wizard Kings",
};

it("should map salesforce DTO into a POJO", () => {
  expect(mapCompaniesHouse(sfDto)).toEqual({
    address: {
      addressLine1: "1 Pipers Way",
      addressLine2: "by the roundabout",
      locality: "Swindon",
      postcode: "SN3 1AB",
      premises: "Wakefield House",
      region: "South West",
    },
    addressFull: "1 Pipers Way, Swindon",
    companyType: "ltd",
    registrationNumber: "12345678",
    status: "active",
    title: "Wizard Kings",
  });
});

it("should return undefined for address and status if nullish fields from sf", () => {
  // @ts-expect-error handling salesforce edge cases, but really if this can come back null then the dto interface should accept it
  expect(mapCompaniesHouse({ ...sfDto, address: undefined, company_status: null, address_snippet: undefined })).toEqual(
    {
      address: undefined,
      addressFull: undefined,
      companyType: "ltd",
      registrationNumber: "12345678",
      status: undefined,
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
    },
    addressFull: "1 Pipers Way, Swindon",
    companyType: "ltd",
    registrationNumber: "12345678",
    status: "active",
    title: "Wizard Kings",
  });
});

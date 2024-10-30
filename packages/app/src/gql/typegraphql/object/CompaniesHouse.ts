import { ICompaniesHouseResponse, ICompaniesHouseAddress } from "@framework/entities/CompanyHouse";
import { mapCompaniesHouse } from "@server/repositories/mapCompaniesHouse";
import { Field, ObjectType } from "type-graphql";

@ObjectType("CompaniesHouseAddressObject")
class CompaniesHouseAddressObject implements ICompaniesHouseAddress {
  @Field(() => String, { name: "addressLine1", nullable: true })
  address_line_1!: string;

  @Field(() => String, { name: "addressLine2", nullable: true })
  address_line_2?: string;

  @Field(() => String, { nullable: true })
  care_of?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  locality?: string;

  @Field(() => String, { nullable: true })
  premises?: string;

  @Field(() => String, { nullable: true })
  po_box?: string;

  @Field(() => String, { name: "postcode", nullable: true })
  postal_code?: string;

  @Field(() => String, { name: "region", nullable: true })
  region?: string;
}

@ObjectType("CompaniesHouseObject")
class CompaniesHouseObject implements ICompaniesHouseResponse {
  @Field(() => String, { nullable: false })
  title!: string;

  @Field(() => String, { name: "registrationNumber", nullable: false })
  company_number!: string;

  @Field(() => CompaniesHouseAddressObject, { nullable: false })
  address!: CompaniesHouseAddressObject;

  @Field(() => String, { nullable: true })
  addressFull(): string {
    const { addressFull } = mapCompaniesHouse(this);
    return addressFull ?? "";
  }
}

export { CompaniesHouseObject };

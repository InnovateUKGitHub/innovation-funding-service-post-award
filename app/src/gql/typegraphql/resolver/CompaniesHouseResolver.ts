import { companiesHouse } from "@server/repositories/companiesRepository";
import { Arg, Int, Query, Resolver } from "type-graphql";
import { CompaniesHouseObject } from "../object/CompaniesHouse";

@Resolver()
class CompaniesHouseResolver {
  @Query(() => [CompaniesHouseObject])
  async companies(
    @Arg("query", () => String, { nullable: false }) searchString: string,
    @Arg("startIndex", () => Int, { nullable: true, defaultValue: 0 }) startIndex: number,
    @Arg("itemsPerPage", () => Int, { nullable: true, defaultValue: 5 }) itemsPerPage: number,
  ) {
    return companiesHouse.searchCompany({ searchString, itemsPerPage, startIndex });
  }
}

export { CompaniesHouseResolver };

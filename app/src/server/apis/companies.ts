import { CompanyDto } from "@framework/dtos/companyDto";
import { SearchCompaniesQuery } from "@server/features/companiesHouse/searchCompaniesQuery";
import { ICompaniesHouseParams } from "@server/resources/companiesHouse";
import { contextProvider } from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface ICompaniesApi<Context extends "client" | "server"> {
  searchCompany(params: ApiParams<Context, ICompaniesHouseParams>): Promise<CompanyDto[]>;
}

class CompaniesHouse extends ControllerBase<"server", CompanyDto> implements ICompaniesApi<"server"> {
  constructor() {
    super("companies");

    this.getItems(
      "/",
      (p, q) => ({
        searchString: q.searchString,
        itemsPerPage: parseInt(q.itemsPerPage, 10) || undefined,
        startIndex: parseInt(q.startIndex, 10) || undefined,
      }),
      this.searchCompany,
    );
  }

  public async searchCompany(params: ApiParams<"server", ICompaniesHouseParams>): Promise<CompanyDto[]> {
    const query = new SearchCompaniesQuery(params);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new CompaniesHouse();

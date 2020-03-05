import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { CompanyDto } from "@framework/dtos/companyDto";
import { SearchCompaniesQuery } from "@server/features/companiesHouse/searchCompaniesQuery";

export interface ICompaniesApi {
  searchCompany: (params: ApiParams<{ searchString: string, itemsPerPage: number, startIndex: number }>) => Promise<CompanyDto[]>;
}

class Controller extends ControllerBase<CompanyDto> implements ICompaniesApi {
  constructor() {
    super("companies");

    this.getItems("/", (p, q) => ({
      searchString: q.searchString,
      itemsPerPage: parseInt(q.itemsPerPage, 10) || undefined,
      startIndex: parseInt(q.startIndex, 10) || undefined,
    }), (p) => this.searchCompany(p));
  }

  public async searchCompany(params: ApiParams<{ searchString: string, itemsPerPage?: number, startIndex?: number }>) {
    const {searchString, startIndex, itemsPerPage} = params;
    const query = new SearchCompaniesQuery(searchString, itemsPerPage, startIndex);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();

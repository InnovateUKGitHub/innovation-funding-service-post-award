import { BadRequestError, Configuration, ConfigurationError } from "@server/features/common";
import { CompanyEntity } from "@framework/entities/company";

interface ICompany {
  address: {
    "address_line_1": string;
    "address_line_2": string;
    "locality": string;
    "postal_code": string;
    "premises": string;
    "region": string;
  };
  "company_number": string;
  title: string;
}

interface IResponse {
  results: {
    items: ICompany[];
  };
}
export interface ICompaniesHouse {
  searchCompany(searchString: string, itemsPerPage?: number, startIndex?: number): Promise<CompanyEntity[]>;
}

export class CompaniesHouse implements ICompaniesHouse {

  private getConnection() {
    if (!Configuration.sil.username || !Configuration.sil.password || !Configuration.sil.companiesHouseSearchUrl) {
      throw new ConfigurationError("Companies house access not configured");
    }
    const url = Configuration.sil.companiesHouseSearchUrl;
    const auth = Buffer.from(`${Configuration.sil.username}:${Configuration.sil.password}`).toString("base64");
    return {url, auth};
  }

  private getQueryParams(searchString: string, itemsPerPage?: number, startIndex?: number) {
    const params: {[key: string]: string | undefined | number} = {
      searchString,
      items_per_page: itemsPerPage,
      start_index: startIndex
    };

    return Object.keys(params)
      .filter(x => params[x] !== undefined && params[x] !== null)
      .map(x => `${x}=${params[x]}`)
      .join("&");
  }

  public searchCompany(searchString: string, itemsPerPage?: number, startIndex?: number): Promise<CompanyEntity[]> {
    const {url, auth} = this.getConnection();
    const getOptions = { headers: { Authorization: `Basic ${auth}` } };

    if (searchString === undefined || searchString === null) {
      throw new BadRequestError("Need to pass a search string");
    }

    const queryParams = this.getQueryParams(searchString, itemsPerPage, startIndex);

    return fetch(`${url}?${queryParams}`, getOptions)
      .then<IResponse>((result) => {
        if (result.ok) {
          return result.json();
        }
        throw new Error(`Failed get request to ${url}`);
      })
      .then(resp => { if (resp.results) {
        // SIL does not currently handle the itemsPerPage query param so this is a temp measure until it does
        if (itemsPerPage) {
          resp.results.items.splice(1, itemsPerPage);
        }
        return resp.results.items.map(x => ({
          address: {
            addressLine1: x.address.address_line_1,
            addressLine2: x.address.address_line_2,
            locality: x.address.locality,
            postalCode: x.address.postal_code,
            premises: x.address.premises,
            region: x.address.region
          },
          companyNumber: x.company_number,
          title: x.title
        }));
      } else {
        return [];
      }} );
  }
}

import { CompanyDto } from "@framework/dtos/companyDto";
import { isApiError } from "@framework/util/errorHelpers";
import { Logger } from "@shared/developmentLogger";
import { clientsideApiClient } from "@ui/apiClient";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { useDebounce } from "@ui/components/bjss/inputs/input-utils";
import { useApiErrorContext } from "@ui/context/api-error";
import { ReactNode, useRef, useState } from "react";

export const useUpdateCompaniesHouseResults = () => {
  const lastSearch = useRef<string>("");
  const serverRenderedApiError = useApiErrorContext();
  const [isFetchingCompanies, setIsFetchingCompanies] = useState(false);
  const [companyResults, setCompanyResults] = useState<(CompanyDto & { label: ReactNode })[]>([]);
  const [companiesHouseApiError, setApiError] = useState(serverRenderedApiError);

  const updateCompaniesHouseResults = useDebounce(
    async (searchString: string = "", itemsPerPage?: number, startIndex?: number) => {
      // if for whatever reason called with no change to search string, return current collection of results
      if (searchString === lastSearch.current) {
        return companyResults;
      }

      // if search string is empty, reset results
      if (!searchString) {
        setCompanyResults([]);
        return companyResults;
      }

      // fetch new list
      try {
        setIsFetchingCompanies(true);
        const res = await clientsideApiClient.companies.searchCompany({
          searchString,
          itemsPerPage,
          startIndex,
        });
        lastSearch.current = searchString;
        const resultsWithLabel = res.map(x => ({
          ...x,
          label: (
            <>
              <P className="govuk-!-margin-bottom-0">{x.title}</P>
              <P className="govuk-!-margin-bottom-0">{x.registrationNumber}</P>
              <P className="govuk-!-margin-bottom-0">{x.addressFull}</P>
            </>
          ),
        }));
        setCompanyResults(resultsWithLabel);
        setIsFetchingCompanies(false);
      } catch (e: unknown) {
        const logger = new Logger("updateCompaniesResults");
        setIsFetchingCompanies(false);

        logger.error("request error", e);
        if (isApiError(e)) {
          setApiError(e);
        }
      }
    },
  );

  return { isFetchingCompanies, companyResults, updateCompaniesHouseResults, companiesHouseApiError };
};

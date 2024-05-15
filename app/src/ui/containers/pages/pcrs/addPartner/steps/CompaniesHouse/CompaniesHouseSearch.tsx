import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { ErrorSummary } from "@ui/components/atomicDesign/molecules/ErrorSummary/ErrorSummary";
import { useContent } from "@ui/hooks/content.hook";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UseFormReset, useForm } from "react-hook-form";
import { useLazyLoadQuery } from "react-relay";
import { z } from "zod";
import { usePcrWorkflowContext } from "../../../pcrItemWorkflow";
import {
  PcrAddPartnerCompaniesHouseStepSchemaType,
  pcrAddPartnerCompaniesHouseStepSearchMaxLength,
} from "../schemas/companiesHouse.zod";
import { companiesHouseSearchQuery } from "./CompaniesHouseSearch.query";
import { useDefaultCompaniesHouseResult } from "./CompaniesHouseStep.logic";
import { CompaniesHouseSearchQuery } from "./__generated__/CompaniesHouseSearchQuery.graphql";

interface CompaniesHouseSearchProps {
  searchQuery?: string;
  setCompanyInfo: UseFormReset<z.output<PcrAddPartnerCompaniesHouseStepSchemaType>>;
}

interface CompaniesHouseSearchQueryProps {
  searchQuery: string;
  setCompanyInfo: UseFormReset<z.output<PcrAddPartnerCompaniesHouseStepSchemaType>>;
}

const CompaniesHouseSearchResults = ({ searchQuery, setCompanyInfo }: CompaniesHouseSearchQueryProps) => {
  const { getContent } = useContent();
  const { step, search: defaultSearchResult } = usePcrWorkflowContext();
  const defaultCompaniesHouseResult = useDefaultCompaniesHouseResult();
  const { isServer } = useMounted();
  const { register, handleSubmit, watch } = useForm<{
    companiesHouseResult: SerialisedProjectChangeRequestAddPartnerCompaniesHouseResult;
    search: string;
    step: number;
  }>();

  const data = useLazyLoadQuery<CompaniesHouseSearchQuery>(companiesHouseSearchQuery, { searchQuery });
  const radioValue = watch("companiesHouseResult");

  useEffect(() => {
    if (radioValue) {
      // We are using a serialised JSON string to allow for JS disabled,
      // since a radio option can only "remember" a single value.
      try {
        const selectedOption = JSON.parse(radioValue) as DeserialisedCompaniesHouseSearchData;
        setCompanyInfo({
          organisationName: selectedOption?.title,
          registeredAddress: selectedOption?.addressFull,
          registrationNumber: selectedOption?.registrationNumber,
        });
      } catch {}
    }
  }, [handleSubmit, radioValue, setCompanyInfo]);

  if (data.companies.length === 0) {
    return <P>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultNotShowing)}</P>;
  }

  return (
    <form method="GET">
      <Fieldset>
        <FormGroup>
          <h2 className="govuk-label-wrapper">
            <Label htmlFor="searchQuery" bold>
              {getContent(x => x.pages.pcrAddPartnerCompanyHouse.headingSearchResults)}
            </Label>
          </h2>
          {/* Re-fill the step number into the URL get params */}
          <input type="hidden" value={step} {...register("step")} />
          <input type="hidden" value={defaultSearchResult} {...register("search")} />
          <RadioList name="companiesHouseResult" register={register}>
            {data.companies.map(x => {
              return (
                <Radio
                  key={x.registrationNumber}
                  id={x.registrationNumber}
                  label={
                    <>
                      <span>{x.title}</span>
                      <br />
                      <span className="govuk-hint">
                        {x.registrationNumber}
                        <br />
                        {x.addressFull}
                      </span>
                    </>
                  }
                  defaultChecked={defaultCompaniesHouseResult?.registrationNumber === x.registrationNumber}
                  value={JSON.stringify(x) as SerialisedProjectChangeRequestAddPartnerCompaniesHouseResult}
                />
              );
            })}
          </RadioList>
        </FormGroup>
      </Fieldset>
      {isServer && (
        <Button type="submit" styling="Secondary">
          {getContent(x => x.pages.pcrAddPartnerCompanyHouse.buttonAutofill)}
        </Button>
      )}
    </form>
  );
};

const CompaniesHouseSearchQueryErrorBoundaryFallback = () => {
  return (
    <Fieldset>
      <FormGroup>
        <ErrorSummary />
      </FormGroup>
    </Fieldset>
  );
};

const CompaniesHouseSearch = ({ searchQuery, setCompanyInfo }: CompaniesHouseSearchProps) => {
  const { getContent } = useContent();

  if (
    typeof searchQuery === "string" &&
    searchQuery.length > 0 &&
    searchQuery.length <= pcrAddPartnerCompaniesHouseStepSearchMaxLength
  ) {
    return (
      <ErrorBoundary FallbackComponent={CompaniesHouseSearchQueryErrorBoundaryFallback}>
        <Suspense fallback={<P>{getContent(x => x.pages.pcrAddPartnerCompanyHouse.resultsLoading)}</P>}>
          <CompaniesHouseSearchResults searchQuery={searchQuery} setCompanyInfo={setCompanyInfo} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return null;
};

type DeserialisedCompaniesHouseSearchData = { title: string; registrationNumber: string; addressFull: string };

export { CompaniesHouseSearch };
export type { DeserialisedCompaniesHouseSearchData };

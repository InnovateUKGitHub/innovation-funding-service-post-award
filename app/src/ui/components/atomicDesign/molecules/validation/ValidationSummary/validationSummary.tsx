import { flatten } from "@framework/util/arrayHelpers";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { List } from "@ui/components/atomicDesign/atoms/List/list";
import { ResultsLinks } from "@ui/components/atomicDesign/atoms/validation/ValidationResultLinks/ValidationResultLinks";
import { useContent } from "@ui/hooks/content.hook";
import { ResultsLinks } from "./ValidationResultLinks";
import { NestedResult } from "@ui/validation/nestedResult";
import { Result } from "@ui/validation/result";
import { IValidationResult, Results } from "@ui/validation/results";

interface Props {
  validation?: IValidationResult | null;
  compressed?: boolean;
}

export const ValidationSummary = ({ validation, compressed }: Props) => {
  const { getContent } = useContent();

  const results: Result[] = [];
  populateResults();
  if (!results.length) {
    return null;
  }

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
      data-qa="validation-summary"
    >
      <H2 className="govuk-error-summary__title" id="error-summary-title">
        {getContent(x => x.components.validationSummary.title)}
      </H2>
      <div className="govuk-error-summary__body">
        <List className="govuk-error-summary__list">
          <ResultsLinks results={results} />
        </List>
      </div>
    </div>
  );

  /**
   * populate results array with validation
   */
  function populateResults(): void {
    if (validation && validation.errors) {
      validation.errors
        .filter(x => !x.isValid && x.showValidationErrors)
        .forEach(x => {
          // nested results have collection of items that may have errored
          // if we are not compressed we want to show each of them
          // need to find all invalid children and flatten them
          if (x instanceof NestedResult && compressed !== true && x.results.length) {
            if (!x.listValidation.isValid) {
              results.push(x.listValidation);
            } else {
              const childErrors = flatten(
                (x as NestedResult<Results<ResultBase>>).results.filter(y => !y.isValid).map(y => y.errors),
              );
              childErrors.forEach(e => results.push(e));
            }
          } else {
            results.push(x);
          }
        });
    }
  }
};

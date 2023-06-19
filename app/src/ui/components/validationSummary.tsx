import { flatten } from "@framework/util/arrayHelpers";
import { scrollToTheTagSmoothly } from "@framework/util/windowHelpers";
import { useContent } from "@ui/hooks/content.hook";
import { NestedResult } from "@ui/validation/nestedResult";
import { Result } from "@ui/validation/result";
import { IValidationResult, Results } from "@ui/validation/results";
import { useNavigate } from "react-router-dom";
import { List } from "./layout/list";
import { H2 } from "./typography/Heading.variants";

interface Props {
  validation?: IValidationResult | null;
  compressed?: boolean;
}

const prepareMessage = (errorMessage: string | null | undefined): React.ReactNode => {
  if (errorMessage && errorMessage.indexOf("\n") === 0) {
    return errorMessage;
  }

  if (errorMessage) {
    return errorMessage.split("\n").reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
  }

  return null;
};

export const ValidationSummary = ({ validation, compressed }: Props) => {
  const { getContent } = useContent();

  /**
   * creates links for the results
   */
  const ResultsLinks = ({ results }: { results: Result[] }) => {
    const navigate = useNavigate();

    return (
      <>
        {results.map(x => (
          <li key={x.key}>
            <a
              onClick={e => {
                e.preventDefault();
                scrollToTheTagSmoothly(x.key);
                navigate(`#${x.key}`, { replace: true });
              }}
              href={`#${x.key}`}
            >
              {prepareMessage(x.errorMessage)}
            </a>
          </li>
        ))}
      </>
    );
  };

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

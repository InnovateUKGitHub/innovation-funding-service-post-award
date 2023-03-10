import { v4 as uuid } from "uuid";
import { flatten } from "@framework/util/arrayHelpers";
import { useContent } from "@ui/hooks";
import { IValidationResult, NestedResult, Result, Results } from "../validation";
import { List } from "./layout";

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
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {getContent(x => x.components.validationSummary.title)}
      </h2>
      <div className="govuk-error-summary__body">
        <List className="govuk-error-summary__list">{createResultsLinks(results)}</List>
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

  /**
   * creates links for the results
   */
  function createResultsLinks(res: Result[]): JSX.Element[] {
    return res.map(x => (
      <li key={uuid()}>
        <a href={`#${x.key}`}>{prepareMessage(x.errorMessage)}</a>
      </li>
    ));
  }
};

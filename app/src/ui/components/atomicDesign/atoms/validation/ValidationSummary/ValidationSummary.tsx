import { useContent } from "@ui/hooks/content.hook";
import { ResultsLinks } from "@ui/components/atomicDesign/atoms/validation/ValidationResultLinks/ValidationResultLinks";
import { convertErrorFormatFromRhfForErrorSummary } from "@framework/util/errorHelpers";
import { List } from "@ui/components/atomicDesign/atoms/List/list";
interface Props {
  validationErrors?: RhfErrors;
  bailoutErrorNavigation?: boolean;
}

export const ValidationSummary = ({ validationErrors, bailoutErrorNavigation }: Props) => {
  const { getContent } = useContent();

  const results = convertErrorFormatFromRhfForErrorSummary(validationErrors);
  if (!results || !results.length) {
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
        <List className="govuk-error-summary__list">
          <ResultsLinks results={results} bailoutErrorNavigation={bailoutErrorNavigation} />
        </List>
      </div>
    </div>
  );
};

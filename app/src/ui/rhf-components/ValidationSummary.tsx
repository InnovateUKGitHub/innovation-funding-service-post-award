import { useContent } from "@ui/hooks/content.hook";
import { List } from "@ui/components/layout/list";
import { ResultsLinks } from "@ui/components/ValidationResultLinks";
import { convertErrorFormatFromRhfForErrorSummary } from "@framework/util/errorHelpers";

interface Props {
  validationErrors?: RhfErrors;
}

export const ValidationSummary = ({ validationErrors }: Props) => {
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
          <ResultsLinks results={results}></ResultsLinks>
        </List>
      </div>
    </div>
  );
};

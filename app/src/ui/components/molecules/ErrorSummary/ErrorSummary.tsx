import { ErrorCode } from "@framework/constants/enums";
import { IAppError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks/content.hook";
import { H2 } from "../../atoms/Heading/Heading.variants";
import { Info } from "../../atoms/Details/Details";
import { ErrorDetails } from "./ErrorDetails";
import { useClientConfig } from "@ui/context/ClientConfigProvider";

export interface ErrorSummaryProps {
  error?: Partial<IAppError>;
}

const StackTrace = ({ stack, cause }: Pick<IAppError, "stack" | "cause">) => {
  const nestedCause = cause as unknown as IAppError | null;

  return (
    <div className="ifspa-developer-stacktrace">
      <pre className="ifspa-developer-stacktrace-stack">{stack}</pre>
      {nestedCause && <StackTrace stack={nestedCause.stack} cause={nestedCause.cause} />}
    </div>
  );
};

export const ErrorSummary = ({ error = {} }: ErrorSummaryProps) => {
  const { code, details, stack, cause } = error;

  const { getContent } = useContent();
  const { features } = useClientConfig();
  const isUnauthenticated = code === ErrorCode.UNAUTHENTICATED_ERROR;

  const title = getContent(x => x.components.errorSummary.title);
  const expiredMessage = getContent(x => x.components.errorSummary.expiredMessage);
  const unsavedWarning = getContent(x => x.components.errorSummary.unsavedWarning);

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
      data-qa="error-summary"
    >
      <H2 className="govuk-error-summary__title" id="error-summary-title" data-qa="error-summary-title">
        {title}
      </H2>

      <div className="govuk-error-summary__body">
        {isUnauthenticated ? (
          <>
            <p data-qa="error-summary-expired-mssg">{expiredMessage}</p>
            <p data-qa="error-summary-unsaved-mssg">{unsavedWarning}</p>
          </>
        ) : (
          <p data-qa="error-summary-general-mssg">
            {Array.isArray(details)
              ? getContent(x => x.components.errorSummary.somethingGoneWrong)
              : getContent(x => x.components.errorSummary.somethingUnknownGoneWrong)}
          </p>
        )}

        {features.detailedErrorSummaryComponent && Array.isArray(details) && (
          <Info summary={getContent(x => x.components.errorSummary.info)} className="govuk-!-margin-bottom-0">
            <StackTrace cause={cause ?? null} stack={stack} />
            <ErrorDetails details={details} />
          </Info>
        )}
      </div>
    </div>
  );
};

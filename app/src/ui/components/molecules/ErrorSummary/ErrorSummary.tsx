import { ClientErrorResponse } from "@framework/util/errorHandlers";
import { DetailedErrorCode, ErrorCode } from "@framework/constants/enums";
import { GraphqlError, isGraphqlError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks/content.hook";
import { Info } from "../../atoms/Details/Details";
import { H2 } from "../../atoms/Heading/Heading.variants";
import { ErrorInformation } from "./ErrorInformation";

export interface ErrorSummaryProps {
  error?: ClientErrorResponse | GraphqlError;
}

export const ErrorSummary = ({ error = { traceId: null } }: ErrorSummaryProps) => {
  let code, details;
  if (isGraphqlError(error)) {
    code = DetailedErrorCode.ACC_GRAPHQL_ERROR;
    details = [{ code: DetailedErrorCode.ACC_GRAPHQL_ERROR, message: error.message }] as unknown as ClientErrorResponse;
  } else {
    code = error.code;
    details = error.details;
  }

  console.log("code", code, "details", details);

  const { getContent } = useContent();
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

        {error && (
          <Info summary={getContent(x => x.components.errorSummary.info)} className="govuk-!-margin-bottom-0">
            <ErrorInformation error={error as ClientErrorResponse} />
          </Info>
        )}
      </div>
    </div>
  );
};

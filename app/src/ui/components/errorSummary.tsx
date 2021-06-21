import { ErrorCode } from "@framework/constants";
import { IAppError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks";

export interface ErrorSummaryProps {
  code: IAppError["code"];
  message?: IAppError["message"];
}

export function ErrorSummary({ code, message }: ErrorSummaryProps) {
  const { getContent } = useContent();
  const isUnauthenticated = code === ErrorCode.UNAUTHENTICATED_ERROR;

  const title = getContent(x => x.components.errorSummary.errorTitle);
  const expiredMessage = getContent(x => x.components.errorSummary.expiredMessageContent);
  const unsavedWarning = getContent(x => x.components.errorSummary.unsavedWarningContent);
  const somethingGoneWrong = getContent(x => x.components.errorSummary.somethingGoneWrongContent);

  // Unique Errors
  const authErrorMessages = {
    SF_UPDATE_ALL_FAILURE: getContent(x => x.components.errorSummary.updateAllFailure),
  };

  const authWMessage = !isUnauthenticated && message && authErrorMessages[message as keyof typeof authErrorMessages];
  const errorMessage = authWMessage || somethingGoneWrong;

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
      data-qa="error-summary"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title" data-qa="error-summary-title">
        {title}
      </h2>

      <div className="govuk-error-summary__body">
        {isUnauthenticated ? (
          <>
            <p data-qa="error-summary-expired-mssg">{expiredMessage}</p>
            <p data-qa="error-summary-unsaved-mssg">{unsavedWarning}</p>
          </>
        ) : (
          <p data-qa="error-summary-general-mssg">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

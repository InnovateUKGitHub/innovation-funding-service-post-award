import { ErrorCode } from "@framework/constants";
import { IAppError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks";

export interface ErrorSummaryProps {
  code: IAppError["code"];
  message?: IAppError["message"];
}

export const ErrorSummary = ({ code, message }: ErrorSummaryProps) => {
  const { getContent } = useContent();
  const isUnauthenticated = code === ErrorCode.UNAUTHENTICATED_ERROR;

  const title = getContent(x => x.components.errorSummary.title);
  const expiredMessage = getContent(x => x.components.errorSummary.expiredMessage);
  const unsavedWarning = getContent(x => x.components.errorSummary.unsavedWarning);
  const somethingGoneWrong = getContent(x => x.components.errorSummary.somethingGoneWrong);

  // Unique Errors
  const authErrorMessages = {
    SF_UPDATE_ALL_FAILURE: getContent(x => x.components.errorSummary.updateAllFailure),
    INSUFFICIENT_ACCESS_OR_READONLY: getContent(x => x.components.errorSummary.insufficientAccessRights),
    NOT_UPLOADED_FROM_OWNER: getContent(x => x.components.errorSummary.notUploadedByOwner),
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
};

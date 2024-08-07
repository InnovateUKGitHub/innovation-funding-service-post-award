import { ClientErrorResponse } from "@server/errorHandlers";
import { ErrorDetails } from "./ErrorDetails";
import { useLocation } from "react-router-dom";
import { ErrorStacktrace } from "./ErrorStacktrace";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { DetailContentList } from "../DetailContentList/detailContentList";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { useContent } from "@ui/hooks/content.hook";

const ErrorInformation = ({ error }: { error: ClientErrorResponse }) => {
  const { getContent } = useContent();
  const { features } = useClientConfig();
  const location = useLocation();
  const { details, stack, cause, traceId } = error;

  return (
    <DetailContentList
      items={[
        {
          header: getContent(x => x.components.errorInformation.page),
          description: <SimpleString>{location.pathname}</SimpleString>,
        },
        {
          header: getContent(x => x.components.errorInformation.tid),
          description: <SimpleString>{traceId}</SimpleString>,
        },
        ...(error.message
          ? [
              {
                header: getContent(x => x.components.errorInformation.message),
                description: <SimpleString>{error.message}</SimpleString>,
              },
            ]
          : []),
        ...(features.detailedErrorSummaryComponent && Array.isArray(details) && details.length > 0
          ? [
              {
                header: getContent(x => x.components.errorInformation.details),
                description: <ErrorDetails details={details} />,
              },
            ]
          : []),
        ...(features.detailedErrorSummaryComponent && stack
          ? [
              {
                header: getContent(x => x.components.errorInformation.stacktrace),
                description: <ErrorStacktrace cause={cause ?? null} stack={stack} />,
              },
            ]
          : []),
      ]}
      qa="error-summary-information"
    />
  );
};

export { ErrorInformation };

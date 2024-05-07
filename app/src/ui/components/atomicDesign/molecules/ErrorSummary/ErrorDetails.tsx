import { DetailedErrorCode } from "@framework/constants/enums";
import { IAppDetailedError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks/content.hook";
import { UL } from "../../atoms/List/list";
import { Fragment } from "react";

interface ErrorDetailProps {
  details: IAppDetailedError[];
}

const ErrorDetails = ({ details }: ErrorDetailProps) => {
  const { getContent } = useContent();

  return (
    <UL>
      {details.map((detail, i) => {
        switch (detail.code) {
          case DetailedErrorCode.SFDC_STRING_TOO_LONG:
            if ("maximum" in detail && typeof detail.maximum !== "undefined") {
              return (
                <li key={i}>
                  {getContent(x => x.components.errorSummary.details.SFDC_STRING_TOO_LONG.too_big(detail))}
                </li>
              );
            }
          case DetailedErrorCode.SFDC_FIELD_CUSTOM_VALIDATION_EXCEPTION:
            if ("message" in detail && typeof detail.message !== "undefined") {
              return (
                <li key={i}>
                  {getContent(x =>
                    x.components.errorSummary.details.SFDC_FIELD_CUSTOM_VALIDATION_EXCEPTION[detail.message](detail),
                  )}
                </li>
              );
            }
          case DetailedErrorCode.ACC_GRAPHQL_ERROR:
            if ("data" in detail) {
              return (
                <Fragment key={i}>
                  {detail.data.map(([name, query]) => (
                    <li key={name}>
                      {getContent(x => x.components.errorSummary.details.ACC_GRAPHQL_ERROR.invalid)}
                      <br />
                      <pre>{JSON.stringify(query.errors, null, 2)}</pre>
                    </li>
                  ))}
                </Fragment>
              );
            }
          default:
            return <li key={i}>{getContent(x => x.components.errorSummary.details[detail.code].invalid(detail))}</li>;
        }
      })}
    </UL>
  );
};

export { ErrorDetails };

import { DetailedErrorCode } from "@framework/constants/enums";
import { IAppDetailedError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks/content.hook";
import { UL } from "../../atoms/List/list";

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
          default:
            return <li key={i}>{getContent(x => x.components.errorSummary.details[detail.code].invalid(detail))}</li>;
        }
      })}
    </UL>
  );
};

export { ErrorDetails };

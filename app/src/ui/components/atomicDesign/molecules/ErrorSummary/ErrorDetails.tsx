import { IAppDetailedError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks/content.hook";
import { UL } from "../../atoms/List/list";
import { DetailedErrorCode } from "@framework/constants/enums";
import { Content } from "../Content/content";

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
            if (typeof detail.maximum !== "undefined") {
              return (
                <li key={i}>
                  {getContent(x => x.components.errorSummary.details.SFDC_STRING_TOO_LONG.too_big(detail))}
                </li>
              );
            }
          default:
            return (
              <li key={i}>
                <Content value={x => x.components.errorSummary.details[detail.code].invalid(detail)} />
              </li>
            );
        }
      })}
    </UL>
  );
};

export { ErrorDetails };

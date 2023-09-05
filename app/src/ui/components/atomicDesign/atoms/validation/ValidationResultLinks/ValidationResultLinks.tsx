import { scrollToTheTagSmoothly } from "@framework/util/windowHelpers";
import { Result } from "@ui/validation/result";
import { useNavigate } from "react-router-dom";

type ValidationError = {
  key: string;
  message: string | null;
};

const isResultType = (error: Result | ValidationError): error is Result => "errorMessage" in error;

const prepareMessage = (errorMessage: string | null | undefined): React.ReactNode => {
  if (errorMessage && errorMessage.indexOf("\n") === 0) {
    return errorMessage;
  }

  if (errorMessage) {
    return errorMessage.split("\n").reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
  }

  return null;
};

/**
 * creates links for Error results so that they can link to the appropriate input element
 */
export const ResultsLinks = ({ results }: { results: (Result | ValidationError)[] }) => {
  const navigate = useNavigate();
  return (
    <>
      {results.map((x, i) => (
        <li key={i}>
          <a
            onClick={e => {
              e.preventDefault();
              scrollToTheTagSmoothly(x.key);
              navigate(`#${x.key}`, { replace: true });
            }}
            href={`#${x.key}`}
          >
            {prepareMessage(isResultType(x) ? x.errorMessage : x?.message)}
          </a>
        </li>
      ))}
    </>
  );
};

import { useEffect } from "react";
import { scrollToTheTopSmoothly } from "@framework/util";

/**
 * Wrapper SFC to add scrolling behaviour. Using this approach, rather than a hook allows
 * it to be used with class-based components
 */
const WithScrollToTopOnPropChange = ({
  children,
  propToScrollOn: propToScrollOn,
}: {
  children: React.ReactNode;
  propToScrollOn: boolean | number | string | undefined;
}) => {
  useEffect(() => {
    scrollToTheTopSmoothly();
  }, [propToScrollOn]);
  return <>{children}</>;
};

export default WithScrollToTopOnPropChange;

import classNames from "classnames";

type SpanAttributes = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Bold text component (`<span>`)
 */
export function Bold(props: SpanAttributes) {
  return <span {...props} className={classNames("govuk-!-font-weight-bold", props.className)} />;
}

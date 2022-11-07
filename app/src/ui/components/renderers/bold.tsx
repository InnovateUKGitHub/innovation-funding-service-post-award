type SpanAttributes = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Bold text component (`<span>`)
 */
export function Bold(props: SpanAttributes) {
  return <span {...props} className="govuk-!-font-weight-bold" />;
}

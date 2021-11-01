type SpanAttributes = React.HTMLAttributes<HTMLSpanElement>;

export function Bold(props: SpanAttributes) {
  return <span {...props} className="govuk-!-font-weight-bold" />;
}

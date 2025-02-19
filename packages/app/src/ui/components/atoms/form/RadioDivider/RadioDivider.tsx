import { useContent } from "@ui/hooks/content.hook";

const RadioDivider = () => {
  const { getContent } = useContent();
  return <div className="govuk-radios__divider">{getContent(x => x.forms.radio.divider)}</div>;
};

export { RadioDivider };

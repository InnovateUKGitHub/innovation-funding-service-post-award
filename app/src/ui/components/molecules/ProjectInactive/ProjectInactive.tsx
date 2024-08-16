import { useContent } from "@ui/hooks/content.hook";
import { Section } from "../Section/section";
import { SimpleString } from "../../atoms/SimpleString/simpleString";

export const ProjectInactive = () => {
  const { getContent } = useContent();

  const inactiveMessage = getContent(x => x.components.projectInactiveContent.projectInactiveMessage);

  return (
    <Section>
      <SimpleString>{inactiveMessage}</SimpleString>
    </Section>
  );
};

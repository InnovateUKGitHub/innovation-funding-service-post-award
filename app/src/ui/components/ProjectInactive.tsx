import { useContent } from "@ui/hooks/content.hook";
import { Section } from "./layout/section";
import { SimpleString } from "./renderers/simpleString";

export const ProjectInactive = () => {
  const { getContent } = useContent();

  const inactiveMessage = getContent(x => x.components.projectInactiveContent.projectInactiveMessage);

  return (
    <Section>
      <SimpleString>{inactiveMessage}</SimpleString>
    </Section>
  );
};

import { useContent } from "@ui/hooks";
import { SimpleString } from "./renderers";
import { Section } from "./layout";

export const ProjectInactive = () => {
  const { getContent } = useContent();

  const inactiveMessage = getContent(x => x.components.projectInactiveContent.projectInactiveMessage);

  return (
    <Section>
      <SimpleString>{inactiveMessage}</SimpleString>
    </Section>
  );
};

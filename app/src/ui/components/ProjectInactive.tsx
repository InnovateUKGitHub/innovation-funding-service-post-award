import { useContent } from "@ui/hooks";
import { SimpleString } from "./renderers";
import { Section } from ".";

export function ProjectInactive() {
  const { getContent } = useContent();
  return (
    <Section>
      <SimpleString>{getContent(x => x.components.projectInactiveContent.projectInactiveMessage)}</SimpleString>
    </Section>
  );
}

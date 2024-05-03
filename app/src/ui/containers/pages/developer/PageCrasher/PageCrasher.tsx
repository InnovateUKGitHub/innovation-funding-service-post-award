import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { useContent } from "@ui/hooks/content.hook";
import { DeveloperPageCrasherForbiddenPage } from "../PageCrasherForbidden.page";
import { FormCrasher } from "./FormCrasher";

const PageCrasher = () => {
  const { getContent } = useContent();

  return (
    <Section title={getContent(x => x.components.pageCrasher.sectionTitle)}>
      <FormCrasher />
      <H3>Access Control</H3>
      <a href={DeveloperPageCrasherForbiddenPage.routePath}>
        <Button styling="Secondary">{getContent(x => x.components.pageCrasher.accessControl)}</Button>
      </a>
    </Section>
  );
};

/**
 * A hidden button that crashes IFSPA in a specified way.
 *
 * @returns A React Component
 */
const HiddenPageCrasher = () => {
  const { getContent } = useContent();

  return (
    <Info summary={getContent(x => x.components.pageCrasher.sectionTitle)}>
      <PageCrasher />
    </Info>
  );
};

export { HiddenPageCrasher, PageCrasher };

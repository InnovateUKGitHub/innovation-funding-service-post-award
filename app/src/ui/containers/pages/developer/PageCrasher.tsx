import { createTypedForm } from "@ui/components/bjss/form/form";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { useContent } from "@ui/hooks/content.hook";
import { DeveloperPageCrasherPage } from "./PageCrasher.page";
import { DeveloperPageCrasherForbiddenPage } from "./PageCrasherForbidden.page";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";

const PageCrasherForm = createTypedForm();

const crashTypes = [
  "Error",
  "NotFoundError",
  "ForbiddenError",
  "InActiveProjectError",
  "BadRequestError",
  "UnauthenticatedError",
  "ConfigurationError",
  "FormHandlerError",
] as const;

const PageCrasher = () => {
  const { getContent } = useContent();

  return (
    <Section title={getContent(x => x.components.pageCrasher.sectionTitle)}>
      <PageCrasherForm.Form action={DeveloperPageCrasherPage.routePath} data={null}>
        {crashTypes.map(name => (
          <PageCrasherForm.Button name="crashType" value={name} key={name}>
            {getContent(x => x.components.pageCrasher.throw({ name }))}
          </PageCrasherForm.Button>
        ))}
      </PageCrasherForm.Form>
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

export { PageCrasher, HiddenPageCrasher };

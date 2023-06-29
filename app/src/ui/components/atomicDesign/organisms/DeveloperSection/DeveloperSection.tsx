import { LanguageChanger } from "@ui/containers/pages/developer/LanguageChanger";
import { HiddenPageCrasher } from "@ui/containers/pages/developer/PageCrasher";
import { HiddenProjectCreator } from "@ui/containers/pages/developer/ProjectCreator";
import { HiddenUserSwitcher } from "@ui/containers/pages/developer/UserSwitcher";
import { useContent } from "@ui/hooks/content.hook";
import { H3 } from "../../atoms/Heading/Heading.variants";
import { GovWidthContainer } from "../../atoms/GovWidthContainer/GovWidthContainer";

const DeveloperSection = () => {
  const { getContent } = useContent();
  return (
    <div className="ifspa-developer-section">
      <GovWidthContainer>
        <H3 as="h2" className="govuk-footer__heading">
          {getContent(x => x.site.developer.heading)}
        </H3>
        <HiddenUserSwitcher />
        <HiddenProjectCreator />
        <HiddenPageCrasher />
        <LanguageChanger />
      </GovWidthContainer>
    </div>
  );
};
export { DeveloperSection };

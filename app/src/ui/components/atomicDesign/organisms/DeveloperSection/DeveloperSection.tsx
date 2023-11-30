import { LanguageChanger } from "@ui/containers/pages/developer/LanguageChanger";
import { HiddenPageCrasher } from "@ui/containers/pages/developer/PageCrasher";
import { HiddenUserSwitcher } from "@ui/containers/pages/developer/UserSwitcher";
import { useContent } from "@ui/hooks/content.hook";
import { H3 } from "../../atoms/Heading/Heading.variants";
import { GovWidthContainer } from "../../atoms/GovWidthContainer/GovWidthContainer";
import { AnyRouteDefinition } from "@ui/containers/containerBase";
import { DeveloperEnvironmentInformation } from "../../molecules/DeveloperEnvironmentInformation/DeveloperEnvironmentInformation";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";

interface DeveloperSectionProps {
  currentRoute: AnyRouteDefinition;
}

const DeveloperSection = ({ currentRoute }: DeveloperSectionProps) => {
  const { getContent } = useContent();
  const { ssoEnabled } = useClientConfig();

  return (
    <div className="ifspa-developer-section">
      <GovWidthContainer>
        <H3 as="h2" className="govuk-footer__heading">
          {getContent(x => x.site.developer.heading)}
        </H3>
        <DeveloperEnvironmentInformation currentRoute={currentRoute} />
        {!ssoEnabled && <HiddenUserSwitcher />}
        <HiddenPageCrasher />
        <LanguageChanger />
      </GovWidthContainer>
    </div>
  );
};
export { DeveloperSection };

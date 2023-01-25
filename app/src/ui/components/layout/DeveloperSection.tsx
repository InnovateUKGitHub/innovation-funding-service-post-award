import { HiddenPageCrasher } from "@ui/containers/developer/PageCrasher";
import { HiddenProjectCreator } from "@ui/containers/developer/ProjectCreator";
import { HiddenUserSwitcher } from "@ui/containers/developer/UserSwitcher";
import { useContent } from "@ui/hooks";
import { H3 } from "../typography";
import { GovWidthContainer } from "./GovWidthContainer";

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
      </GovWidthContainer>
    </div>
  );
};
export { DeveloperSection };

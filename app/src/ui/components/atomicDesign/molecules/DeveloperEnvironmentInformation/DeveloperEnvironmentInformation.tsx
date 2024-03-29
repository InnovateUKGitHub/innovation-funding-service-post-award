import { AccEnvironment } from "@framework/constants/enums";
import { useClientConfig } from "@ui/components/providers/ClientConfigProvider";
import { DeveloperCurrentUsername } from "../../atoms/DeveloperCurrentUsername/DeveloperCurrentUsername";
import { useMounted } from "../../atoms/providers/Mounted/Mounted";
import { SummaryList, SummaryListItem } from "../SummaryList/summaryList";
import { AnyRouteDefinition } from "@ui/containers/containerBase";

interface DeveloperEnvironmentInformationProps {
  currentRoute: AnyRouteDefinition;
}

const DeveloperEnvironmentInformation = ({ currentRoute }: DeveloperEnvironmentInformationProps) => {
  const { accEnvironment } = useClientConfig();
  const { isClient } = useMounted();

  if (accEnvironment === AccEnvironment.PROD) return null;

  return (
    <SummaryList>
      <SummaryListItem label={x => x.components.developerEnvironmentInformation.environment} content={accEnvironment} />
      <SummaryListItem
        label={x => x.components.developerEnvironmentInformation.route}
        content={currentRoute.routeName}
      />
      <SummaryListItem
        label={x => x.components.developerEnvironmentInformation.user}
        content={<DeveloperCurrentUsername />}
      />
      <SummaryListItem
        qa={isClient ? "react-loaded-indicator" : "react-not-loaded-indicator"}
        label={x => x.components.developerEnvironmentInformation.react}
        content={isClient ? "Loaded" : "Not Loaded"}
      />
    </SummaryList>
  );
};

export { DeveloperEnvironmentInformation };

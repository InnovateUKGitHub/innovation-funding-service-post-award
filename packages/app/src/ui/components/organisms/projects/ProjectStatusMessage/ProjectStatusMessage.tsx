import { projectStatusFragment } from "@gql/fragment/ProjectStatusFragment";
import { ProjectStatusFragment$key } from "@gql/fragment/__generated__/ProjectStatusFragment.graphql";
import { useContent } from "@ui/hooks/content.hook";
import { useFragment } from "react-relay";
import { Section } from "../../../molecules/Section/section";
import { ValidationMessage } from "../../../molecules/validation/ValidationMessage/ValidationMessage";

interface Props {
  project: ProjectStatusFragment$key;
}

const ProjectStatusMessage = ({ project }: Props) => {
  const data = useFragment(projectStatusFragment, project);
  const { getContent } = useContent();

  let messaging: string | undefined;

  if (data.Acc_ProjectStatus__c?.value === "On Hold") {
    messaging = getContent(x => x.components.projectInactiveContent.projectOnHoldMessage);
  }

  if (messaging) {
    return (
      <Section>
        <ValidationMessage messageType="info" qa="on-hold-info-message" message={messaging} />
      </Section>
    );
  }

  return null;
};

export { ProjectStatusMessage };

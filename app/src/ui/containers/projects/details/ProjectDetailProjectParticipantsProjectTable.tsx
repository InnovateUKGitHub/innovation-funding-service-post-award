import { getDefinedEdges } from "@shared/toArray";
import { Section } from "@ui/components/layout/section";
import { TypedTable } from "@ui/components/table";
import { useContent } from "@ui/hooks";
import { ReactNode } from "react";
import { useFragment } from "relay-hooks";
import { projectDetailProjectParticipantsProjectTableFragment } from "./ProjectDetailProjectParticipantsProjectTable.fragment";
import {
  ProjectDetailProjectParticipantsProjectTableFragment$data,
  ProjectDetailProjectParticipantsProjectTableFragment$key,
} from "./__generated__/ProjectDetailProjectParticipantsProjectTableFragment.graphql";

const ParticipantsTable =
  TypedTable<
    NonNullable<
      UnwrapArray<
        NonNullable<
          ProjectDetailProjectParticipantsProjectTableFragment$data["Acc_ProjectParticipantsProject__r"]
        >["edges"]
      >
    >
  >();

const ProjectDetailProjectParticipantsProjectTable = ({
  project,
  beforeContent,
  afterContent,
}: {
  project: ProjectDetailProjectParticipantsProjectTableFragment$key;
  beforeContent?: ReactNode;
  afterContent?: ReactNode;
}) => {
  const { getContent } = useContent();
  const data = useFragment<ProjectDetailProjectParticipantsProjectTableFragment$key>(
    projectDetailProjectParticipantsProjectTableFragment,
    project,
  );

  const projectParticipants = getDefinedEdges(data?.Acc_ProjectParticipantsProject__r?.edges);

  return (
    <Section title={x => x.projectLabels.partners}>
      {beforeContent}
      <ParticipantsTable.Table qa="partner-information" data={projectParticipants}>
        <ParticipantsTable.String
          header={x => x.projectContactLabels.partnerName}
          value={x => x.node?.Acc_AccountId__r?.Name?.value ?? ""}
          qa="pp-partner-name"
        />
        <ParticipantsTable.String
          header={x => x.projectContactLabels.contactName}
          value={x => x.node?.Acc_ParticipantType__c?.value ?? ""}
          qa="pp-participant-type"
        />
        <ParticipantsTable.String
          header={x => x.projectContactLabels.contactEmail}
          value={x => x.node?.Acc_ParticipantStatus__c?.value ?? ""}
          qa="pp-participant-status"
        />
        <ParticipantsTable.String
          header={x => x.projectContactLabels.fundingType}
          value={x =>
            typeof x.node?.Acc_NonfundedParticipant__c?.value === "boolean"
              ? getContent(c =>
                  x.node?.Acc_NonfundedParticipant__c?.value
                    ? c.projectContactLabels.nonFundedLabel
                    : c.projectContactLabels.fundedLabel,
                )
              : ""
          }
          qa="pp-funding-status"
        />
        <ParticipantsTable.String
          header={x => x.projectContactLabels.partnerPostcode}
          value={x => x.node?.Acc_Postcode__c?.value ?? ""}
          qa="pp-funding-status"
        />
      </ParticipantsTable.Table>
      {afterContent}
    </Section>
  );
};

export { ProjectDetailProjectParticipantsProjectTable };

import { getDefinedEdges } from "@gql/selectors/edges";
import { Link } from "@ui/components/links";
import { Section } from "@ui/components/layout/section";
import { createTypedTable } from "@ui/components/table";
import { useContent } from "@ui/hooks";
import { ReactNode } from "react";
import { useFragment } from "relay-hooks";
import { projectDetailProjectParticipantsProjectTableFragment } from "./ProjectDetailProjectParticipantsProjectTable.fragment";
import {
  ProjectDetailProjectParticipantsProjectTableFragment$data,
  ProjectDetailProjectParticipantsProjectTableFragment$key,
} from "./__generated__/ProjectDetailProjectParticipantsProjectTableFragment.graphql";
import { PartnerDetailsRoute } from "../partnerDetails.page";

const ParticipantsTable =
  createTypedTable<
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
        <ParticipantsTable.Custom
          header={x => x.projectContactLabels.partnerName}
          value={x => {
            const partnerName =
              x.node?.Acc_AccountId__r?.Name?.value ?? getContent(y => y.pages.projectDetails.unknownPartner);

            const displayValue =
              x.node?.Id === data.Acc_LeadParticipantID__c?.value
                ? getContent(y => y.pages.projectDetails.leadPartner({ name: partnerName }))
                : partnerName;

            const isLinkable = x.node?.Id !== undefined;

            if (isLinkable) {
              return (
                <Link
                  route={PartnerDetailsRoute.getLink({
                    projectId: data.Id as ProjectId,
                    partnerId: x.node.Id as PartnerId,
                  })}
                >
                  {displayValue}
                </Link>
              );
            } else {
              return displayValue;
            }
          }}
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

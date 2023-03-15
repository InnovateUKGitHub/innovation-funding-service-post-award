import { getDefinedEdges } from "@gql/selectors/edges";
import { Section } from "@ui/components/layout/section";
import { TypedTable } from "@ui/components/table";
import { SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { ReactNode } from "react";
import { useFragment } from "relay-hooks";
import { projectDetailprojectContactLinkTableFragment } from "./ProjectDetailProjectContactLinkTable.fragment";
import {
  ProjectDetailProjectContactLinkTableFragment$data,
  ProjectDetailProjectContactLinkTableFragment$key,
} from "./__generated__/ProjectDetailProjectContactLinkTableFragment.graphql";

const kebab = (label: string) => label.replace(" ", "-").toLowerCase();

const PartnersTable =
  TypedTable<
    NonNullable<
      UnwrapArray<NonNullable<ProjectDetailProjectContactLinkTableFragment$data["Project_Contact_Links__r"]>["edges"]>
    >
  >();

const ProjectDetailProjectContactLinkTable = ({
  project,
  partnerTypeWhitelist,
  partnerTypeBlacklist,
  beforeContent,
  afterContent,
  hideIfNoContactsFound = false,
  hidePartnerColumn = false,
}: {
  project: ProjectDetailProjectContactLinkTableFragment$key;
  partnerTypeWhitelist?: string[];
  partnerTypeBlacklist?: string[];
  beforeContent?: ReactNode;
  afterContent?: ReactNode;
  hideIfNoContactsFound?: boolean;
  hidePartnerColumn?: boolean;
  leadParticipantId?: string;
}) => {
  const { getContent } = useContent();
  const data = useFragment<ProjectDetailProjectContactLinkTableFragment$key>(
    projectDetailprojectContactLinkTableFragment,
    project,
  );

  if (!data.Project_Contact_Links__r?.edges) {
    return <SimpleString>No contacts exist under this category.</SimpleString>;
  }

  let pcl = getDefinedEdges(data.Project_Contact_Links__r.edges);
  if (partnerTypeWhitelist) pcl = pcl.filter(x => partnerTypeWhitelist.includes(x.node.Acc_Role__c?.value || ""));
  if (partnerTypeBlacklist) pcl = pcl.filter(x => !partnerTypeBlacklist.includes(x.node.Acc_Role__c?.value || ""));

  let sectionName: string;

  if (partnerTypeWhitelist?.length === 1)
    switch (partnerTypeWhitelist[0]) {
      case "Monitoring officer":
        sectionName = getContent(x => x.projectLabels.monitoringOfficers({ count: pcl.length }));
        break;
      case "Project Manager":
        sectionName = getContent(x => x.projectLabels.projectManagers({ count: pcl.length }));
        break;
      case "Finance contact":
        sectionName = getContent(x => x.projectLabels.financeContacts({ count: pcl.length }));
        break;
      case "IPM":
        sectionName = getContent(x => x.projectLabels.ipms({ count: pcl.length }));
        break;
      case "Innovation lead":
        sectionName = getContent(x => x.projectLabels.innovationLeads({ count: pcl.length }));
        break;
      default:
        sectionName = getContent(x => x.projectLabels.otherContacts);
    }
  else {
    sectionName = getContent(x => x.projectLabels.otherContacts);
  }

  if (pcl.length === 0) {
    if (hideIfNoContactsFound) {
      return null;
    } else {
      return (
        <Section title={sectionName}>
          <SimpleString>{getContent(x => x.projectContactLabels.noContactsMessage)}</SimpleString>
        </Section>
      );
    }
  }

  return (
    <Section title={sectionName}>
      {beforeContent}
      <PartnersTable.Table qa={`partner-information-${kebab(sectionName)}`} data={pcl}>
        <PartnersTable.String
          header={x => x.projectContactLabels.contactName}
          value={x =>
            x.node?.Acc_ContactId__r?.Name?.value ??
            x.node?.Acc_UserId__r?.Name?.value ??
            getContent(x => x.pages.projectDetails.unknownName)
          }
          qa="pcl-contact-name"
        />
        {/* If there is no single-role whitelist, show the roles column. */}
        {partnerTypeWhitelist?.length !== 1 ? (
          <PartnersTable.String
            header={x => x.projectContactLabels.roleName}
            value={x => x.node?.Acc_Role__c?.value ?? getContent(x => x.pages.projectDetails.unknownRole)}
            qa="pcl-role-name"
          />
        ) : null}
        {hidePartnerColumn ? null : (
          <PartnersTable.String
            header={x => x.projectContactLabels.partnerName}
            value={x => {
              const partnerName =
                x.node?.Acc_AccountId__r?.Name?.value ?? getContent(y => y.pages.projectDetails.unknownPartner);

              return x.node?.Acc_AccountId__r?.Id === data.Acc_LeadParticipantID__c?.value
                ? getContent(y => y.pages.projectDetails.leadPartner({ name: partnerName }))
                : partnerName;
            }}
            qa="pcl-partner-name"
          />
        )}
        <PartnersTable.Email
          header={x => x.projectContactLabels.contactEmail}
          value={x => x.node?.Acc_EmailOfSFContact__c?.value ?? ""}
          qa="pcl-email"
        />
      </PartnersTable.Table>
      {afterContent}
    </Section>
  );
};

export { ProjectDetailProjectContactLinkTable };

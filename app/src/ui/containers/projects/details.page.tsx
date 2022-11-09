import { getAuthRoles, PartnerDto, ProjectContactDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { getPlural } from "@ui/helpers/plurals";
import { useProjectStatus } from "@ui/hooks";
import { useRoutes, useStores } from "@ui/redux";
import { BaseProps, defineRoute } from "../containerBase";

interface Params {
  projectId: string;
}

interface Props {
  project: ProjectDto;
  partners: PartnerDto[];
  contacts: ProjectContactDto[];
}

interface ContactsProps {
  contacts: ProjectContactDto[];
}

type ProjectContactRole = ProjectContactDto["role"];

const useRoles = () => {
  const stores = useStores();
  const primaryRoles: ProjectContactRole[] = ["Monitoring officer", "Project Manager"];

  if (stores.config.getConfig().features.displayOtherContacts) {
    primaryRoles.push("Innovation lead", "IPM");
  }

  // Note: Excluded roles are already rendered elsewhere on page
  const excludedOtherRoles: ProjectContactRole[] = [...primaryRoles, "Finance contact"];

  return {
    primaryRoles,
    excludedOtherRoles,
  };
};

const PrimaryContactProjectDetailsComponent = ({ project, partners, contacts }: Props) => {
  const { isKTP } = checkProjectCompetition(project.competitionType);
  const { primaryRoles } = useRoles();

  const projectContacts = primaryRoles.map((role: ProjectContactRole) => {
    // Note: kebabCase the role name, this saves manually crafting a string
    const qa = role.replace(/\s+/g, "-").toLowerCase();
    const contact = contacts.find(x => x.role === role);
    const partner = contact && partners.find(x => x.accountId === contact.accountId);
    let comment;

    if (!isKTP && role === "Project Manager") {
      comment = <ACC.Content value={x => x.pages.projectDetails.projectManagerInfo} />;
    }

    return {
      qa,
      contact,
      partner,
      comment,
    };
  });

  return (
    <>
      {projectContacts.map(contact => (
        <ACC.ProjectContact key={contact.qa} {...contact} />
      ))}
    </>
  );
};

const OtherContactProjectDetailsComponent = ({ contacts }: ContactsProps) => {
  const stores = useStores();
  const { excludedOtherRoles } = useRoles();

  if (!stores.config.getConfig().features.displayOtherContacts) return null;

  const otherContacts = contacts.filter(x => excludedOtherRoles.indexOf(x.role) === -1);

  return (
    <ACC.Section title={x => x.projectLabels.otherContacts} qa="other-contacts-table">
      <ACC.Partners.ContactsTable contacts={otherContacts} />
    </ACC.Section>
  );
};

const PartnerName = ({ project, partner }: { project: ProjectDto; partner: PartnerDto }) => {
  const partnerName = ACC.getPartnerName(partner, true);
  const projectStatus = useProjectStatus();
  const routes = useRoutes();

  if (projectStatus.isActive) {
    return (
      <ACC.Link
        route={routes.partnerDetails.getLink({
          projectId: project.id,
          partnerId: partner.id,
        })}
      >
        {partnerName}
      </ACC.Link>
    );
  }

  return <>{partnerName}</>;
};

const PartnerInformationTable = ({ project, partners }: { project: ProjectDto; partners: PartnerDto[] }) => {
  const PartnersTable = ACC.TypedTable<PartnerDto>();
  const { isPmOrMo } = getAuthRoles(project.roles);

  return (
    <ACC.Section title={x => x.projectLabels.partners}>
      <PartnersTable.Table qa="partner-information" data={partners}>
        <PartnersTable.Custom
          header={x => x.pages.partnerDetails.projectContactLabels.partnerName}
          value={x => <PartnerName project={project} partner={x} />}
          qa="partner-name"
        />
        <PartnersTable.String header={x => x.projectContactLabels.partnerType} value={x => x.type} qa="partner-type" />
        {isPmOrMo ? (
          <PartnersTable.String
            header={x => x.projectContactLabels.status}
            value={x => x.partnerStatusLabel}
            qa="partner-status"
          />
        ) : null}
        {isPmOrMo ? (
          <PartnersTable.Custom
            header={x => x.projectContactLabels.fundingType}
            value={p => (
              <ACC.Content
                value={x =>
                  p.isNonFunded ? x.projectContactLabels.nonFundedLabel : x.projectContactLabels.fundedLabel
                }
              />
            )}
            qa="partner-funding"
          />
        ) : null}
        <PartnersTable.String
          header={x => x.projectContactLabels.partnerPostcode}
          value={x => x.postcode}
          qa="partner-postcode"
        />
      </PartnersTable.Table>
    </ACC.Section>
  );
};

const ProjectDetailsComponent = ({ project, partners, contacts }: Props) => {
  const { isLoans } = checkProjectCompetition(project.competitionType);
  const routes = useRoutes();

  // Note: Partners is reused avoid destructing - all partners will have the same competitionName at this UI
  const competitionName = partners[0].competitionName;

  return (
    <ACC.Page
      backLink={<ACC.Projects.ProjectBackLink project={project} routes={routes} />}
      pageTitle={<ACC.Projects.Title {...project} />}
      project={project}
    >
      <ACC.Section
        qa="period-information"
        title={x =>
          x.projectMessages.currentPeriodInfo({
            currentPeriod: project.periodId,
            numberOfPeriods: project.numberOfPeriods,
          })
        }
        subtitle={<ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />}
      />

      <ACC.Section title={x => x.projectLabels.projectMembers}>
        <PrimaryContactProjectDetailsComponent project={project} partners={partners} contacts={contacts} />

        <ACC.Section title={x => x.projectLabels.financeContacts}>
          <ACC.PartnersAndFinanceContacts
            contacts={contacts}
            partners={partners}
            comment={
              <SimpleString>
                <ACC.Content value={x => x.pages.projectDetails.financeContactInfo} />
              </SimpleString>
            }
            footnote={
              <SimpleString>
                <ACC.Content
                  value={x => x.pages.projectDetails.changeInfo}
                  components={[<ACC.EmailContent key="email" value={x => x.pages.projectDetails.changeEmail} />]}
                />
              </SimpleString>
            }
          />
        </ACC.Section>

        <OtherContactProjectDetailsComponent contacts={contacts} />
      </ACC.Section>

      <PartnerInformationTable project={project} partners={partners} />

      <ACC.Section title={<ACC.Content value={x => x.projectLabels.projectInformation} />} qa="project-details">
        <ACC.SummaryList qa="project-information">
          {competitionName && (
            <ACC.SummaryListItem
              label={x => x.projectLabels.competitionName}
              qa="competition-name"
              content={<ACC.Renderers.SimpleString>{competitionName}</ACC.Renderers.SimpleString>}
            />
          )}

          <ACC.SummaryListItem
            label={x => x.projectLabels.competitionType}
            qa="competition-type"
            content={<ACC.Renderers.SimpleString>{project.competitionType}</ACC.Renderers.SimpleString>}
          />

          <ACC.SummaryListItem
            label={x => x.projectLabels.startDate}
            qa="start-date"
            content={<ACC.Renderers.FullDate value={project.startDate} />}
          />

          <ACC.SummaryListItem
            label={x => x.projectLabels.endDate}
            qa="end-date"
            content={<ACC.Renderers.FullDate value={isLoans ? project.loanEndDate : project.endDate} />}
          />

          {isLoans ? (
            <>
              <ACC.SummaryListItem
                qa="availability-period"
                label={x => x.projectLabels.availabilityPeriod}
                content={
                  <ACC.Renderers.SimpleString>
                    {getPlural("month", project.loanAvailabilityPeriodLength)}
                  </ACC.Renderers.SimpleString>
                }
              />
              <ACC.SummaryListItem
                qa="extension-period"
                label={x => x.projectLabels.extensionPeriod}
                content={
                  <ACC.Renderers.SimpleString>
                    {getPlural("month", project.loanExtensionPeriodLength)}
                  </ACC.Renderers.SimpleString>
                }
              />
              <ACC.SummaryListItem
                qa="repayment-period"
                label={x => x.projectLabels.repaymentPeriod}
                content={
                  <ACC.Renderers.SimpleString>
                    {getPlural("month", project.loanRepaymentPeriodLength)}
                  </ACC.Renderers.SimpleString>
                }
              />
            </>
          ) : (
            <>
              <ACC.SummaryListItem
                label={x => x.projectLabels.duration}
                qa="duration"
                content={getPlural("month", project.durationInMonths)}
              />

              <ACC.SummaryListItem
                label={x => x.projectLabels.numberOfPeriods}
                qa="periods"
                content={project.numberOfPeriods}
              />
            </>
          )}

          <ACC.SummaryListItem
            label={x => x.projectLabels.scope}
            qa="scope"
            content={<ACC.Renderers.SimpleString multiline>{project.summary}</ACC.Renderers.SimpleString>}
          />
        </ACC.SummaryList>
      </ACC.Section>
    </ACC.Page>
  );
};

const ProjectDetailsContainer = (props: Params & BaseProps) => {
  const stores = useStores();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partners: stores.partners.getPartnersForProject(props.projectId),
    contacts: stores.contacts.getAllByProjectId(props.projectId),
  });

  return <ACC.PageLoader pending={combined} render={x => <ProjectDetailsComponent {...x} />} />;
};

export const ProjectDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDetails",
  routePath: "/projects/:projectId/details",
  container: ProjectDetailsContainer,
  getParams: r => ({ projectId: r.params.projectId }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectDetails.title),
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});

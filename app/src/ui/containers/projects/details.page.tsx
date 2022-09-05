import { getAuthRoles, PartnerDto, ProjectContactDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { getPlural } from "@ui/helpers/plurals";
import { useStores } from "@ui/redux";
import { GetProjectStatus } from "../app/project-active";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  contacts: Pending<ProjectContactDto[]>;
}

interface Params {
  projectId: string;
}

interface Callbacks {}

interface CombinedData {
  project: ProjectDto;
  partners: PartnerDto[];
  contacts: ProjectContactDto[];
}

type ProjectContactRole = ProjectContactDto["role"];

class ProjectDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partners: this.props.partners,
      contacts: this.props.contacts,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private getRoles() {
    const primaryRoles: ProjectContactRole[] = ["Monitoring officer", "Project Manager"];

    if (this.props.config.features.displayOtherContacts) {
      primaryRoles.push("Innovation lead", "IPM");
    }

    // Note: Excluded roles are already rendered elsewhere on page
    const excludedOtherRoles: ProjectContactRole[] = [...primaryRoles, "Finance contact"];

    return {
      primaryRoles,
      excludedOtherRoles,
    };
  }

  private renderPrimaryContacts({ project, partners, contacts }: CombinedData) {
    const { isKTP } = checkProjectCompetition(project.competitionType);
    const { primaryRoles } = this.getRoles();

    const projectContacts = primaryRoles.map((role: ProjectContactRole) => {
      // Note: kebabCase the role name, this saves manually crafting a string
      const qa = role.replace(/\s+/g, "-").toLowerCase();
      const contact = contacts.find(x => x.role === role);
      const partner = contact && partners.find(x => x.accountId === contact.accountId);
      let comment;

      if (!isKTP && role === "Project Manager") {
        comment = <ACC.Content value={x => x.projectDetails.projectManagerInfo} />;
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
  }

  private renderOtherContacts(contacts: CombinedData["contacts"]) {
    if (!this.props.config.features.displayOtherContacts) return null;

    const { excludedOtherRoles } = this.getRoles();
    const otherContacts = contacts.filter(x => excludedOtherRoles.indexOf(x.role) === -1);

    return (
      <ACC.Section title={x => x.projectDetails.projectLabels.otherContacts} qa="other-contacts-table">
        <ACC.Partners.ContactsTable
          contacts={otherContacts}
          projectContactLabels={x => x.projectDetails.contactLabels}
        />
      </ACC.Section>
    );
  }

  private renderContents({ project, partners, contacts }: CombinedData) {
    const { isLoans } = checkProjectCompetition(project.competitionType);
    // Note: Partners is reused avoid destructing - all partners will have the same competitionName at this UI
    const competitionName = partners[0].competitionName;

    return (
      <ACC.Page
        backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
      >
        <ACC.Section
          qa="period-information"
          title={x => x.projectDetails.projectMessages.currentPeriodInfo(project.periodId, project.numberOfPeriods)}
          subtitle={<ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />}
        />

        <ACC.Section title={x => x.projectDetails.projectLabels.projectMembers}>
          {this.renderPrimaryContacts({ project, partners, contacts })}

          <ACC.Section title={x => x.projectDetails.projectLabels.financeContacts}>
            <ACC.PartnersAndFinanceContacts
              contacts={contacts}
              partners={partners}
              projectContactLabels={x => x.projectDetails.contactLabels}
              comment={(
                <SimpleString>
                  <ACC.Content value={(x) => x.projectDetails.financeContactInfo} />
                </SimpleString>
              )}
              footnote={(
                <SimpleString>
                  <ACC.Content value={(x => x.projectDetails.changeInfo)} />
                  <ACC.EmailContent value={(x => x.projectDetails.changeEmail)} />
                  <ACC.Content value={(x => x.projectDetails.changeEnd)} />
                </SimpleString>
              )}
            />
          </ACC.Section>

          {this.renderOtherContacts(contacts)}
        </ACC.Section>

        {this.renderPartnerInformationTable(partners, project)}

        <ACC.Section
          title={<ACC.Content value={x => x.projectDetails.projectLabels.projectInformation} />}
          qa="project-details"
        >
          <ACC.SummaryList qa="project-information">
            {competitionName && (
              <ACC.SummaryListItem
                label={x => x.projectDetails.projectLabels.competitionNameLabel}
                qa="competition-name"
                content={<ACC.Renderers.SimpleString>{competitionName}</ACC.Renderers.SimpleString>}
              />
            )}

            <ACC.SummaryListItem
              label={x => x.projectDetails.projectLabels.competitionTypeLabel}
              qa="competition-type"
              content={<ACC.Renderers.SimpleString>{project.competitionType}</ACC.Renderers.SimpleString>}
            />

            <ACC.SummaryListItem
              label={x => x.projectDetails.projectLabels.startDate}
              qa="start-date"
              content={<ACC.Renderers.FullDate value={project.startDate} />}
            />

            <ACC.SummaryListItem
              label={x => x.projectDetails.projectLabels.endDate}
              qa="end-date"
              content={<ACC.Renderers.FullDate value={isLoans ? project.loanEndDate : project.endDate} />}
            />

            {isLoans ? (
              <>
                <ACC.SummaryListItem
                  qa="availability-period"
                  label={x => x.projectDetails.projectLabels.loanAvailabilityPeriod}
                  content={
                    <ACC.Renderers.SimpleString>
                      {getPlural("month", project.loanAvailabilityPeriodLength)}
                    </ACC.Renderers.SimpleString>
                  }
                />
                <ACC.SummaryListItem
                  qa="extension-period"
                  label={x => x.projectDetails.projectLabels.loanExtensionPeriod}
                  content={
                    <ACC.Renderers.SimpleString>
                      {getPlural("month", project.loanExtensionPeriodLength)}
                    </ACC.Renderers.SimpleString>
                  }
                />
                <ACC.SummaryListItem
                  qa="repayment-period"
                  label={x => x.projectDetails.projectLabels.loanRepaymentPeriod}
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
                  label={x => x.projectDetails.projectLabels.duration}
                  qa="duration"
                  content={getPlural("month", project.durationInMonths)}
                />

                <ACC.SummaryListItem
                  label={x => x.projectDetails.projectLabels.numberOfPeriods}
                  qa="periods"
                  content={project.numberOfPeriods}
                />
              </>
            )}

            <ACC.SummaryListItem
              label={x => x.projectDetails.projectLabels.scope}
              qa="scope"
              content={<ACC.Renderers.SimpleString multiline>{project.summary}</ACC.Renderers.SimpleString>}
            />
          </ACC.SummaryList>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderPartnerInformationTable(partners: CombinedData["partners"], project: CombinedData["project"]) {
    const PartnersTable = ACC.TypedTable<PartnerDto>();
    const { isPmOrMo } = getAuthRoles(project.roles);

    return (
      <ACC.Section title={x => x.projectDetails.projectLabels.partners}>
        <PartnersTable.Table qa="partner-information" data={partners}>
          <PartnersTable.Custom
            header={x => x.partnerDetails.contactLabels.partnerName}
            value={x => this.renderPartnerName(x)}
            qa="partner-name"
          />
          <PartnersTable.String
            header={x => x.partnerDetails.contactLabels.partnerType}
            value={x => x.type}
            qa="partner-type"
          />
          {isPmOrMo ? (
            <PartnersTable.String
              header={x => x.partnerDetails.contactLabels.statusLabel}
              value={x => x.partnerStatusLabel}
              qa="partner-status"
            />
          ) : null}
          {isPmOrMo ? (
            <PartnersTable.Custom
              header={x => x.partnerDetails.contactLabels.fundingLabel}
              value={x => (
                <ACC.Content value={content => content.partnerDetails.contactLabels.fundingState(x.isNonFunded)} />
              )}
              qa="partner-funding"
            />
          ) : null}
          <PartnersTable.String
            header={x => x.partnerDetails.contactLabels.partnerPostcode}
            value={x => x.postcode}
            qa="partner-postcode"
          />
        </PartnersTable.Table>
      </ACC.Section>
    );
  }

  private renderPartnerName(partner: PartnerDto) {
    const partnerName = ACC.getPartnerName(partner, true);

    return (
      <GetProjectStatus>
        {x =>
          x.isActive ? (
            <ACC.Link
              route={this.props.routes.partnerDetails.getLink({
                projectId: this.props.projectId,
                partnerId: partner.id,
              })}
            >
              {partnerName}
            </ACC.Link>
          ) : (
            <>{partnerName}</>
          )
        }
      </GetProjectStatus>
    );
  }
}

const ProjectDetailsContainer = (props: Params & BaseProps) => {
  const stores = useStores();

  return (
    <ProjectDetailsComponent
      {...props}
      projectDetails={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
      contacts={stores.contacts.getAllByProjectId(props.projectId)}
    />
  );
};

export const ProjectDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDetails",
  routePath: "/projects/:projectId/details",
  container: ProjectDetailsContainer,
  getParams: r => ({ projectId: r.params.projectId }),
  getTitle: x => x.content.projectDetails.title(),
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});

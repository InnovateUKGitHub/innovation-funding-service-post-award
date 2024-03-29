import { ProjectMonitoringLevel, ProjectRole } from "@framework/constants/project";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { EmailContent } from "@ui/components/atomicDesign/atoms/EmailContent/emailContent";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { PartnerContactRoleTable } from "@ui/components/atomicDesign/organisms/partners/ContactRoleTable/PartnerContactRoleTable";
import { ContactsTable } from "@ui/components/atomicDesign/organisms/partners/ContactsTable/contactsTable";
import { getPartnerName } from "@ui/components/atomicDesign/organisms/partners/utils/partnerName";
import { ProjectBackLink } from "@ui/components/atomicDesign/organisms/projects/ProjectBackLink/projectBackLink";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { ShortDateRange, FullDate } from "@ui/components/atomicDesign/atoms/Date";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { getPlural } from "@ui/helpers/plurals";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { BaseProps, defineRoute } from "../../../containerBase";
import { useProjectDetailsQuery } from "./projectDetails.logic";
import { getContactRole } from "@ui/components/atomicDesign/organisms/partners/utils/getContactRole";

interface Props {
  projectId: ProjectId;
}

type ProjectContactRole = ProjectContactDto["role"];

const getRoles = () => {
  const primaryRoles: ProjectContactRole[] = ["Monitoring officer", "Project Manager", "Innovation lead", "IPM"];

  // Note: Excluded roles are already rendered elsewhere on page
  const excludedOtherRoles: ProjectContactRole[] = [...primaryRoles, "Finance contact"];

  return {
    primaryRoles,
    excludedOtherRoles,
  };
};

const OtherContactProjectDetailsComponent = ({
  contacts,
}: {
  contacts: Pick<ProjectContactDto, "role" | "name" | "roleName" | "email">[];
}) => {
  const { excludedOtherRoles } = getRoles();

  const otherContacts = contacts.filter(x => excludedOtherRoles.indexOf(x.role) === -1);

  return (
    <Section title={x => x.projectLabels.otherContacts} qa="other-contacts-table">
      <ContactsTable contacts={otherContacts} />
    </Section>
  );
};

type PartnerNameProps = {
  project: Pick<ProjectDtoGql, "id">;
  partner: Pick<PartnerDtoGql, "name" | "isWithdrawn" | "isLead" | "id">;
  readonly: boolean;
};

const PartnerName = ({ project, partner, readonly }: PartnerNameProps) => {
  const partnerName = getPartnerName(partner, true);
  const projectStatus = useProjectStatus();
  const routes = useRoutes();

  if (projectStatus.isActive && !readonly) {
    return (
      <Link
        route={routes.partnerDetails.getLink({
          projectId: project.id,
          partnerId: partner.id,
        })}
      >
        {partnerName}
      </Link>
    );
  }

  return <>{partnerName}</>;
};

type PartnerTableType = Pick<
  PartnerDtoGql,
  "partnerStatusLabel" | "isNonFunded" | "postcode" | "type" | "id" | "isLead" | "isWithdrawn" | "name"
>;

const PartnersTable = createTypedTable<PartnerTableType>();

const PartnerInformationTable = ({
  project,
  partners,
}: {
  project: Pick<ProjectDtoGql, "roles" | "id">;
  partners: PartnerTableType[];
}) => {
  const { isPmOrMo, isAssociate, isFc } = getAuthRoles(project.roles);

  return (
    <Section title={x => x.projectLabels.partners}>
      <PartnersTable.Table qa="partner-information" data={partners}>
        <PartnersTable.Custom
          header={x => x.pages.partnerDetails.projectContactLabels.partnerName}
          value={x => <PartnerName project={project} partner={x} readonly={isAssociate && !isFc && !isPmOrMo} />}
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
              <Content
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
    </Section>
  );
};

const getDetailsContactRole = getContactRole<
  ProjectContactDto,
  Pick<PartnerDtoGql, "accountId" | "name" | "isWithdrawn" | "isLead">
>;

const ProjectDetailsPage = (props: Props & BaseProps) => {
  const { project, partners, contacts } = useProjectDetailsQuery(props.projectId);
  const { isLoans, isKTP } = checkProjectCompetition(project.competitionType);

  // Note: Partners is reused avoid destructing - all partners will have the same competitionName at this UI
  const competitionName = partners[0].competitionName;

  const monitoringOfficers = getDetailsContactRole({
    contacts,
    partners,
    partnerRole: "Monitoring officer",
  });
  const projectManagers = getDetailsContactRole({ contacts, partners, partnerRole: "Project Manager" });
  const financeContacts = getDetailsContactRole({ contacts, partners, partnerRole: "Finance contact" });
  const innovationLead = getDetailsContactRole({ contacts, partners, partnerRole: "Innovation lead" });
  const ipm = getDetailsContactRole({
    contacts,
    partners,
    partnerRole: "IPM",
  });

  return (
    <Page
      backLink={<ProjectBackLink projectId={project.id} />}
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      projectStatus={project.status}
    >
      <Section
        qa="period-information"
        title={x =>
          x.projectMessages.currentPeriodInfo({
            currentPeriod: project.periodId,
            numberOfPeriods: project.numberOfPeriods,
          })
        }
        subtitle={<ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />}
      />

      <Section title={x => x.projectLabels.projectMembers}>
        {project.monitoringLevel !== ProjectMonitoringLevel.InternalAssurance && (
          <Section title={x => x.projectLabels.monitoringOfficers({ count: monitoringOfficers.length })}>
            <PartnerContactRoleTable
              hidePartnerColumn
              qa="monitoring-officer-details"
              contactRoles={monitoringOfficers}
            />
          </Section>
        )}

        <Section title={x => x.projectLabels.projectManagers({ count: projectManagers.length })}>
          <PartnerContactRoleTable
            qa="project-manager-details"
            contactRoles={projectManagers}
            comment={
              !isKTP && (
                <SimpleString>
                  <Content value={x => x.pages.projectDetails.projectManagerInfo} />
                </SimpleString>
              )
            }
          />
        </Section>

        <Section title={x => x.projectLabels.financeContacts({ count: financeContacts.length })}>
          <PartnerContactRoleTable
            qa="finance-contact-details"
            contactRoles={financeContacts}
            comment={
              !project.roles.isAssociate && (
                <SimpleString>
                  <Content value={x => x.pages.projectDetails.financeContactInfo} />
                </SimpleString>
              )
            }
            footnote={
              !project.roles.isAssociate && (
                <SimpleString>
                  <Content
                    value={x => x.pages.projectDetails.changeInfo}
                    components={[<EmailContent key="email" value={x => x.pages.projectDetails.changeEmail} />]}
                  />
                </SimpleString>
              )
            }
          />
        </Section>

        {innovationLead?.length > 0 && (
          <Section title={x => x.projectLabels.innovationLeads({ count: innovationLead.length })}>
            <PartnerContactRoleTable hidePartnerColumn qa="innovation-lead-details" contactRoles={innovationLead} />
          </Section>
        )}

        {ipm?.length > 0 && (
          <Section title={x => x.projectLabels.ipms({ count: ipm.length })}>
            <PartnerContactRoleTable hidePartnerColumn qa="ipm-details" contactRoles={ipm} />
          </Section>
        )}

        <OtherContactProjectDetailsComponent contacts={contacts} />
      </Section>

      <PartnerInformationTable project={project} partners={partners} />

      <Section title={<Content value={x => x.projectLabels.projectInformation} />} qa="project-details">
        <SummaryList qa="project-information">
          {competitionName && (
            <SummaryListItem
              label={x => x.projectLabels.competitionName}
              qa="competition-name"
              content={<SimpleString>{competitionName}</SimpleString>}
            />
          )}

          <SummaryListItem
            label={x => x.projectLabels.competitionType}
            qa="competition-type"
            content={<SimpleString>{project.competitionType}</SimpleString>}
          />

          <SummaryListItem
            label={x => x.projectLabels.startDate}
            qa="start-date"
            content={<FullDate value={project.startDate} />}
          />

          <SummaryListItem
            label={x => x.projectLabels.endDate}
            qa="end-date"
            content={<FullDate value={isLoans ? project.loanEndDate : project.endDate} />}
          />

          {isLoans ? (
            <>
              <SummaryListItem
                qa="availability-period"
                label={x => x.projectLabels.availabilityPeriod}
                content={<SimpleString>{getPlural("month", project.loanAvailabilityPeriodLength)}</SimpleString>}
              />
              <SummaryListItem
                qa="extension-period"
                label={x => x.projectLabels.extensionPeriod}
                content={<SimpleString>{getPlural("month", project.loanExtensionPeriodLength)}</SimpleString>}
              />
              <SummaryListItem
                qa="repayment-period"
                label={x => x.projectLabels.repaymentPeriod}
                content={<SimpleString>{getPlural("month", project.loanRepaymentPeriodLength)}</SimpleString>}
              />
            </>
          ) : (
            <>
              <SummaryListItem
                label={x => x.projectLabels.duration}
                qa="duration"
                content={getPlural("month", project.durationInMonths)}
              />

              <SummaryListItem
                label={x => x.projectLabels.numberOfPeriods}
                qa="periods"
                content={project.numberOfPeriods}
              />
            </>
          )}

          <SummaryListItem
            label={x => x.projectLabels.scope}
            qa="scope"
            content={<SimpleString multiline>{project.summary}</SimpleString>}
          />
        </SummaryList>
      </Section>
    </Page>
  );
};

export const ProjectDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "projectDetails",
  routePath: "/projects/:projectId/details",
  container: ProjectDetailsPage,
  getParams: r => ({ projectId: r.params.projectId as ProjectId }),
  getTitle: x => x.content.getTitleCopy(x => x.pages.projectDetails.title),
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(
        ProjectRole.FinancialContact,
        ProjectRole.ProjectManager,
        ProjectRole.MonitoringOfficer,
        ProjectRole.Associate,
      ),
});

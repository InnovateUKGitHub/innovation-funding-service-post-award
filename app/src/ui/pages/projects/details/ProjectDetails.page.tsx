import { ProjectMonitoringLevel, ProjectRolePermissionBits } from "@framework/constants/project";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { Content } from "@ui/components/molecules/Content/content";
import { EmailContent } from "@ui/components/atoms/EmailContent/emailContent";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { Link } from "@ui/components/atoms/Links/links";
import { PartnerContactRoleTable } from "@ui/components/organisms/partners/ContactRoleTable/PartnerContactRoleTable";
import { ContactsTable } from "@ui/components/organisms/partners/ContactsTable/contactsTable";
import { getPartnerName } from "@ui/components/organisms/partners/utils/partnerName";
import { ProjectBackLink } from "@ui/components/organisms/projects/ProjectBackLink/projectBackLink";
import { ShortDateRange, FullDate } from "@ui/components/atoms/Date";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { createTypedTable } from "@ui/components/molecules/Table/Table";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { getPlural } from "@ui/helpers/plurals";
import { useRoutes } from "@ui/context/routesProvider";
import { BaseProps, defineRoute } from "../../../app/containerBase";
import { useProjectDetailsQuery } from "./projectDetails.logic";
import { getContactRole } from "@ui/components/organisms/partners/utils/getContactRole";
import { useMemo } from "react";
import {
  mapSalesforceCompetitionTypeToCopy,
  mapToSalesforceCompetitionTypes,
} from "@framework/constants/competitionTypes";
import { useContent } from "@ui/hooks/content.hook";

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
  project: Pick<ProjectDtoGql, "id" | "isActive">;
  partner: Pick<PartnerDtoGql, "name" | "isWithdrawn" | "isLead" | "id">;
  readonly: boolean;
};

const PartnerName = ({ project, partner, readonly }: PartnerNameProps) => {
  const partnerName = getPartnerName(partner, true);
  // const projectStatus = useProjectStatus();
  const routes = useRoutes();

  if (project.isActive && !readonly) {
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
  project: Pick<ProjectDtoGql, "roles" | "id" | "isActive">;
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
  Pick<ProjectContactDto, "role" | "name" | "accountId" | "email">,
  Pick<PartnerDtoGql, "accountId" | "name" | "isWithdrawn" | "isLead">
>;

const ProjectDetailsPage = (props: Props & BaseProps) => {
  const { getContent } = useContent();
  const { project, partners, competitionName, contacts, fragmentRef } = useProjectDetailsQuery(props.projectId);
  const { isLoans, isKTP } = checkProjectCompetition(project.competitionType);

  const competitionTypeName = useMemo(() => {
    const type = mapToSalesforceCompetitionTypes(project.competitionType);
    return getContent(mapSalesforceCompetitionTypeToCopy(type));
  }, [project.competitionType, getContent]);

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
    <Page fragmentRef={fragmentRef} backLink={<ProjectBackLink projectId={project.id} />}>
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
            content={<SimpleString>{competitionTypeName}</SimpleString>}
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
        ProjectRolePermissionBits.FinancialContact,
        ProjectRolePermissionBits.ProjectManager,
        ProjectRolePermissionBits.MonitoringOfficer,
        ProjectRolePermissionBits.Associate,
      ),
});

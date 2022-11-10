import { ProjectContactDto, ProjectDto } from "@framework/dtos";
import { H3, Loader, Section, createTypedForm, TypedTable } from "@ui/components";
import { DropdownListOption } from "@ui/components/inputs";
import { SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { useState } from "react";

interface UserChangerTableRow {
  isMo: boolean;
  isFc: boolean;
  isPm: boolean;
  projectContactDto: ProjectContactDto;
}
interface UserChangerEmailFormInput {
  email?: string;
}
interface UserSwitcherFormInputs extends UserChangerEmailFormInput {
  projectId?: string;
  shouldStripNoemail: boolean;
}

const ResetUserForm = createTypedForm<string>();
const ManuallyEnterUserForm = createTypedForm<UserChangerEmailFormInput>();
const SelectProjectForm = createTypedForm<UserSwitcherFormInputs>();
const SelectContactForm = createTypedForm<string>();

const UserChangerProjectSelectorPartnerSelector = ({
  contacts,
}: {
  project: ProjectDto;
  contacts: ProjectContactDto[];
}) => {
  const { getContent } = useContent();
  const ProjectContactTable = TypedTable<UserChangerTableRow>();

  // A contact email-to-role record to collate a user's roles together.
  const contactRoleInfo: Record<string, UserChangerTableRow> = {};

  // For each contact...
  for (const contact of contacts) {
    // If the contact has not yet been seen before...
    if (!contactRoleInfo[contact.email]) {
      // Initialise the record with default options
      contactRoleInfo[contact.email] = { isMo: false, isFc: false, isPm: false, projectContactDto: contact };
    }

    // Add the relevant role to the contact's role info.
    if (contact.role === "Monitoring officer") {
      contactRoleInfo[contact.email].isMo = true;
    } else if (contact.role === "Finance contact") {
      contactRoleInfo[contact.email].isFc = true;
    } else if (contact.role === "Project Manager") {
      contactRoleInfo[contact.email].isPm = true;
    }
  }

  if (contacts.length === 0) {
    return <SimpleString>{getContent(x => x.components.userChanger.contactListEmpty)}</SimpleString>;
  }

  const sortedData = Object.values(contactRoleInfo).sort((a, b) =>
    a.projectContactDto.name.localeCompare(b.projectContactDto.name),
  );

  /**
   * Strip "noemail" from the end of an email address, but only if enabled.
   *
   * @param {string} email The email address
   * @returns {string} The email address, with "noemail" stripped (if enabled)
   */
  const stripNoEmail = (email: string) => {
    return email.replace(/noemail$/, "");
  };

  return (
    <SelectContactForm.Form data="" action="/">
      <ProjectContactTable.Table qa="user-switcher-contacts" data={sortedData}>
        <ProjectContactTable.String
          qa="partner-name"
          header={x => x.projectContactLabels.contactName}
          value={x => x.projectContactDto.name}
        />

        <ProjectContactTable.String
          qa="partner-mo"
          header={x => x.components.userChanger.tableHeaderMonitoringOfficer}
          value={x => (x.isMo ? getContent(x => x.components.userChanger.tableHeaderMonitoringOfficer) : "")}
        />

        <ProjectContactTable.String
          qa="partner-pm"
          header={x => x.components.userChanger.tableHeaderProjectManager}
          value={x => (x.isPm ? getContent(x => x.components.userChanger.tableHeaderProjectManager) : "")}
        />

        <ProjectContactTable.String
          qa="partner-fc"
          header={x => x.components.userChanger.tableHeaderFinancialContact}
          value={x => (x.isFc ? getContent(x => x.components.userChanger.tableHeaderFinancialContact) : "")}
        />

        <ProjectContactTable.String
          qa="partner-email"
          header={x => x.projectContactLabels.contactEmail}
          value={x => stripNoEmail(x.projectContactDto.email)}
        />

        <ProjectContactTable.Custom
          qa="delete"
          value={x => {
            return (
              <SelectContactForm.Button
                name="user"
                styling="Link"
                className="govuk-!-font-size-19"
                style={{ marginLeft: "15px" }}
                value={stripNoEmail(x.projectContactDto.email)}
              >
                Change user
              </SelectContactForm.Button>
            );
          }}
        />
      </ProjectContactTable.Table>
    </SelectContactForm.Form>
  );
};

const UserChangerProjectSelectorPartnerLoader = ({ project }: { project: ProjectDto }) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.contacts.getAllByProjectIdAsDeveloper(project.id)}
      render={contacts => <UserChangerProjectSelectorPartnerSelector project={project} contacts={contacts} />}
    />
  );
};

const UserChangerProjectSelector = ({ projects }: { projects: ProjectDto[] }) => {
  const { getContent } = useContent();
  const initialEmailState = useStores().users.getCurrentUser().email;

  const [project, setProjectId] = useState<ProjectDto>();
  const [email, setEmail] = useState<string | undefined>(initialEmailState);
  const [shouldStripNoemail, setShouldStripNoEmail] = useState<boolean>(true);

  // Create options for dropdown to select a project.
  const projectOptions: DropdownListOption[] = projects
    .sort((a, b) => {
      const competitionCompare = a.competitionType.localeCompare(b.competitionType);
      const nameCompare = a.title.localeCompare(b.title);

      if (competitionCompare) return competitionCompare;
      return nameCompare;
    })
    .map(p => ({
      id: p.id,
      value: p.id,
      displayName: `[${p.competitionType}] ${p.title}`,
      qa: p.id,
    }));

  const userFormProps = {
    data: { projectId: project?.id, email, shouldStripNoemail },
    onChange: (e: UserSwitcherFormInputs) => {
      setProjectId(projects.find(x => x.id === e.projectId));
      setShouldStripNoEmail(e.shouldStripNoemail);
      setEmail(e.email);
    },
    action: "/",
  };

  return (
    <>
      <SelectProjectForm.Form {...userFormProps}>
        <H3>{getContent(x => x.components.userChanger.pickUserSubtitle)}</H3>
        <SelectProjectForm.DropdownList
          name="projectId"
          options={projectOptions}
          hasEmptyOption
          placeholder={getContent(x => x.components.userChanger.projectDropdownPlaceholder)}
          value={p => projectOptions.find(x => p.projectId === x.value)}
          update={(x, value) => (x.projectId = String(value?.value))}
        />
      </SelectProjectForm.Form>
      {project?.id && <UserChangerProjectSelectorPartnerLoader project={project} />}
    </>
  );
};

const UserChangerProjectLoader = () => {
  const stores = useStores();
  return (
    <Loader
      pending={stores.projects.getProjectsAsDeveloper()}
      render={projects => <UserChangerProjectSelector projects={projects} />}
    />
  );
};

const UserChangerReset = () => {
  const { getContent } = useContent();

  return (
    <ResetUserForm.Form data="" action="/">
      <ResetUserForm.Button name="reset">
        {getContent(x => x.components.userChanger.resetUserMessage)}
      </ResetUserForm.Button>
    </ResetUserForm.Form>
  );
};

const UserChangerManualEmailEntry = () => {
  const { getContent } = useContent();
  const initialEmailState = useStores().users.getCurrentUser().email;
  const [email, setEmail] = useState<string | undefined>(initialEmailState);

  return (
    <ManuallyEnterUserForm.Form
      data={{ email }}
      onChange={e => {
        setEmail(e.email);
      }}
      action="/"
    >
      <H3>{getContent(x => x.components.userChanger.enterUserSubtitle)}</H3>

      <ManuallyEnterUserForm.String
        label="user"
        name="user"
        labelHidden
        value={x => x.email}
        update={(x, v) => (x.email = v || "")}
      />

      <ManuallyEnterUserForm.Submit>
        {getContent(x => x.components.userChanger.changeUserMessage)}
      </ManuallyEnterUserForm.Submit>
    </ManuallyEnterUserForm.Form>
  );
};

/**
 * A development user switching interface to help select a valid contact for projects.
 */
const UserChanger = () => {
  return (
    <Section title={x => x.components.userChanger.sectionTitle}>
      <UserChangerReset />
      <UserChangerProjectLoader />
      <UserChangerManualEmailEntry />
    </Section>
  );
};

export { UserChanger };

import { ProjectDto } from "@framework/dtos";
import { DeveloperUser } from "@framework/dtos/developerUser";
import { createTypedForm, H3, Info, Loader, Section, TypedTable } from "@ui/components";
import { DropdownListOption } from "@ui/components/inputs";
import { SimpleString } from "@ui/components/renderers";
import { useMounted } from "@ui/features";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { useState } from "react";
import { graphql } from "react-relay";
import { useLocation } from "react-router-dom";
import { DeveloperUserSwitcherPage } from "./UserSwitcher.page";
import { useQuery } from "relay-hooks";
import { UserSwitcherCurrentUserQuery } from "./__generated__/UserSwitcherCurrentUserQuery.graphql";

/**
 * Get the link to the current page
 *
 * @returns The link to the current page we are on
 */
const useReturnLocation = () => {
  const { isClient, isServer } = useMounted();
  const location = useLocation();

  if (isClient) return window.location.href;
  if (isServer) return location.pathname + location.search;
};

interface UserSwitcherTableRow {
  isMo: boolean;
  isFc: boolean;
  isPm: boolean;
  user: DeveloperUser;
}
interface UserSwitcherEmailFormInput {
  email?: string;
}
interface UserSwitcherFormInputs extends UserSwitcherEmailFormInput {
  projectId?: string;
}

const ResetUserForm = createTypedForm<string>();
const ManuallyEnterUserForm = createTypedForm<UserSwitcherEmailFormInput>();
const SelectProjectForm = createTypedForm<UserSwitcherFormInputs>();
const SelectContactForm = createTypedForm<string>();

const UserSwitcherCurrentUser = () => {
  const { data, isLoading } = useQuery<UserSwitcherCurrentUserQuery>(graphql`
    query UserSwitcherCurrentUserQuery {
      currentUser {
        email
        isSystemUser
      }
    }
  `);

  if (isLoading) return null;

  return (
    <>
      <p>
        Currently logged in as:{" "}
        {data?.currentUser.isSystemUser ? "System User" : data?.currentUser.email ?? "Invalid User"}
      </p>
    </>
  );
};

const UserSwitcherProjectSelectorPartnerSelector = ({
  users,
  projectId,
}: {
  users: DeveloperUser[];
  projectId: string;
}) => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();
  const ProjectContactTable = TypedTable<UserSwitcherTableRow>();

  // A contact email-to-role record to collate a user's roles together.
  const contactRoleInfo: Record<string, UserSwitcherTableRow> = {};

  // For each contact...
  for (const user of users) {
    // If the contact has not yet been seen before...
    if (!contactRoleInfo[user.email]) {
      // Initialise the record with default options
      contactRoleInfo[user.email] = { isMo: false, isFc: false, isPm: false, user };
    }

    // Add the relevant role to the contact's role info.
    if (user.role === "Monitoring officer") {
      contactRoleInfo[user.email].isMo = true;
    } else if (user.role === "Finance contact") {
      contactRoleInfo[user.email].isFc = true;
    } else if (user.role === "Project Manager") {
      contactRoleInfo[user.email].isPm = true;
    }
  }

  if (users.length === 0) {
    return <SimpleString>{getContent(x => x.components.userChanger.contactListEmpty)}</SimpleString>;
  }

  const sortedData = Object.values(contactRoleInfo).sort((a, b) => a.user.name.localeCompare(b.user.name));

  return (
    <ProjectContactTable.Table qa="user-switcher-contacts" data={sortedData}>
      <ProjectContactTable.String
        qa="partner-name"
        header={x => x.projectContactLabels.contactName}
        value={x => x.user.name}
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
        qa="partner-external-username"
        header={x => x.projectContactLabels.contactExternalUsername}
        value={x => x.user.externalUsername.replace("@", "\u200B@")} // Add ZWSP to allow line break
      />

      <ProjectContactTable.String
        qa="partner-email"
        header={x => x.projectContactLabels.contactEmail}
        value={x => x.user.email.replace("@", "\u200B@")} // Add ZWSP to allow line break
      />

      <ProjectContactTable.Custom
        qa="delete"
        header={x => x.components.userChanger.tableHeaderSwitchOptions}
        value={x => {
          return (
            <SelectContactForm.Form data="" action={DeveloperUserSwitcherPage.routePath}>
              <SelectContactForm.Hidden name="project_id" value={() => projectId} />
              <SelectContactForm.Hidden name="current_url" value={() => returnLocation} />
              <SelectContactForm.Hidden
                name="user"
                value={() => x.user.externalUsername || x.user.internalUsername || x.user.email}
              />
              <SelectContactForm.Button name="home" styling="Link" className="govuk-!-font-size-19" qa="btn-home">
                {getContent(x => x.components.userChanger.switchAndHome)}
              </SelectContactForm.Button>
              <SelectContactForm.Button name="stay" styling="Link" className="govuk-!-font-size-19" qa="btn-stay">
                {getContent(x => x.components.userChanger.switchAndStay)}
              </SelectContactForm.Button>
            </SelectContactForm.Form>
          );
        }}
      />
    </ProjectContactTable.Table>
  );
};

const UserSwitcherProjectSelectorPartnerLoader = ({ projectId }: { projectId: string }) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.developerUsers.getAllByProjectId(projectId)}
      render={users => <UserSwitcherProjectSelectorPartnerSelector projectId={projectId} users={users} />}
    />
  );
};

const UserSwitcherProjectSelector = ({ projects }: { projects: ProjectDto[] }) => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();
  const { email: initialEmailState, projectId: initialProjectIdState } = useStores().users.getCurrentUser();

  const [projectId, setProjectId] = useState<string | undefined>(initialProjectIdState);
  const [email, setEmail] = useState<string | undefined>(initialEmailState);
  const isMounted = useMounted();

  // Create options for dropdown to select a project.
  const projectOptions: DropdownListOption[] = projects
    .sort((a, b) => {
      const compA = a.competitionType ?? "";
      const compB = b.competitionType ?? "";
      const titleA = a.title ?? "";
      const titleB = b.title ?? "";

      const competitionCompare = compA.localeCompare(compB);
      const nameCompare = titleA.localeCompare(titleB);

      if (competitionCompare) return competitionCompare;
      return nameCompare;
    })
    .map(p => ({
      id: p.id,
      value: p.id,
      displayName: `[${p.competitionType ?? "Unknown"}] ${p.title ?? "Untitled"}`,
      qa: p.id,
    }));

  const userFormProps = {
    data: { projectId, email },
    onChange: (e: UserSwitcherFormInputs) => {
      setProjectId(e.projectId);
      setEmail(e.email);
    },
    action: DeveloperUserSwitcherPage.routePath,
  };

  return (
    <>
      <SelectProjectForm.Form {...userFormProps}>
        <H3>{getContent(x => x.components.userChanger.pickUserSubtitle)}</H3>
        <SelectProjectForm.DropdownList
          name="project_id"
          options={projectOptions}
          hasEmptyOption
          placeholder={getContent(x => x.components.userChanger.projectDropdownPlaceholder)}
          value={p => projectOptions.find(x => p.projectId === x.value)}
          update={(x, value) => (x.projectId = value?.value as string | undefined)}
        />
        {isMounted.isServer && <SelectProjectForm.Hidden name="current_url" value={() => returnLocation} />}
        {isMounted.isServer && (
          <SelectProjectForm.Button name="search">Search for users in project</SelectProjectForm.Button>
        )}
      </SelectProjectForm.Form>
      {projectId && <UserSwitcherProjectSelectorPartnerLoader projectId={projectId} />}
    </>
  );
};

const UserSwitcherProjectLoader = () => {
  const stores = useStores();
  return (
    <Loader
      pending={stores.projects.getProjectsAsDeveloper()}
      render={projects => <UserSwitcherProjectSelector projects={projects} />}
    />
  );
};

const UserSwitcherReset = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();

  return (
    <ResetUserForm.Form data="" action={DeveloperUserSwitcherPage.routePath}>
      <ResetUserForm.Hidden name="current_url" value={() => returnLocation} />
      <ResetUserForm.Hidden name="reset" value={() => ""} />
      <ResetUserForm.Button name="stay" styling="Primary" qa="reset-and-stay">
        {getContent(x => x.components.userChanger.resetAndStay)}
      </ResetUserForm.Button>
      <ResetUserForm.Button name="home" qa="reset-and-home">
        {getContent(x => x.components.userChanger.resetAndHome)}
      </ResetUserForm.Button>
    </ResetUserForm.Form>
  );
};

const UserSwitcherManualEmailEntry = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();
  const { email: initialEmailState } = useStores().users.getCurrentUser();
  const [email, setEmail] = useState<string | undefined>(initialEmailState);

  return (
    <ManuallyEnterUserForm.Form
      data={{ email }}
      onChange={e => {
        setEmail(e.email);
      }}
      action={DeveloperUserSwitcherPage.routePath}
    >
      <H3>{getContent(x => x.components.userChanger.enterUserSubtitle)}</H3>

      <ManuallyEnterUserForm.String
        label="user"
        name="user"
        id="user-switcher-manual-input"
        labelHidden
        value={x => x.email}
        update={(x, v) => (x.email = v || "")}
      />

      <ManuallyEnterUserForm.Hidden name="current_url" value={() => returnLocation} />
      <ManuallyEnterUserForm.Button name="stay" styling="Primary" qa="manual-change-and-stay">
        {getContent(x => x.components.userChanger.manualSwitchAndStay)}
      </ManuallyEnterUserForm.Button>
      <ManuallyEnterUserForm.Button name="home" qa="manual-change-and-home">
        {getContent(x => x.components.userChanger.manualSwitchAndHome)}
      </ManuallyEnterUserForm.Button>
    </ManuallyEnterUserForm.Form>
  );
};

/**
 * A development user switching interface to help select a valid contact for projects.
 */
const UserSwitcher = () => (
  <Section title={x => x.components.userChanger.sectionTitle}>
    <UserSwitcherCurrentUser />
    <UserSwitcherReset />
    <UserSwitcherProjectLoader />
    <UserSwitcherManualEmailEntry />
  </Section>
);

/**
 * A development user switching interface, hidden behind an info-box.
 */
const HiddenUserSwitcher = () => {
  const { getContent } = useContent();
  return (
    <Info summary={getContent(x => x.components.userChanger.sectionTitle)}>
      <UserSwitcher />
    </Info>
  );
};

export { UserSwitcher, HiddenUserSwitcher };

import { ProjectContactDto, ProjectDto } from "@framework/dtos";
import { H3, Loader, Section, TypedForm } from "@ui/components";
import { DropdownListOption } from "@ui/components/inputs";
import { SimpleString } from "@ui/components/renderers";
import { useContent } from "@ui/hooks";
import { useStores } from "@ui/redux";
import { useState } from "react";

interface RolesChecker {
  isMo: boolean;
  isFc: boolean;
  isPm: boolean;
  firstContactDto: ProjectContactDto;
}
interface UserChangerManualEmailFormInputs {
  email?: string;
}
interface UserSwitcherFormInputs extends UserChangerManualEmailFormInputs {
  projectId?: string;
}

const UserChangerProjectSelectorPartnerSelector = ({
  contacts,
  onChange,
}: {
  project: ProjectDto;
  contacts: ProjectContactDto[];
  onChange?: (contact?: ProjectContactDto) => void;
}) => {
  const { getContent } = useContent();
  const [contact, setContact] = useState<ProjectContactDto>();
  const SelectUserForm = TypedForm<{ contactEmail?: string }>();

  // A contact email-to-role record to collate a user's roles together.
  const contactRoleInfo: Record<string, RolesChecker> = {};

  // For each contact...
  for (const contact of contacts) {
    // If the contact has not yet been seen before...
    if (!contactRoleInfo[contact.email]) {
      // Initialise the record with default options
      contactRoleInfo[contact.email] = { isMo: false, isFc: false, isPm: false, firstContactDto: contact };
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

  // For each unique contact...
  const contactDropdownOptions: DropdownListOption[] = Object.entries(contactRoleInfo).map(([email, roleInfo]) => {
    // Use the name/email of the first contact with the same email to construct a displayName
    let displayName = `${roleInfo.firstContactDto.name} (${roleInfo.firstContactDto.email})`;

    // Based on the user's roles, add MO/FC/PM to the end of the name.
    if (roleInfo.isMo) displayName += " MO";
    if (roleInfo.isFc) displayName += " FC";
    if (roleInfo.isPm) displayName += " PM";

    // Return values for the dropdown to utilise.
    return {
      id: email,
      value: email,
      displayName,
      qa: email,
    };
  });

  // If no contacts exists for the project, display a message
  if (contacts.length === 0) {
    return <SimpleString>{getContent(x => x.components.userChanger.contactListEmpty)}</SimpleString>;
  }

  return (
    <SelectUserForm.Form
      data={{ contactEmail: contact?.email }}
      onChange={e => {
        const newContact = contacts.find(x => x.email === e.contactEmail);
        setContact(newContact);
        if (onChange) onChange(newContact);
      }}
    >
      <SelectUserForm.DropdownList
        name="user"
        options={contactDropdownOptions}
        hasEmptyOption
        placeholder={getContent(x => x.components.userChanger.contactDropdownPlaceholder)}
        value={p => contactDropdownOptions.find(x => p.contactEmail === x.value)}
        update={(dto, value) => {
          dto.contactEmail = String(value?.value);
        }}
      />
    </SelectUserForm.Form>
  );
};

const UserChangerProjectSelectorPartnerLoader = ({
  project,
  onChange,
}: {
  project: ProjectDto;
  onChange?: (contact?: ProjectContactDto) => void;
}) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.contacts.getAllByProjectId(project.id)}
      render={contacts => (
        <UserChangerProjectSelectorPartnerSelector onChange={onChange} project={project} contacts={contacts} />
      )}
    />
  );
};

const UserChangerProjectSelector = ({ projects }: { projects: ProjectDto[] }) => {
  const { getContent } = useContent();
  const initialEmailState = useStores().users.getCurrentUser().email;

  const [project, setProjectId] = useState<ProjectDto>();
  const [email, setEmail] = useState<string | undefined>(initialEmailState);
  const SelectUserForm = TypedForm<UserSwitcherFormInputs>();

  // Create options for dropdown to select a project.
  const projectOptions: DropdownListOption[] = projects.map(p => ({
    id: p.id,
    value: p.id,
    displayName: p.title,
    qa: p.id,
  }));

  return (
    <SelectUserForm.Form
      data={{ projectId: project?.id, email }}
      onChange={e => {
        setProjectId(projects.find(x => x.id === e.projectId));
        setEmail(e.email);
      }}
      action="/"
    >
      <H3>{getContent(x => x.components.userChanger.pickUserSubtitle)}</H3>
      <SelectUserForm.DropdownList
        name="projectId"
        options={projectOptions}
        hasEmptyOption
        placeholder={getContent(x => x.components.userChanger.projectDropdownPlaceholder)}
        value={p => projectOptions.find(x => p.projectId === x.value)}
        update={(x, v) => {
          x.projectId = String(v?.value);
        }}
      />
      {project?.id && <UserChangerProjectSelectorPartnerLoader project={project} onChange={v => setEmail(v?.email)} />}

      <H3>{getContent(x => x.components.userChanger.enterUserSubtitle)}</H3>

      <SelectUserForm.String
        label="user"
        name="user"
        labelHidden
        value={x => x.email}
        update={(x, v) => (x.email = v || "")}
      />

      <SelectUserForm.Submit>{getContent(x => x.components.userChanger.changeUserMessage)}</SelectUserForm.Submit>
      <SelectUserForm.Button name="reset">
        {getContent(x => x.components.userChanger.resetUserMessage)}
      </SelectUserForm.Button>
    </SelectUserForm.Form>
  );
};

const UserChangerProjectLoader = () => {
  const stores = useStores();
  return (
    <Loader
      pending={stores.projects.getProjects()}
      render={projects => <UserChangerProjectSelector projects={projects} />}
    />
  );
};

const UserChangerManualEmailEntry = () => {
  const { getContent } = useContent();
  const initialEmailState = useStores().users.getCurrentUser().email;
  const [email, setEmail] = useState<string | undefined>(initialEmailState);
  const SelectUserForm = TypedForm<UserChangerManualEmailFormInputs>();

  return (
    <SelectUserForm.Form
      data={{ email }}
      onChange={e => {
        setEmail(e.email);
      }}
      action="/"
    >
      <SimpleString>{getContent(x => x.components.userChanger.invalidUserMessage)}</SimpleString>

      <SelectUserForm.String
        label="user"
        name="user"
        labelHidden
        value={x => x.email}
        update={(x, v) => (x.email = v || "")}
      />

      <SelectUserForm.Submit>{getContent(x => x.components.userChanger.changeUserMessage)}</SelectUserForm.Submit>
      <SelectUserForm.Button name="reset">
        {getContent(x => x.components.userChanger.resetUserMessage)}
      </SelectUserForm.Button>
    </SelectUserForm.Form>
  );
};

/**
 * A development user switching interface to help select a valid contact for projects.
 *
 * @param props.noSearch Whether the search functionality should be enabled or disabled - Disable if you are on a menu where the user does not have permission to search for users.
 * @returns A React Component
 */
const UserChanger = ({ noSearch = false }: { noSearch?: boolean }) => {
  return (
    <Section title={x => x.components.userChanger.sectionTitle}>
      {!noSearch ? <UserChangerProjectLoader /> : <UserChangerManualEmailEntry />}
    </Section>
  );
};

export { UserChanger };

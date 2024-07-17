import { DeveloperUser } from "@framework/dtos/developerUser";
import { getDefinedEdges, getFirstEdge } from "@gql/selectors/edges";
import { Info } from "@ui/components/atomicDesign/atoms/Details/Details";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { H4, H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { DeveloperUserSwitcherPage } from "./UserSwitcher.page";
import { userSwitcherProjectQuery, userSwitcherProjectsQuery } from "./UserSwitcher.query";
import { UserSwitcherProjectQuery } from "./__generated__/UserSwitcherProjectQuery.graphql";
import { UserSwitcherProjectsQuery } from "./__generated__/UserSwitcherProjectsQuery.graphql";
import { decode as decodeHTMLEntities } from "html-entities";
import { DeveloperCurrentUsername } from "@ui/components/atomicDesign/atoms/DeveloperCurrentUsername/DeveloperCurrentUsername";
import { PlainList } from "@ui/components/atomicDesign/atoms/List/list";
import { useUserContext } from "@ui/context/user";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { DropdownSelect } from "@ui/components/atomicDesign/atoms/form/Dropdown/Dropdown";

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
  isAssociate: boolean;
  user: DeveloperUser;
}
// interface UserSwitcherEmailFormInput {
//   email?: string;
// }
// interface UserSwitcherFormInputs extends UserSwitcherEmailFormInput {
//   projectId?: string;
// }

// interface UserSwitcherSearchProjectFormInputs {
//   search?: string;
// }

// const ResetUserForm = createTypedForm<string>();
// const ManuallyEnterUserForm = createTypedForm<UserSwitcherEmailFormInput>();
// const SelectProjectForm = createTypedForm<UserSwitcherFormInputs>();
// const SearchProjectForm = createTypedForm<UserSwitcherSearchProjectFormInputs>();
// const SelectContactForm = createTypedForm<string>();
const ProjectContactTable = createTypedTable<UserSwitcherTableRow>();

const UserSwitcherCurrentUser = () => {
  return (
    <p>
      Currently logged in as: <DeveloperCurrentUsername />
    </p>
  );
};

const UserSwitcherProjectSelectorPartnerSelector = ({ projectId }: { projectId: ProjectId }) => {
  const { data, isLoading } = useQuery<UserSwitcherProjectQuery>(userSwitcherProjectQuery, { projectId });
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();

  // A contact email-to-role record to collate a user's roles together.
  const contactRoleInfo: Record<string, UserSwitcherTableRow> = {};

  if (isLoading) {
    return <SimpleString>{getContent(x => x.components.userSwitcher.loadingUsers)}</SimpleString>;
  }

  if (!data) {
    return <SimpleString>{getContent(x => x.components.userSwitcher.projectNull)}</SimpleString>;
  }

  if (data?.salesforce.uiapi.query.Acc_Project__c?.edges?.length !== 1) {
    return <SimpleString>{getContent(x => x.components.userSwitcher.projectMissing)}</SimpleString>;
  }

  const project = getFirstEdge(data?.salesforce.uiapi.query.Acc_Project__c?.edges).node;

  // For each contact...
  for (const { node: user } of getDefinedEdges(project.Project_Contact_Links__r?.edges)) {
    const internalUsername = user?.Acc_UserId__r?.Username?.value ?? null;
    const externalUsername = decodeHTMLEntities(user?.Acc_ContactId__r?.username);
    const username = internalUsername ?? externalUsername ?? null;

    if (username && user.Acc_Role__c?.value) {
      const role = user.Acc_Role__c.value;

      // If the contact has not yet been seen before...
      if (!contactRoleInfo[username]) {
        // Initialise the record with default options
        contactRoleInfo[username] = {
          isMo: false,
          isFc: false,
          isPm: false,
          isAssociate: false,
          user: {
            externalUsername,
            internalUsername,
            name: user.Acc_ContactId__r?.Name?.value ?? user.Acc_UserId__r?.Name?.value ?? "Untitled User",
          },
        };
      }

      // Add the relevant role to the contact's role info.
      if (role === "Monitoring officer") {
        contactRoleInfo[username].isMo = true;
      } else if (role === "Finance contact") {
        contactRoleInfo[username].isFc = true;
      } else if (role === "Project Manager") {
        contactRoleInfo[username].isPm = true;
      } else if (role === "Associate") {
        contactRoleInfo[username].isAssociate = true;
      }
    }
  }

  const users = Object.values(contactRoleInfo);

  if (users.length === 0) {
    return <SimpleString>{getContent(x => x.components.userSwitcher.contactListEmpty)}</SimpleString>;
  }

  return (
    <>
      <H4>{project.Acc_ProjectTitle__c?.value}</H4>
      <ProjectContactTable.Table qa="user-switcher-contacts" data={users}>
        <ProjectContactTable.String
          qa="partner-name"
          header={x => x.projectContactLabels.contactName}
          value={x => x.user.name}
        />

        <ProjectContactTable.Custom
          qa="partner-role"
          header={x => x.components.userSwitcher.tableHeaderRole}
          value={x => (
            <PlainList noBottomMargin>
              {x.isPm && <li>{getContent(x => x.components.userSwitcher.projectManagerContact)}</li>}
              {x.isFc && <li>{getContent(x => x.components.userSwitcher.financeContact)}</li>}
              {x.isMo && <li>{getContent(x => x.components.userSwitcher.monitoringOfficerContact)}</li>}
              {x.isAssociate && <li>{getContent(x => x.components.userSwitcher.associateContact)}</li>}
            </PlainList>
          )}
        />

        <ProjectContactTable.Email
          qa="partner-external-username"
          header={x => x.components.userSwitcher.externalUsername}
          value={x => x.user.externalUsername ?? null}
        />

        <ProjectContactTable.Email
          qa="partner-email"
          header={x => x.components.userSwitcher.internalUsername}
          value={x => x.user.internalUsername ?? null}
        />

        <ProjectContactTable.Custom
          qa="delete"
          header={x => x.components.userSwitcher.tableHeaderSwitchOptions}
          value={x => {
            // If the user has an external username (aka can use IFSPA),
            // show the switcher buttons.
            if (x.user.externalUsername) {
              return (
                <Form action={DeveloperUserSwitcherPage.routePath}>
                  <input type="hidden" name="project_id" value={projectId} />
                  <input type="hidden" name="current_url" value={returnLocation} />
                  <input type="hidden" name="user" value={x.user.externalUsername} />
                  <Button type="submit" name="home" styling="Link" data-qa="btn-home">
                    {getContent(x => x.components.userSwitcher.switchAndHome)}
                  </Button>
                  <Button type="submit" name="stay" styling="Link" data-qa="btn-stay">
                    {getContent(x => x.components.userSwitcher.switchAndStay)}
                  </Button>
                </Form>
                // <SelectContactForm.Form data="" action={DeveloperUserSwitcherPage.routePath}>
                //   <SelectContactForm.Hidden name="project_id" value={() => projectId} />
                //   <SelectContactForm.Hidden name="current_url" value={() => returnLocation} />
                //   <SelectContactForm.Hidden name="user" value={() => x.user.externalUsername} />
                //   <SelectContactForm.Button name="home" styling="Link" qa="btn-home">
                //     {getContent(x => x.components.userSwitcher.switchAndHome)}
                //   </SelectContactForm.Button>
                //   <SelectContactForm.Button name="stay" styling="Link" qa="btn-stay">
                //     {getContent(x => x.components.userSwitcher.switchAndStay)}
                //   </SelectContactForm.Button>
                // </SelectContactForm.Form>
              );
            } else {
              // Otherwise, hide the form.
              return null;
            }
          }}
        />
      </ProjectContactTable.Table>
    </>
  );
};

const UserSwitcherProjectSelector = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();
  const user = useUserContext();

  const { projectId: currentRouteProjectId } = useParams();

  const {
    // email: initialEmailState,
    projectId: initialProjectIdState,
    userSwitcherSearchQuery: initialUserSwitcherSearchQuery,
  } = user;

  const [projectId, setProjectId] = useState<ProjectId | undefined>(
    (currentRouteProjectId as ProjectId) ?? (initialProjectIdState as ProjectId),
  );
  // const [email, setEmail] = useState<string | undefined>(initialEmailState);
  const [userSearchInput, setUserSearchInput] = useState<string | undefined>(initialUserSwitcherSearchQuery);
  const [currentSearchInput, setCurrentSearchInput] = useState<string | undefined>(initialUserSwitcherSearchQuery);
  const isMounted = useMounted();

  const { data, isLoading } = useQuery<UserSwitcherProjectsQuery>(userSwitcherProjectsQuery, {
    search: `%${currentSearchInput ?? ""}%`,
  });

  useEffect(() => {
    setProjectId(currentRouteProjectId as ProjectId);
  }, [currentRouteProjectId]);

  // Create options for dropdown to select a project.
  const projectOptions = getDefinedEdges(data?.salesforce.uiapi.query.Acc_Project__c?.edges).map(({ node }) => ({
    id: node.Id,
    value: node.Id,
    displayName: `[${node.Acc_CompetitionId__r?.Acc_CompetitionType__c?.displayValue ?? "Unknown"}] ${
      node?.Acc_ProjectTitle__c?.value ?? "Untitled"
    }`,
    qa: node.Id,
  }));

  const isSubsetOfProjects = projectOptions.length < (data?.salesforce.uiapi.query.Acc_Project__c?.totalCount ?? 0);

  return (
    <>
      <H3>{getContent(x => x.components.userSwitcher.findFromSalesforce)}</H3>
      <Form action={DeveloperUserSwitcherPage.routePath}>
        <FormGroup>
          <Label htmlFor="search_query">{getContent(x => x.components.userSwitcher.searchBoxSubtitle)}</Label>
          <TextInput
            inputWidth="full"
            name="search_query"
            placeholder={getContent(x => x.components.userSwitcher.searchBoxPlaceholder)}
          ></TextInput>
        </FormGroup>

        <Button
          name="search_projects"
          styling="Secondary"
          onClick={() => {
            setCurrentSearchInput(userSearchInput);
          }}
        >
          {getContent(x => x.components.userSwitcher.searchProjects)}
        </Button>

        <Button
          name="reset_search_projects"
          styling="Secondary"
          onClick={() => {
            setUserSearchInput("");
            setCurrentSearchInput("");
          }}
        >
          {getContent(x => x.components.userSwitcher.resetSearchProjects)}
        </Button>

        {isMounted.isServer && <input type="hidden" name="current_url" value={returnLocation} />}
      </Form>
      {/* <SearchProjectForm.Form
        data={{ search: userSearchInput }}
        onChange={(e: UserSwitcherSearchProjectFormInputs) => {
          setUserSearchInput(e.search);
        }}
        action={DeveloperUserSwitcherPage.routePath}
      >
        <SearchProjectForm.String
          name="search_query"
          label={getContent(x => x.components.userSwitcher.searchBoxSubtitle)}
          placeholder={getContent(x => x.components.userSwitcher.searchBoxPlaceholder)}
          value={p => p.search}
          update={(x, value) => (x.search = value ?? "")}
        />
        <SearchProjectForm.Button
          name="search_projects"
          onClick={() => {
            setCurrentSearchInput(userSearchInput);
          }}
        >
          {getContent(x => x.components.userSwitcher.searchProjects)}
        </SearchProjectForm.Button>
        <SearchProjectForm.Button
          name="reset_search_projects"
          onClick={() => {
            setUserSearchInput("");
            setCurrentSearchInput("");
          }}
        >
          {getContent(x => x.components.userSwitcher.resetSearchProjects)}
        </SearchProjectForm.Button>
        {isMounted.isServer && <SearchProjectForm.Hidden name="current_url" value={() => returnLocation} />}
      </SearchProjectForm.Form> */}

      {isSubsetOfProjects && (
        <ValidationMessage message={x => x.components.userSwitcher.projectSubset} messageType="info" />
      )}

      {isLoading ? (
        <SimpleString>{getContent(x => x.components.userSwitcher.projectDropdownLoading)}</SimpleString>
      ) : projectOptions.length < 1 ? (
        <SimpleString>{getContent(x => x.components.userSwitcher.projectDropdownEmpty)}</SimpleString>
      ) : (
        <Form action={DeveloperUserSwitcherPage.routePath}>
          <FormGroup>
            <DropdownSelect
              placeholder={getContent(x => x.components.userSwitcher.projectDropdownPlaceholder)}
              hasEmptyOption
              options={projectOptions}
            ></DropdownSelect>
          </FormGroup>

          {isMounted.isServer && (
            <>
              <input type="hidden" name="current_url" value={returnLocation} />
              <Button type="submit" name="search">
                {getContent(x => x.components.userSwitcher.fetchUsers)}
              </Button>
            </>
          )}
        </Form>
        // <SelectProjectForm.Form
        //   data={{ projectId, email }}
        //   onChange={(e: UserSwitcherFormInputs) => {
        //     setProjectId(e.projectId as ProjectId);
        //     setEmail(e.email);
        //   }}
        //   action={DeveloperUserSwitcherPage.routePath}
        // >
        //   <SelectProjectForm.DropdownList
        //     className="ifspa-developer-section-select"
        //     name="project_id"
        //     options={projectOptions}
        //     hasEmptyOption
        //     placeholder={getContent(x => x.components.userSwitcher.projectDropdownPlaceholder)}
        //     value={p => projectOptions.find(x => p.projectId === x.value)}
        //     update={(x, value) => (x.projectId = value?.value as string | undefined)}
        //   />

        //   {isMounted.isServer && <SelectProjectForm.Hidden name="current_url" value={() => returnLocation} />}
        //   {isMounted.isServer && (
        //     <SelectProjectForm.Button name="search">
        //       {getContent(x => x.components.userSwitcher.fetchUsers)}
        //     </SelectProjectForm.Button>
        //   )}
        // </SelectProjectForm.Form>
      )}

      {projectId && <UserSwitcherProjectSelectorPartnerSelector projectId={projectId} />}
    </>
  );
};

const UserSwitcherReset = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();

  return (
    <Form action={DeveloperUserSwitcherPage.routePath}>
      <input type="hidden" name="current_url" value={returnLocation} />
      <input type="hidden" name="reset" value="" />
      <Button name="stay" styling="Primary" data-qa="reset-and-stay">
        {getContent(x => x.components.userSwitcher.resetAndStay)}
      </Button>
      <Button name="home" styling="Secondary" data-qa="reset-and-home">
        {getContent(x => x.components.userSwitcher.resetAndHome)}
      </Button>
    </Form>
    // <ResetUserForm.Form data="" action={DeveloperUserSwitcherPage.routePath}>
    //   <ResetUserForm.Hidden name="current_url" value={() => returnLocation} />
    //   <ResetUserForm.Hidden name="reset" value={() => ""} />
    //   <ResetUserForm.Button name="stay" styling="Primary" qa="reset-and-stay">
    //     {getContent(x => x.components.userSwitcher.resetAndStay)}
    //   </ResetUserForm.Button>
    //   <ResetUserForm.Button name="home" qa="reset-and-home">
    //     {getContent(x => x.components.userSwitcher.resetAndHome)}
    //   </ResetUserForm.Button>
    // </ResetUserForm.Form>
  );
};

const UserSwitcherManualEmailEntry = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();
  // const { email: initialEmailState } = useStores().users.getCurrentUser();
  // const [email, setEmail] = useState<string | undefined>(initialEmailState);

  return (
    <Form action={DeveloperUserSwitcherPage.routePath}>
      <H3>{getContent(x => x.components.userSwitcher.enterUserSubtitle)}</H3>

      <FormGroup>
        <TextInput id="user-switcher-manual-input" name="user"></TextInput>
      </FormGroup>

      <input type="hidden" name="current_url" value={returnLocation} />
      <Button name="stay" styling="Primary" data-qa="manual-change-and-stay">
        {getContent(x => x.components.userSwitcher.resetAndStay)}
      </Button>
      <Button name="home" styling="Secondary" data-qa="manual-change-and-home">
        {getContent(x => x.components.userSwitcher.resetAndHome)}
      </Button>
    </Form>
    // <ManuallyEnterUserForm.Form
    //   data={{ email }}
    //   onChange={e => {
    //     setEmail(e.email);
    //   }}
    //   action={DeveloperUserSwitcherPage.routePath}
    // >
    //   <H3>{getContent(x => x.components.userSwitcher.enterUserSubtitle)}</H3>

    //   <ManuallyEnterUserForm.String
    //     label="user"
    //     name="user"
    //     id="user-switcher-manual-input"
    //     labelHidden
    //     value={x => x.email}
    //     update={(x, v) => (x.email = v || "")}
    //   />

    //   <ManuallyEnterUserForm.Hidden name="current_url" value={() => returnLocation} />
    //   <ManuallyEnterUserForm.Button name="stay" styling="Primary" qa="manual-change-and-stay">
    //     {getContent(x => x.components.userSwitcher.manualSwitchAndStay)}
    //   </ManuallyEnterUserForm.Button>
    //   <ManuallyEnterUserForm.Button name="home" qa="manual-change-and-home">
    //     {getContent(x => x.components.userSwitcher.manualSwitchAndHome)}
    //   </ManuallyEnterUserForm.Button>
    // </ManuallyEnterUserForm.Form>
  );
};

/**
 * A development user switching interface to help select a valid contact for projects.
 */
const UserSwitcher = () => (
  <Section title={x => x.components.userSwitcher.sectionTitle}>
    <UserSwitcherCurrentUser />
    <UserSwitcherReset />
    <UserSwitcherProjectSelector />
    <UserSwitcherManualEmailEntry />
  </Section>
);

/**
 * A development user switching interface, hidden behind an info-box.
 */
const HiddenUserSwitcher = () => {
  const { getContent } = useContent();
  return (
    <Info summary={getContent(x => x.components.userSwitcher.sectionTitle)}>
      <UserSwitcher />
    </Info>
  );
};

export { UserSwitcher, HiddenUserSwitcher };

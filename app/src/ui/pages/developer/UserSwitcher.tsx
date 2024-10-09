import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { DeveloperUser } from "@framework/dtos/developerUser";
import { ProjectRole } from "@framework/dtos/projectContactDto";
import { mapProjectRoleToInternal } from "@framework/mappers/pcr";
import { getDefinedEdges, getFirstEdge } from "@gql/selectors/edges";
import { Info } from "@ui/components/atoms/Details/Details";
import { DeveloperCurrentUsername } from "@ui/components/atoms/DeveloperCurrentUsername/DeveloperCurrentUsername";
import { H3, H4 } from "@ui/components/atoms/Heading/Heading.variants";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { DropdownSelect } from "@ui/components/atoms/form/Dropdown/Dropdown";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { Table, TBody, TD, TH, THead, TR } from "@ui/components/atoms/table/tableComponents";
import { Section } from "@ui/components/molecules/Section/section";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { useMounted } from "@ui/context/Mounted";
import { useUserContext } from "@ui/context/user";
import { useContent } from "@ui/hooks/content.hook";
import { projectIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import classNames from "classnames";
import { decode as decodeHTMLEntities } from "html-entities";
import { noop } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { DeveloperUserSwitcherPage } from "./UserSwitcher.page";
import { userSwitcherProjectQuery, userSwitcherProjectsQuery } from "./UserSwitcher.query";
import { UserSwitcherProjectQuery } from "./__generated__/UserSwitcherProjectQuery.graphql";
import { UserSwitcherProjectsQuery } from "./__generated__/UserSwitcherProjectsQuery.graphql";
import { Email } from "@ui/components/atoms/Email/Email";

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
  roles: { role: ProjectRole; endDate: string | null; isInactive: boolean }[];
  user: DeveloperUser;
}

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
      // If the contact has not yet been seen before...
      if (!contactRoleInfo[username]) {
        // Initialise the record with default options
        contactRoleInfo[username] = {
          roles: [],
          user: {
            externalUsername,
            internalUsername,
            name: user.Acc_ContactId__r?.Name?.value ?? user.Acc_UserId__r?.Name?.value ?? "Untitled User",
          },
        };
      }

      const projectRole = mapProjectRoleToInternal(user.Acc_Role__c.value);
      if (projectRole) {
        contactRoleInfo[username].roles.push({
          role: projectRole,
          endDate: user.Acc_EndDate__c?.value ?? null,
          isInactive: user.Acc_Inactive__c?.value ?? false,
        });
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

      <Table data-qa="user-switcher-contacts">
        <THead>
          <TR>
            <TH>{getContent(x => x.projectContactLabels.contactName)}</TH>
            <TH>{getContent(x => x.components.userSwitcher.tableHeaderRole)}</TH>
            <TH>{getContent(x => x.components.userSwitcher.details)}</TH>
            <TH>{getContent(x => x.components.userSwitcher.tableHeaderSwitchOptions)}</TH>
          </TR>
        </THead>
        <TBody>
          {users.map(x => (
            <TR key={x.user.name}>
              <TD data-qa="partner-name">{x.user.name}</TD>
              <TD data-qa="partner-role">
                <div className="ifspa-developer-displaylist">
                  {x.roles.map((y, i) => (
                    <dl key={i}>
                      <dt className={classNames({ "ifspa-developer-crossout": y.isInactive })}>
                        {getContent(z => z.projectLabels[y.role]({ count: 1 }))}
                      </dt>
                      {y.endDate && (
                        <dd>
                          {getContent(z => z.components.userSwitcher.endDate)} {y.endDate}
                        </dd>
                      )}
                    </dl>
                  ))}
                </div>
              </TD>
              <TD data-qa="partner-details">
                <div className="ifspa-developer-displaylist">
                  {x.user.externalUsername && (
                    <dl>
                      <dt>{getContent(x => x.components.userSwitcher.externalUsername)}</dt>
                      <dd>
                        <Email>{x.user.externalUsername}</Email>
                      </dd>
                    </dl>
                  )}
                  {x.user.internalUsername && (
                    <dl>
                      <dt>{getContent(x => x.components.userSwitcher.internalUsername)}</dt>
                      <dd>
                        <Email>{x.user.internalUsername}</Email>
                      </dd>
                    </dl>
                  )}
                </div>
              </TD>
              <TD data-qa="delete">
                {x.user.externalUsername && (
                  <Form action={DeveloperUserSwitcherPage.routePath}>
                    <input type="hidden" name="project_id" value={projectId} />
                    <input type="hidden" name="current_url" value={returnLocation} />
                    <input type="hidden" name="user" value={x.user.externalUsername} />
                    <Button name="home" styling="Link" data-qa="btn-home">
                      {getContent(x => x.components.userSwitcher.switchAndHome)}
                    </Button>
                    <Button name="stay" styling="Link" data-qa="btn-stay">
                      {getContent(x => x.components.userSwitcher.switchAndStay)}
                    </Button>
                  </Form>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </>
  );
};

const UserSwitcherProjectSelector = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();
  const user = useUserContext();

  const { projectId: currentRouteProjectId } = useParams();

  const { projectId: initialProjectIdState, userSwitcherSearchQuery: initialUserSwitcherSearchQuery } = user;

  const [projectId, setProjectId] = useState<ProjectId | undefined>(
    (currentRouteProjectId as ProjectId) ?? (initialProjectIdState as ProjectId),
  );
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
    value: `[${node.Acc_CompetitionId__r?.Acc_CompetitionType__c?.displayValue ?? "Unknown"}] ${
      node?.Acc_ProjectTitle__c?.value ?? "Untitled"
    }`,
    "data-qa": node.Id,
  }));

  const isSubsetOfProjects = projectOptions.length < (data?.salesforce.uiapi.query.Acc_Project__c?.totalCount ?? 0);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const id = projectIdValidation.parse(e.target.value);
    setProjectId(id);
  };

  return (
    <>
      <H3>{getContent(x => x.components.userSwitcher.findFromSalesforce)}</H3>
      <Form action={DeveloperUserSwitcherPage.routePath} onSubmit={noop}>
        <section>
          <FormGroup>
            <Label htmlFor="search_query">{getContent(x => x.components.userSwitcher.searchBoxSubtitle)}</Label>
            <TextInput
              inputWidth="full"
              name="search_query"
              id="search_query"
              placeholder={getContent(x => x.components.userSwitcher.searchBoxPlaceholder)}
              value={userSearchInput}
              onChange={e => {
                setUserSearchInput(e.target.value);
              }}
            />
          </FormGroup>
          <Button
            name="search_projects"
            type="button"
            secondary
            onClick={() => {
              setCurrentSearchInput(userSearchInput);
            }}
          >
            {getContent(x => x.components.userSwitcher.searchProjects)}
          </Button>
          <Button
            type="button"
            secondary
            name="reset_search_projects"
            onClick={() => {
              setUserSearchInput("");
              setCurrentSearchInput("");
            }}
          >
            {getContent(x => x.components.userSwitcher.resetSearchProjects)}
          </Button>
          {isMounted.isServer && <input type="hidden" name="current_url" value={returnLocation} />}
        </section>
      </Form>

      {isSubsetOfProjects && (
        <ValidationMessage message={x => x.components.userSwitcher.projectSubset} messageType="info" />
      )}

      <Form action={DeveloperUserSwitcherPage.routePath} onSubmit={noop}>
        {isLoading ? (
          <SimpleString>{getContent(x => x.components.userSwitcher.projectDropdownLoading)}</SimpleString>
        ) : projectOptions.length < 1 ? (
          <SimpleString>{getContent(x => x.components.userSwitcher.projectDropdownEmpty)}</SimpleString>
        ) : (
          <section>
            <input type="hidden" name="projectId" value={projectId} />
            <FormGroup data-qa="field-project__id">
              <DropdownSelect
                className="ifspa-developer-section-select"
                name="project_id"
                placeholder={getContent(x => x.components.userSwitcher.projectDropdownPlaceholder)}
                hasEmptyOption
                options={projectOptions}
                onChange={handleSelectChange}
                value={projectId ?? ""}
              ></DropdownSelect>
            </FormGroup>
            {isMounted.isServer && <input type="hidden" name="current_url" value={returnLocation} />}
            {isMounted.isServer && (
              <Button name="search">{getContent(x => x.components.userSwitcher.fetchUsers)}</Button>
            )}
          </section>
        )}
      </Form>
      {projectId && <UserSwitcherProjectSelectorPartnerSelector projectId={projectId} />}
    </>
  );
};

const UserSwitcherReset = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();

  return (
    <section data-qa="user-switcher-reset-section">
      <Form action={DeveloperUserSwitcherPage.routePath}>
        <input type="hidden" name="current_url" value={returnLocation} />
        <input type="hidden" name="reset" value="" />
        <Button name="stay" data-qa="reset-and-stay">
          {getContent(x => x.components.userSwitcher.resetAndStay)}
        </Button>
        <Button name="home" secondary data-qa="reset-and-home">
          {getContent(x => x.components.userSwitcher.resetAndHome)}
        </Button>
      </Form>
    </section>
  );
};

const UserSwitcherManualEmailEntry = () => {
  const { getContent } = useContent();
  const returnLocation = useReturnLocation();
  const { email: initialEmailState } = useUserContext();
  const [email, setEmail] = useState<string | undefined>(initialEmailState);

  return (
    <Form action={DeveloperUserSwitcherPage.routePath} onSubmit={noop}>
      <section>
        <H3>{getContent(x => x.components.userSwitcher.enterUserSubtitle)}</H3>

        <FormGroup>
          <TextInput
            aria-label="user"
            name="user"
            id="user-switcher-manual-input"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
        </FormGroup>

        <input type="hidden" name="current_url" value={returnLocation} />
        <Button name="stay" data-qa="manual-change-and-stay">
          {getContent(x => x.components.userSwitcher.manualSwitchAndStay)}
        </Button>
        <Button name="home" secondary data-qa="manual-change-and-home">
          {getContent(x => x.components.userSwitcher.manualSwitchAndHome)}
        </Button>
      </section>
    </Form>
  );
};

/**
 * A development user switching interface to help select a valid contact for projects.
 */
const UserSwitcher = () => {
  return (
    <Section title={x => x.components.userSwitcher.sectionTitle}>
      <UserSwitcherCurrentUser />
      <UserSwitcherReset />
      <UserSwitcherProjectSelector />
      <UserSwitcherManualEmailEntry />
    </Section>
  );
};

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

export { HiddenUserSwitcher, UserSwitcher };

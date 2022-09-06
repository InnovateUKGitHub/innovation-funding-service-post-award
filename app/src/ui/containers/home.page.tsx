import { useState } from "react";

import { Authorisation } from "@framework/types";
import { useStores } from "@ui/redux";
import { IClientConfig } from "@ui/redux/reducers/configReducer";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import * as ACC from "@ui/components";
import { PageTitle } from "@ui/features/page-title";
import { useContent } from "@ui/hooks";

function DevHomePage(props: BaseProps) {
  const { getContent } = useContent();
  const initialEmailState = useStores().users.getCurrentUser().email;

  const [userEmail, setUserEmail] = useState<string>(initialEmailState);

  const formData = { email: userEmail };
  const CurrentUserForm = ACC.TypedForm<typeof formData>();

  return (
    <>
      <PageTitle />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <ACC.H3 as="h2">{getContent(x => x.home.currentUserHeading)}</ACC.H3>

          <CurrentUserForm.Form data={formData} qa="currentUser" onChange={v => setUserEmail(v.email)}>
            <CurrentUserForm.String
              label="user"
              name="user"
              labelHidden
              value={x => x.email}
              update={(x, v) => (x.email = v || "")}
            />

            <CurrentUserForm.Submit>{getContent(x => x.home.changeUserMessage)}</CurrentUserForm.Submit>

            <CurrentUserForm.Button name="reset">{getContent(x => x.home.resetUserMessage)}</CurrentUserForm.Button>
          </CurrentUserForm.Form>
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <ACC.H3>
            <ACC.Link route={props.routes.projectDashboard.getLink({ search: undefined, filters: undefined })}>
              {getContent(x => x.home.projectsHeading)}
            </ACC.Link>
          </ACC.H3>

          <ACC.Renderers.SimpleString>{getContent(x => x.home.projectsDashboardHeading)}</ACC.Renderers.SimpleString>
        </div>

        <div className="govuk-grid-column-one-third">
          <ACC.H3>{getContent(x => x.home.exampleContentTitle)}</ACC.H3>

          <ACC.Renderers.SimpleString>{getContent(x => x.home.exampleContent)}</ACC.Renderers.SimpleString>
        </div>
      </div>
    </>
  );
}

export const HomeRoute = defineRoute({
  routeName: "home",
  routePath: "/",
  container: DevHomePage,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: {}, config: IClientConfig) => !config.ssoEnabled,
  getTitle: x => x.content.home.title(),
});

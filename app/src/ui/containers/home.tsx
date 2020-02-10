import React from "react";
import { Link, PageTitle, TypedForm } from "../components";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute, } from "./containerBase";
import { SimpleString } from "../components/renderers";
import { Authorisation } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { StoresConsumer } from "@ui/redux";
import { ContentConsumer } from "@ui/redux/contentProvider";
import * as ACC from "@ui/components";

interface Data {
  userEmail: string;
}

interface State {
  email: string;
}

class Component extends ContainerBaseWithState<{}, Data, {}, State> {
  constructor(props: ContainerProps<{}, Data, {}>) {
    super(props);
    this.state = { email: props.userEmail };
  }

  render() {
    const formData = ({ email: this.state && this.state.email });
    const CurrentUserForm = TypedForm<typeof formData>();
    return (
      <div>
        <PageTitle />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <h2>Current user</h2>
            <CurrentUserForm.Form data={formData} qa={"currentUser"} onChange={v => this.setState(v)}>
              <CurrentUserForm.String label="user" labelHidden={true} name="user" value={x => x.email} update={(x, v) => x.email = v || ""} />
              <CurrentUserForm.Submit>Change user</CurrentUserForm.Submit>
              <CurrentUserForm.Button name="reset">Reset user</CurrentUserForm.Button>
            </CurrentUserForm.Form>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={this.props.routes.projectDashboard.getLink({})}>Projects</Link></h2>
            <SimpleString>Projects dashboard</SimpleString>
          </div>
          <ContentConsumer>
            {
              content => (
                <div className="govuk-grid-column-one-third">
                  <h2><ACC.Content value={x => x.home.exampleContentTitle()} /></h2>
                  <SimpleString><ACC.Content value={x => x.home.exampleContent()} /></SimpleString>
                </div>
              )
            }
          </ContentConsumer>
        </div>
      </div>
    );
  }
}

const HomeContainer = (props: BaseProps) => (
  <StoresConsumer>
    {
      stores => <Component userEmail={stores.users.getCurrentUser().email} {...props} />
    }
  </StoresConsumer>
);

export const HomeRoute = defineRoute({
  routeName: "home",
  routePath: "/",
  container: HomeContainer,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: {}, config: IClientConfig) => !config.ssoEnabled,
  getTitle: ({ content }) => content.home.title()
});

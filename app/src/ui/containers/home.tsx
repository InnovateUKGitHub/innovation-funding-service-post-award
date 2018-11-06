import React from "react";
import { Link, Title, TypedForm } from "../components";
import { ContainerBaseWithState, ContainerProps, ReduxContainer, } from "./containerBase";
import { ContactListRoute, ProjectDashboardRoute, } from ".";
import { SimpleString } from "../components/renderers";

interface Props {
  userEmail: string;
}

interface State {
  email: string;
}

class Component extends ContainerBaseWithState<{}, Props, {}, State> {
  constructor(props: ContainerProps<{}, Props, {}>) {
    super(props);
    this.state = { email: props.userEmail };
  }

  render() {
    const formData = ({ email: this.state && this.state.email });
    const CurrentUserForm = TypedForm<typeof formData>();
    return (
      <div>
        <Title title="Home page" />
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <h2>Current user</h2>
            <CurrentUserForm.Form data={formData} onChange={v => this.setState(v)}>
              <CurrentUserForm.String label="" name="user" value={x => x.email} update={(x, v) => x.email = v || ""} />
              <CurrentUserForm.Submit>Change user</CurrentUserForm.Submit>
            </CurrentUserForm.Form>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ProjectDashboardRoute.getLink({})}>Projects</Link></h2>
            <SimpleString>Projects dashboard</SimpleString>
          </div>
          <div className="govuk-grid-column-one-third">
            <h2><Link route={ContactListRoute.getLink({})}>Contacts</Link></h2>
            <SimpleString>Some contacts from salesforce</SimpleString>
          </div>
        </div>
      </div>
    );
  }
}

const containerDefinition = ReduxContainer.for<{}, Props, {}>(Component);

export const Home = containerDefinition.connect({
  withData: (store) => ({ userEmail: store.user.email }),
  withCallbacks: () => ({})
});

export const HomeRoute = containerDefinition.route({
  routeName: "home",
  routePath: "/",
  getParams: () => ({}),
  getLoadDataActions: () => [],
  container: Home
});

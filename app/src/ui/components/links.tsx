import React from "react";
import { Link as RouterLink } from "react-router5";
import { RootState } from "../redux/reducers";
import { IClientUser } from "../../types";
import { ILinkInfo } from "../../types/ILinkInfo";
import { connect as reduxConnect } from "react-redux";
import { scrollToTheTopInstantly } from "../../util/windowHelpers";

interface Props {
  id?: string;
  route: ILinkInfo;
  className?: string;
}

interface Data {
  user: IClientUser;
  features: IFeatureFlags;
}

class LinkComponent extends React.Component<Props & Data> {
  private userHasAccess(route: ILinkInfo) {
    if (!route.accessControl) return true;
    return route.accessControl(this.props.user, this.props.features);
  }

  render() {
    const { id, route, children, className } = this.props;
    if (!this.userHasAccess(route)) return null;

    return (
      <RouterLink
        id={id}
        routeName={route.routeName}
        routeParams={route.routeParams}
        className={`govuk-link ${className}`}
        successCallback={scrollToTheTopInstantly}
      >
        {children}
      </RouterLink>
    );
  }
}
export const Link = reduxConnect<Data, {}, Props, RootState>(
  (state: RootState) => ({ user: state.user, features: state.config.features })
)(LinkComponent);

// TODO go back to same place in page (no scroll to top)
export const BackLink: React.SFC<Props> = (props) => (
  <RouterLink
    routeName={props.route.routeName}
    routeParams={props.route.routeParams}
    className={`govuk-back-link ${props.className}`}
  >
    {props.children}
  </RouterLink>
);

import React from "react";
import { Link as RouterLink } from "react-router5";
import { RootState } from "../redux/reducers";
import { IUser } from "../../types";
import { ILinkInfo } from "../../types/ILinkInfo";
import { connect as reduxConnect } from "react-redux";

interface Props {
  id?: string;
  route: ILinkInfo;
  className?: string;
  selected?: boolean;
}

interface Data {
  user: IUser;
}

class LinkComponent extends React.Component<Props & Data> {

  private userHasAccess(route: ILinkInfo) {
    if (!route.accessControl) return true;
    return route.accessControl(this.props.user);
  }

  render() {
    const { id, route, selected, children, className } = this.props;
    if (!this.userHasAccess(route)) return null;
    return (
      <RouterLink
        id={id}
        routeName={route.routeName}
        routeParams={route.routeParams}
        className={`govuk-link ${className}`}
        aria-selected={selected}
        successCallback={() => window.scrollTo(0, 0)}
      >{children}
      </RouterLink>
    );
  }
}
export const Link = reduxConnect<Data, {}, Props, RootState>(
  (state: RootState) => ({user: state.user})
)(LinkComponent);

// TODO go back to same place in page (no scroll to top)
export const BackLink: React.SFC<Props> = (props) => <RouterLink routeName={props.route.routeName} routeParams={props.route.routeParams} className={`govuk-back-link ${props.className}`}>{props.children}</RouterLink>;

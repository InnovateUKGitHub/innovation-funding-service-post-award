import React from "react";
import { ILinkInfo } from "@framework/types";
import { Link } from "./links";
import classNames from "classnames";

interface NavigationCardProps {
  label: string;
  route: ILinkInfo;
  qa: string;
  messages?: NavigationCardMessage[];
}

export interface NavigationCardMessage {
  message: string;
  isAlert: boolean;
}

export class NavigationCard extends React.Component<NavigationCardProps> {
  render() {
    return (
      <div className="card-link" data-qa={this.props.qa}>
        <Link className="govuk-link--no-underline" route={this.props.route}>
          <h2 className="govuk-link--underline">{this.props.label}</h2>
          {this.renderMessages()}
        </Link>
      </div>
    );
  }

  private renderMessages() {
    return (
      this.props.messages ?
        <div className={"card-link__messages"}> {this.props.messages.map(x => ( <h3 className={classNames( { "card-link__message": true, "card-link__message--alert": x.isAlert } )}> {x.message} </h3> ) )} </div>
        : null
    );
  }
}

interface NavigationCardsGridProps {
  children: React.ReactElement<NavigationCardProps>[];
}

export class NavigationCardsGrid extends React.Component<NavigationCardsGridProps> {
  render() {
    const children = React.Children.toArray(this.props.children);

    let current = 0;
    const results = [];
    while (current < children.length) {
      results.push(this.renderRow(children.slice(current, current + 3)));
      current = current + 3;
    }
    return results;
  }

  private renderRow(items: React.ReactElement<NavigationCardProps>[]) {
    return (
      <div className="govuk-grid-row card-link-grid">
        {items.map((x, i) => <div key={i} className="govuk-grid-column-one-third">{x}</div>)}
      </div>
    );
  }
}

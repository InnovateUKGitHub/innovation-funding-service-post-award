import React from "react";
import { ILinkInfo } from "@framework/types";
import { Link } from "./links";
import classNames from "classnames";
import { SimpleString } from "./renderers";

interface NavigationCardProps {
  label: React.ReactNode;
  route: ILinkInfo;
  qa: string;
  messages?: NavigationCardMessage[];
}

export interface NavigationCardMessage {
  message: React.ReactNode;
  isAlert?: boolean;
  qa?: string;
}

export class NavigationCard extends React.Component<NavigationCardProps> {
  render() {
    return (
      <div className="card-link" data-qa={this.props.qa}>
        <Link className="card-link__link" route={this.props.route}>
          <h2 className="card-link__title">{this.props.label}</h2>
          {this.renderMessages()}
        </Link>
      </div>
    );
  }

  private renderMessages() {
    return (
      this.props.messages ?
        <div className="card-link__messages"> {this.props.messages.map((x,i) => ( <SimpleString key={i} className={classNames( "card-link__message", { "card-link__message--alert": x.isAlert } )} qa={x.qa}> {x.message} </SimpleString> ) )} </div>
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
      // TODO: FIX this!!
      // @ts-ignore
      results.push(this.renderRow(children.slice(current, current + 3), Math.floor(current / 3)));
      current = current + 3;
    }
    return results;
  }

  private renderRow(items: React.ReactElement<NavigationCardProps>[], rowIndex: number) {
    return (
      <div className="govuk-grid-row card-link-grid" key={rowIndex}>
        {items.map((x, i) => <div key={i} className="govuk-grid-column-one-third">{x}</div>)}
      </div>
    );
  }
}

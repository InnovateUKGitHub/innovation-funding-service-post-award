import React from "react";
import { ILinkInfo } from "@framework/types";
import { Link } from "./links";
import { SimpleString } from "./renderers";

export interface NavigationCardMessage {
  message: React.ReactNode;
  qa?: string;
}

export interface NavigationCardProps {
  label: React.ReactNode;
  route: ILinkInfo;
  qa: string;
  messages?: NavigationCardMessage[];
}

// TODO: Refactor this component to be consumed via parent. E.G NavigationCardsGrid.Item = NavigationCard (Consume as <NavigationCardsGrid.Item ... />)
export function NavigationCard({ qa, label, route, messages = [] }: NavigationCardProps) {
  const hasMessages: boolean = !!messages.length;

  return (
    <div className="card-link" data-qa={qa}>
      <Link className="card-link__link" route={route}>
        <h2 className="card-link__title" data-qa="navigation-card-label">{label}</h2>

        {hasMessages && (
          <div className="card-link__messages" data-qa="navigation-card-list">
            {messages.map((x) => (
              <SimpleString key={x.qa} {...x} className="card-link__message">
                {x.message}
              </SimpleString>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
}

type NavigationCardsList = React.ReactElement<NavigationCardProps>[];

interface NavigationCardsGridProps {
  children: NavigationCardsList;
}

export function NavigationCardsGrid({ children }: NavigationCardsGridProps) {
  const childrenArray = React.Children.toArray(children);
  const chunkSize = 3;

  const gridLayout = chunks(childrenArray, chunkSize) as NavigationCardsList[];

  return (
    <>
      {gridLayout.map((group, groupIndex) => {
        const groupUid = `group-${groupIndex}`;

        return (
          <div key={groupUid} className="govuk-grid-row card-link-grid" data-qa="navigation-group">
            {group.map((navCard, rowIndex) => (
              <div key={`${groupUid}-row-${rowIndex}`} className="govuk-grid-column-one-third" data-qa="navigation-group-item">
                {navCard}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

export function chunks(array: any[], size: number): any[][] {
  const results = [];

  while (array.length) {
    results.push(array.splice(0, size));
  }

  return results;
}

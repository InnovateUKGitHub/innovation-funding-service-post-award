import { ILinkInfo } from "@framework/types/ILinkInfo";
import React from "react";
import { Link } from "@ui/components/atoms/Links/links";
import { SimpleString } from "../../atoms/SimpleString/simpleString";

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

export const NavigationCard = ({ qa, label, route, messages }: NavigationCardProps) => {
  return (
    <div className="card-link" data-qa={qa}>
      <Link className="card-link__link" route={route}>
        <h2 className="card-link__title" data-qa="navigation-card-label">
          {label}
        </h2>

        {!!messages?.length && (
          <div className="card-link__messages" data-qa="navigation-card-list">
            {messages.map(x => (
              <SimpleString key={x.qa} {...x} className="card-link__message">
                {x.message}
              </SimpleString>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
};

type NavigationCardsList = React.ReactElement<NavigationCardProps>[];

export const NavigationCardsGrid = ({ children }: { children: NavigationCardsList }) => {
  return <div className="govuk-grid-row card-link-grid">{children}</div>;
};

import React from "react";
import { IAppError } from "@framework/types";
import { Results } from "@ui/validation/results";
import * as ACC from "@ui/components";

interface Props {
  backLink: React.ReactNode | null;
  pageTitle: React.ReactNode;
  tabs?: React.ReactNode;
  error?: IAppError | null;
  validator?: Results<any> | null;
  messages?: string[];
}
export const Page: React.FunctionComponent<Props> = (props) => {
  const { pageTitle, backLink, error, validator, messages, tabs, children } = props;
  return (
    <div>
      {backLink && (<ACC.Section>{backLink}</ACC.Section>)}
      <ACC.Renderers.AriaLive>
        <ACC.ErrorSummary error={error} />
        <ACC.ValidationSummary validation={validator} compressed={false} />
      </ACC.Renderers.AriaLive>
      {pageTitle}
      {tabs}
      <ACC.Renderers.AriaLive>
        <ACC.Renderers.Messages messages={messages || []}/>
      </ACC.Renderers.AriaLive>
      {children}
    </div>
  );
};

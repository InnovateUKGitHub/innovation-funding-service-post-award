import React from "react";
import { IAppError, ProjectDto, ProjectStatus } from "@framework/types";
import { CombinedValidator, Results } from "@ui/validation";
import { AriaLive } from "../renderers/ariaLive";
import { ErrorSummary } from "../errorSummary";
import { Section } from "./section";
import { ValidationSummary } from "../validationSummary";
import { ValidationMessage } from "../validationMessage";

interface Props {
  backLink: React.ReactNode | null;
  pageTitle: React.ReactNode;
  error?: IAppError | null;
  validator?: Results<{}> | Results<{}>[] | null;
  project?: ProjectDto;
}

export const Page: React.FunctionComponent<Props> = (props) => {
  const { pageTitle, backLink, error, children, project } = props;
  const validation = props.validator !== undefined && Array.isArray(props.validator) ? new CombinedValidator(...props.validator) : props.validator;
  return (
    <div>
      {backLink && (<div className="govuk-grid-row"><div className="govuk-grid-column-full">{backLink}</div></div>)}
      <main className="govuk-main-wrapper" id="main-content" role="main" >
        <AriaLive>
          <ErrorSummary error={error} />
          <ValidationSummary validation={validation} compressed={false} />
        </AriaLive>
        {pageTitle}
        {renderOnHoldSection(project)}
        {children}
      </main>
    </div>
  );
};

const renderOnHoldSection = (project: ProjectDto | undefined) => {
  if (!!project && project.status === ProjectStatus.OnHold) {
    return (
      <Section>
        <ValidationMessage messageType={"info"} message={"This project is on hold. Contact Innovate UK for more information."} qa={"on-hold-info-message"}/>
      </Section>
    );
  }
  return null;
};

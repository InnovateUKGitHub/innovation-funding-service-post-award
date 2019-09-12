import React from "react";
import { IAppError, ProjectDto, ProjectStatus } from "@framework/types";
import * as ACC from "@ui/components";
import { CombinedValidator, Results } from "@ui/validation";

interface Props {
  backLink: React.ReactNode | null;
  pageTitle: React.ReactNode;
  error?: IAppError | null;
  validator?: Results<{}> | Results<{}>[];
  project?: ProjectDto;
}

export const Page: React.FunctionComponent<Props> = (props) => {
  const { pageTitle, backLink, error, children, project } = props;
  const validation = props.validator !== undefined && Array.isArray(props.validator) ? new CombinedValidator(...props.validator) : props.validator;
  return (
    <div>
      {backLink && (<div className="govuk-grid-row"><div className="govuk-grid-column-full">{backLink}</div></div>)}
      <main className="govuk-main-wrapper" id="main-content" role="main" >
        <ACC.Renderers.AriaLive>
          <ACC.ErrorSummary error={error} />
          <ACC.ValidationSummary validation={validation} compressed={false} />
        </ACC.Renderers.AriaLive>
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
      <ACC.Section>
        <ACC.ValidationMessage messageType={"info"} message={"This project is on hold. Contact Innovate UK for more information."} qa={"on-hold-info-message"}/>
      </ACC.Section>
    );
  }
  return null;
};

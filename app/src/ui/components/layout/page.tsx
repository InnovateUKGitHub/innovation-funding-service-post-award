import React from "react";
import { IAppError, PartnerDto, PartnerStatus, ProjectDto, ProjectStatus } from "@framework/types";
import { CombinedResultsValidator, Results } from "@ui/validation";
import { AriaLive } from "../renderers/ariaLive";
import { ErrorSummary } from "../errorSummary";
import { Section } from "./section";
import { ValidationSummary } from "../validationSummary";
import { ValidationMessage } from "../validationMessage";

export type PageValidationProjectStatus = ProjectDto["status"];
export type PageValidationPartnerStatus = PartnerDto["partnerStatus"];

export const usePageValidationMessage = (
  projectStatus?: PageValidationProjectStatus,
  partnerStatus?: PageValidationPartnerStatus,
) => {
  if (projectStatus === ProjectStatus.OnHold) {
    return "This project is on hold. Contact Innovate UK for more information.";
  }

  if (partnerStatus === PartnerStatus.OnHold) {
    return "Partner is on hold. Contact Innovate UK for more information.";
  }

  return null;
};

export interface PageProps {
  pageTitle: React.ReactElement<{}>;
  children: React.ReactNode;
  backLink?: React.ReactElement<{}>;
  error?: IAppError | null;
  validator?: Results<{}> | Results<{}>[] | null;
  project?: ProjectDto;
  partner?: PartnerDto;
}

export function Page({ pageTitle, backLink, error, children, project, partner, validator }: PageProps) {
  const validation = validator && Array.isArray(validator) ? new CombinedResultsValidator(...validator) : validator;
  const displayAriaLive: boolean = !!error || !!validation;

  const projectStatus = project && project.status;
  const partnerStatus = partner && partner.partnerStatus;

  const pageErrorMessage = usePageValidationMessage(projectStatus, partnerStatus);

  return (
    <div>
      {backLink && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full" data-qa="page-backlink">
            {backLink}
          </div>
        </div>
      )}

      <main className="govuk-main-wrapper" id="main-content" role="main">
        {displayAriaLive && (
          <AriaLive>
            {error && <ErrorSummary {...error} />}
            {validation && <ValidationSummary validation={validation} compressed={false} />}
          </AriaLive>
        )}

        {pageTitle}

        {pageErrorMessage && (
          <Section>
            <ValidationMessage messageType="info" qa="on-hold-info-message" message={pageErrorMessage} />
          </Section>
        )}

        {children}
      </main>
    </div>
  );
}

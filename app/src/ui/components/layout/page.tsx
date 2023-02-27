import React from "react";
import { IAppError, PartnerDto, PartnerStatus, ProjectDto, ProjectStatus } from "@framework/types";
import { CombinedResultsValidator, Results } from "@ui/validation";
import { useContent } from "@ui/hooks";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import { AriaLive } from "../renderers/ariaLive";
import { ErrorSummary } from "../errorSummary";
import { ValidationSummary } from "../validationSummary";
import { ValidationMessage } from "../validationMessage";
import { ProjectInactive } from "../ProjectInactive";
import { Section } from "./section";
import { GovWidthContainer } from ".";

export type PageValidationProjectStatus = ProjectDto["status"];
export type PageValidationPartnerStatus = PartnerDto["partnerStatus"];

export const usePageValidationMessage = (
  projectStatus?: PageValidationProjectStatus,
  partnerStatus?: PageValidationPartnerStatus,
) => {
  const { getContent } = useContent();

  if (projectStatus === ProjectStatus.OnHold) {
    return getContent(x => x.components.projectInactiveContent.projectOnHoldMessage);
  }

  switch (partnerStatus) {
    case PartnerStatus.OnHold:
      return getContent(x => x.components.projectInactiveContent.partnerOnHoldMessage);
    case PartnerStatus.InvoluntaryWithdrawal:
    case PartnerStatus.MigratedWithdrawn:
    case PartnerStatus.VoluntaryWithdrawal:
      return getContent(x => x.components.projectInactiveContent.partnerWithdrawal);
    default:
      return null;
  }
};

export interface PageProps {
  pageTitle: React.ReactElement<AnyObject>;
  children: React.ReactNode;
  backLink?: React.ReactElement<AnyObject>;
  error?: IAppError | null;

  validator?: Results<ResultBase> | Results<ResultBase>[] | null;
  /**
   * @deprecated
   */
  project?: { status: ProjectStatus };
  projectStatus?: ProjectStatus;
  /**
   * @deprecated
   */
  partner?: { partnerStatus: PartnerStatus };
  partnerStatus?: PartnerStatus;
  qa?: string;
  className?: string;
}

/**
 * Page Component
 */
export function Page({
  pageTitle,
  backLink,
  error,
  children,
  project,
  partner,
  validator,
  qa,
  className,
  projectStatus,
  partnerStatus,
}: PageProps) {
  const validation = validator && Array.isArray(validator) ? new CombinedResultsValidator(...validator) : validator;
  const displayAriaLive: boolean = !!error || !!validation;

  const pageErrorMessage = usePageValidationMessage(
    project?.status || projectStatus,
    partner?.partnerStatus || partnerStatus,
  );
  const projectState = useProjectStatus();

  const displayActiveUi: boolean = projectState.overrideAccess || projectState.isActive;

  return (
    <GovWidthContainer qa={qa} className={className}>
      {backLink && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full" data-qa="page-backlink">
            {backLink}
          </div>
        </div>
      )}

      <main className="govuk-main-wrapper" id="main-content" role="main">
        {displayActiveUi ? (
          <>
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
          </>
        ) : (
          <ProjectInactive />
        )}
      </main>
    </GovWidthContainer>
  );
}

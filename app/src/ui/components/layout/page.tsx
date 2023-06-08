import React from "react";
import { IAppError, PartnerStatus, ProjectStatus } from "@framework/types";
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

export const usePageValidationMessage = (projectStatus?: ProjectStatus, partnerStatus?: PartnerStatus) => {
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

  validator?: Results<ResultBase> | (null | undefined | Results<ResultBase>)[] | null | undefined;
  /**
   * should just pass in the `project.status` to the `projectStatus` prop.
   *
   * Do not need the whole dto object
   *
   * @deprecated
   */
  project?: { status: ProjectStatus };
  projectStatus?: ProjectStatus;
  /**
   * should just pass in the `partner.status` to the `partnerStatus` prop
   *
   * do not need the whole dto object
   *
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
  const validation = Array.isArray(validator) ? new CombinedResultsValidator(...validator) : validator;
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

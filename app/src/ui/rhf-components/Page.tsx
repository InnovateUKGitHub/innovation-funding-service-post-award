import React, { useEffect } from "react";
import { IAppError } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks/content.hook";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import { AriaLive } from "@ui/components/renderers/ariaLive";
import { ErrorSummary } from "@ui/components/errorSummary";
import { ValidationSummary } from "./ValidationSummary";
import { ValidationMessage } from "@ui/components/validationMessage";
import { ProjectInactive } from "@ui/components/ProjectInactive";
import { Section } from "@ui/components/layout/section";
import { GovWidthContainer } from "@ui/components/layout/GovWidthContainer";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { ProjectStatus } from "@framework/constants/project";
import { PartnerStatus } from "@framework/constants/partner";
import { FieldErrors } from "react-hook-form";

export const useInactiveMessage = (projectStatus?: ProjectStatus, partnerStatus?: PartnerStatus) => {
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
  apiError?: IAppError | null;
  validationErrors?: FieldErrors;
  projectStatus?: ProjectStatus;
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
  apiError,
  children,
  validationErrors,
  qa,
  className,
  projectStatus,
  partnerStatus,
}: PageProps) {
  const displayAriaLive: boolean = !!apiError || !!validationErrors;

  const inactiveMessage = useInactiveMessage(projectStatus, partnerStatus);
  const projectState = useProjectStatus();

  const displayActiveUi: boolean = projectState.overrideAccess || projectState.isActive;

  useEffect(() => {
    scrollToTheTopSmoothly();
  }, [apiError]);

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
                {apiError && <ErrorSummary {...apiError} />}
                {validationErrors && <ValidationSummary validationErrors={validationErrors} />}
              </AriaLive>
            )}

            {pageTitle}

            {inactiveMessage && (
              <Section>
                <ValidationMessage messageType="info" qa="on-hold-info-message" message={inactiveMessage} />
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

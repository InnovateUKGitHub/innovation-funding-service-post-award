import React from "react";
import { useContent } from "@ui/hooks/content.hook";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import { AriaLive } from "../../atomicDesign/atoms/AriaLive/ariaLive";
import { ErrorSummary } from "../../atomicDesign/molecules/ErrorSummary/ErrorSummary";
import { ValidationSummary } from "../../atomicDesign/molecules/validation/ValidationSummary/validationSummary";
import { ValidationMessage } from "../../atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { ProjectInactive } from "../../atomicDesign/molecules/ProjectInactive/ProjectInactive";
import { Section } from "../../atomicDesign/molecules/Section/section";
import { PartnerStatus } from "@framework/constants/partner";
import { ProjectStatus } from "@framework/constants/project";
import { IAppError } from "@framework/types/IAppError";
import { Results, CombinedResultsValidator } from "@ui/validation/results";
import { GovWidthContainer } from "../../atomicDesign/atoms/GovWidthContainer/GovWidthContainer";
import { FragmentContext } from "@gql/utils/fragmentContextHook";

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
  fragmentRef?: unknown;
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
  fragmentRef,
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
    <FragmentContext.Provider value={fragmentRef}>
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
    </FragmentContext.Provider>
  );
}

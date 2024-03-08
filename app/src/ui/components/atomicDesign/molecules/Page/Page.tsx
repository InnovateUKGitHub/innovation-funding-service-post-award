import React, { useEffect, useRef } from "react";
import { IAppError } from "@framework/types/IAppError";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { FragmentContext } from "@gql/utils/fragmentContextHook";
import { AriaLive } from "@ui/components/atomicDesign/atoms/AriaLive/ariaLive";
import { GovWidthContainer } from "@ui/components/atomicDesign/atoms/GovWidthContainer/GovWidthContainer";
import { ErrorSummary } from "@ui/components/atomicDesign/molecules/ErrorSummary/ErrorSummary";
import { ProjectInactive } from "@ui/components/atomicDesign/molecules/ProjectInactive/ProjectInactive";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import isNil from "lodash/isNil";
import { ValidationSummary } from "../../atoms/validation/ValidationSummary/ValidationSummary";
import { ProjectSuspensionMessageWithOptionalFragment } from "../../organisms/projects/ProjectSuspensionMessage/ProjectSuspensionMessage.withFragment";

export interface PageProps {
  pageTitle: React.ReactNode;
  children: React.ReactNode;
  backLink?: React.ReactNode;
  apiError?: IAppError | null;
  validationErrors?: RhfErrors;
  qa?: string;
  className?: string;
  bailoutErrorNavigation?: boolean;
  fragmentRef?: unknown;

  projectId?: ProjectId;
  partnerId?: PartnerId;
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
  projectId,
  partnerId,
  fragmentRef,
}: PageProps) {
  const displayAriaLive: boolean = !!apiError || !!validationErrors;

  const projectState = useProjectStatus();

  const displayActiveUi: boolean = projectState.overrideAccess || projectState.isActive;
  const validationErrorSize = isNil(validationErrors) ? 0 : Object.keys(validationErrors)?.length;

  // hasValidated tracks how many times the validation has occurred,
  // so that scroll to top is only called after the first time validation
  // messages appear
  const hasValidated = useRef(false);
  useEffect(() => {
    if (!hasValidated.current && validationErrorSize > 0) {
      scrollToTheTopSmoothly();
      hasValidated.current = true;
    }
  }, [apiError, validationErrorSize]);

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
                  {apiError && <ErrorSummary error={apiError} />}
                  {validationErrors && <ValidationSummary validationErrors={validationErrors} />}
                </AriaLive>
              )}

              {pageTitle}

              {projectId && (
                <ProjectSuspensionMessageWithOptionalFragment projectId={projectId} partnerId={partnerId} />
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

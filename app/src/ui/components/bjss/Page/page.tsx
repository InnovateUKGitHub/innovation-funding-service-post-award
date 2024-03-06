import { IAppError } from "@framework/types/IAppError";
import { FragmentContext } from "@gql/utils/fragmentContextHook";
import { ProjectSuspensionMessageWithOptionalFragment } from "@ui/components/atomicDesign/organisms/projects/ProjectSuspensionMessage/ProjectSuspensionMessage.withFragment";
import { useProjectStatus } from "@ui/hooks/project-status.hook";
import { CombinedResultsValidator, Results } from "@ui/validation/results";
import React from "react";
import { AriaLive } from "../../atomicDesign/atoms/AriaLive/ariaLive";
import { GovWidthContainer } from "../../atomicDesign/atoms/GovWidthContainer/GovWidthContainer";
import { ErrorSummary } from "../../atomicDesign/molecules/ErrorSummary/ErrorSummary";
import { ProjectInactive } from "../../atomicDesign/molecules/ProjectInactive/ProjectInactive";
import { ValidationSummary } from "../../atomicDesign/molecules/validation/ValidationSummary/validationSummary";

export interface PageProps {
  pageTitle: React.ReactElement<AnyObject>;
  children: React.ReactNode;
  backLink?: React.ReactElement<AnyObject>;
  error?: IAppError | null;
  validator?: Results<ResultBase> | (null | undefined | Results<ResultBase>)[] | null | undefined;
  qa?: string;
  className?: string;
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
  error,
  children,
  projectId,
  partnerId,
  validator,
  qa,
  className,
  fragmentRef,
}: PageProps) {
  const validation = Array.isArray(validator) ? new CombinedResultsValidator(...validator) : validator;
  const displayAriaLive: boolean = !!error || !!validation;

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
                  {error && <ErrorSummary error={error} />}
                  {validation && <ValidationSummary validation={validation} compressed={false} />}
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

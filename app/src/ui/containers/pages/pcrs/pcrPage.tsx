import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "./pcrItemWorkflow";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Messages } from "@ui/components/molecules/Messages/messages";
import { Section } from "@ui/components/atoms/Section/Section";
import { Markdown } from "@ui/components/atoms/Markdown/markdown";
import { NavigationArrowsForPCRs } from "./navigationArrows.withFragment";
import { IAppError } from "@framework/types/IAppError";
import { Results } from "@ui/validation/results";
import { useScrollToTopSmoothly } from "@framework/util/windowHelpers";
import { getDisplayName } from "./pcrItemWorkflow.logic";

export const PcrPage = ({
  children,
  apiError: pcrLevelApiError,
  validationErrors,
  backLink,
}: {
  children: React.ReactNode;
  apiError?: IAppError<Results<ResultBase>> | null | undefined;
  validationErrors?: RhfErrors;
  backLink?: React.ReactNode;
}) => {
  const { workflow, pcrItem, mode, step, apiError, fragmentRef, messages, routes } = usePcrWorkflowContext();

  useScrollToTopSmoothly([step]);

  const isPrepareMode = mode === "prepare";
  const isFirstStep = step === 1;
  const displayGuidance = isPrepareMode && isFirstStep && !!pcrItem?.guidance;

  const isReviewing = mode === "review";
  const displayNavigationArrows = (workflow.isOnSummary() && mode === "review") || mode === "details";

  return (
    <Page
      backLink={backLink ?? <PcrBackLink />}
      fragmentRef={fragmentRef}
      validationErrors={validationErrors}
      apiError={pcrLevelApiError ?? apiError}
      heading={getDisplayName(pcrItem.typeName)}
    >
      <Messages messages={messages} />

      {displayGuidance && (
        <Section data-qa="guidance">
          <Markdown trusted value={pcrItem?.guidance ?? ""} />
        </Section>
      )}

      {children}

      {displayNavigationArrows && (
        <NavigationArrowsForPCRs currentItem={pcrItem} isReviewing={isReviewing} routes={routes} />
      )}
    </Page>
  );
};

export const PcrBackLink = () => {
  const { mode, routes, projectId, pcrId } = usePcrWorkflowContext();
  const { getContent } = useContent();

  if (mode === "review") {
    return (
      <BackLink route={routes.pcrReview.getLink({ projectId, pcrId })}>
        {getContent(x => x.pages.pcrItemWorkflow.backToRequest)}
      </BackLink>
    );
  }
  if (mode === "prepare") {
    return (
      <BackLink route={routes.pcrPrepare.getLink({ projectId, pcrId })}>
        {getContent(x => x.pages.pcrItemWorkflow.backToRequest)}
      </BackLink>
    );
  }
  return (
    <BackLink route={routes.pcrDetails.getLink({ projectId, pcrId })}>
      {getContent(x => x.pages.pcrItemWorkflow.backToRequest)}
    </BackLink>
  );
};

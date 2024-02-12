import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";
import { NavigationArrowsForPCRs } from "./navigationArrows.withFragment";
import { useGetPcrItemMetadata } from "./utils/useGetPcrItemMetadata";
import { IAppError } from "@framework/types/IAppError";
import { Results } from "@ui/validation/results";
import { useScrollToTopSmoothly } from "@framework/util/windowHelpers";

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
  const { workflow, pcrItem, mode, step, project, apiError, fragmentRef, messages, routes } = usePcrWorkflowContext();
  const { getPcrItemContent } = useGetPcrItemMetadata();

  useScrollToTopSmoothly([step]);

  const isPrepareMode = mode === "prepare";
  const isFirstStep = step === 1;
  const displayGuidance = isPrepareMode && isFirstStep && !!pcrItem?.guidance;

  const isReviewing = mode === "review";
  const displayNavigationArrows = (workflow.isOnSummary() && mode === "review") || mode === "view";

  const content = getPcrItemContent(pcrItem.type);

  return (
    <Page
      backLink={backLink ?? <PcrBackLink />}
      pageTitle={<Title heading={content.name} />}
      projectStatus={project.status}
      fragmentRef={fragmentRef}
      validationErrors={validationErrors}
      apiError={pcrLevelApiError ?? apiError}
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

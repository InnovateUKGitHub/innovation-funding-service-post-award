import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";
import { NavigationArrowsForPCRs } from "./navigationArrows.withFragment";

export const PcrPage = ({ children, validationErrors }: { children: React.ReactNode; validationErrors: RhfErrors }) => {
  const { workflow, pcrItem, mode, step, project, apiError, fragmentRef, messages, routes } = usePcrWorkflowContext();

  const isPrepareMode = mode === "prepare";
  const isFirstStep = step === 1;
  const displayGuidance = isPrepareMode && isFirstStep && !!pcrItem?.guidance;

  const isReviewing = mode === "review";
  const displayNavigationArrows = (workflow.isOnSummary() && mode === "review") || mode === "view";

  return (
    <Page
      backLink={<PcrBackLink />}
      pageTitle={<Title heading={pcrItem.typeName} />}
      projectStatus={project.status}
      fragmentRef={fragmentRef}
      validationErrors={validationErrors}
      apiError={apiError}
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
import { ProjectRole } from "@framework/constants/project";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { PCRReasoningSummary } from "./pcrReasoningSummary";
import {
  IReasoningWorkflowMetadata,
  reasoningWorkflowSteps,
} from "@ui/containers/pages/pcrs/reasoning/workflowMetadata";
import { BaseProps, defineRoute } from "../../../containerBase";
import { Mode, useOnSavePcrReasoning, usePcrReasoningQuery } from "./pcrReasoningWorkflow.logic";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { pcrReasoningWorkflowQuery } from "./PcrReasoningWorkflow.query";
import { useGetPcrTypeName } from "../utils/useGetPcrTypeName";
import { useScrollToTopSmoothly } from "@framework/util/windowHelpers";
import { useState } from "react";
import { PcrReasoningContext, usePcrReasoningContext } from "./pcrReasoningContext";

export interface ProjectChangeRequestPrepareReasoningParams {
  projectId: ProjectId;
  pcrId: PcrId;
  step?: number;
}

const PcrReasoningWorkflow = (props: BaseProps & ProjectChangeRequestPrepareReasoningParams & { mode: Mode }) => {
  useScrollToTopSmoothly([props.step]);
  const [refreshedQueryOptions] = useRefreshQuery(pcrReasoningWorkflowQuery, {
    projectId: props.projectId,
    pcrId: props.pcrId,
  });
  const { project, pcr, documents, editableItemTypes } = usePcrReasoningQuery(
    props.projectId,
    props.pcrId,
    refreshedQueryOptions,
  );

  const { isFetching, onUpdate, apiError } = useOnSavePcrReasoning(props.projectId, props.pcrId, pcr);

  const [markedAsCompleteHasBeenChecked, setMarkedAsCompleteHasBeenChecked] = useState(false);
  return (
    <PcrReasoningContext.Provider
      value={{
        projectId: props.projectId,
        pcrId: props.pcrId,
        stepNumber: props.step,
        pcr,
        mode: props.mode,
        isFetching,
        onUpdate,
        documents,
        apiError,
        messages: props.messages,
        project,
        routes: props.routes,
        config: props.config,
        editableItemTypes,
        markedAsCompleteHasBeenChecked,
        setMarkedAsCompleteHasBeenChecked,
      }}
    >
      {props.mode === "prepare" && !!props.step && <Step stepNumber={props.step} />}
      {!props.step && <PCRReasoningSummary />}
    </PcrReasoningContext.Provider>
  );
};

export const PcrItemListSection = () => {
  const { pcr } = usePcrReasoningContext();
  const getPcrTypeName = useGetPcrTypeName();
  return (
    <Section>
      <SummaryList qa="pcr-prepareReasoning">
        <SummaryListItem label={x => x.pcrLabels.requestNumber} content={pcr.requestNumber} qa="numberRow" />
        <SummaryListItem
          label={x => x.pcrLabels.types}
          content={<LineBreakList items={pcr.items.map(x => getPcrTypeName(x.shortName))} />}
          qa="typesRow"
        />
      </SummaryList>
    </Section>
  );
};

const Step = ({ stepNumber }: { stepNumber: number }) => {
  const step = findStepByNumber(stepNumber);

  return <>{step.stepRender()}</>;
};

const findStepByNumber = (stepNumber: number) => {
  const step = reasoningWorkflowSteps.find(x => x.stepNumber === stepNumber);
  if (!step) {
    throw Error("No such step in workflow");
  }
  return step;
};

export const getStepLink = (
  stepName: IReasoningWorkflowMetadata["stepName"],
  projectId: ProjectId,
  pcrId: PcrId,
  routes: BaseProps["routes"],
) => {
  return routes.pcrPrepareReasoning.getLink({
    projectId,
    pcrId,
    step: findStepByName(stepName).stepNumber,
  });
};

export const findStepByName = (stepName: IReasoningWorkflowMetadata["stepName"]) => {
  const step = reasoningWorkflowSteps.find(x => x.stepName === stepName);
  if (!step) {
    throw Error("No such step in workflow");
  }
  return step;
};

export const PCRViewReasoningRoute = defineRoute<ProjectChangeRequestPrepareReasoningParams>({
  allowRouteInActiveAccess: true,
  routeName: "pcrViewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/reasoning",
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  container: function PCRViewReasoningWorkflowContainer(props) {
    return <PcrReasoningWorkflow mode="view" {...props} />;
  },
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrReasoningWorkflow.title),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});

export const PCRReviewReasoningRoute = defineRoute<ProjectChangeRequestPrepareReasoningParams>({
  routeName: "pcrReviewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/reasoning",
  container: function PCRReviewReasoningWorkflowContainer(props) {
    return <PcrReasoningWorkflow mode="review" {...props} />;
  },
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrReasoningWorkflow.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer),
});

export const PCRPrepareReasoningRoute = defineRoute<ProjectChangeRequestPrepareReasoningParams>({
  routeName: "pcrPrepareReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning",
  routePathWithQuery: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning?:step",
  container: function PCRPrepareReasoningWorkflowContainer(props) {
    return <PcrReasoningWorkflow mode="prepare" {...props} />;
  },
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    step: parseInt(route.params.step, 10),
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrReasoningPrepareReasoning.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

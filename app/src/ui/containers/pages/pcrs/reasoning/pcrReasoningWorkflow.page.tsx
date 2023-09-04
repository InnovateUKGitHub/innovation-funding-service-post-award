import { PCRItemStatus, PCRStepId } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Pending } from "@shared/pending";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";

import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { PCRReasoningSummary } from "./pcrReasoningSummary";
import {
  IReasoningWorkflowMetadata,
  reasoningWorkflowSteps,
} from "@ui/containers/pages/pcrs/reasoning/workflowMetadata";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "../../../containerBase";
import { usePcrReasoningQuery } from "./pcrReasoningWorkflow.logic";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { RefreshedQueryOptions, useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { pcrReasoningWorkflowQuery } from "./PcrReasoningWorkflow.query";
import { useGetPcrTypeName } from "../utils/useGetPcrTypeName";

export interface ProjectChangeRequestPrepareReasoningParams {
  projectId: ProjectId;
  pcrId: PcrId;
  step?: number;
}

type PCRTypeForPcrReasoning = Pick<
  Omit<PCRDto, "items">,
  "reasoningComments" | "requestNumber" | "projectId" | "id"
> & {
  items: Pick<FullPCRItemDto, "shortName" | "id" | "type" | "typeName">[];
};

interface Data {
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
  mode: "prepare" | "review" | "view";
  refreshedQueryOptions: RefreshedQueryOptions;
}

interface ResolvedData {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  mode: "prepare" | "review" | "view";
  refreshedQueryOptions: RefreshedQueryOptions;
}

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
  refresh: () => void;
}

const PCRReasoningComponentLoader = (
  props: BaseProps & ProjectChangeRequestPrepareReasoningParams & Data & Callbacks,
) => {
  const combined = Pending.combine({
    editor: props.editor,
    documentsEditor: props.documentsEditor,
  });

  return <PageLoader pending={combined} render={x => <PCRReasoningWorkflowComponent {...props} {...x} />} />;
};

const PCRReasoningWorkflowComponent = (
  props: BaseProps & ProjectChangeRequestPrepareReasoningParams & ResolvedData & Callbacks,
) => {
  const { editor, documentsEditor, projectId, mode, pcrId, routes, refreshedQueryOptions } = props;

  const { project, pcr, documents, editableItemTypes } = usePcrReasoningQuery(projectId, pcrId, refreshedQueryOptions);
  const getPcrTypeName = useGetPcrTypeName();

  return (
    <Page
      backLink={getBackLink({ mode, projectId, pcrId, routes })}
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
      projectStatus={project.status}
      error={editor.error || documentsEditor.error}
      // If we are on the final summary step, remove all the validators.
      validator={!props.step ? [] : [editor.validator, documentsEditor.validator]}
    >
      {!!props.step && <Messages messages={props.messages} />}
      {props.mode === "prepare" &&
        !!props.step &&
        renderStep(props.step, pcr, editor, documentsEditor, { documents, ...props }, getPcrTypeName)}
      {!props.step && (
        <PCRReasoningSummary
          {...props}
          pcr={pcr}
          editor={editor}
          onSave={(dto: PCRDto) => onSave(props.step, props.onSave, props.routes, props.projectId, props.pcrId)(dto)}
          onChange={dto => props.onChange(dto)}
          getStepLink={(stepName: IReasoningWorkflowMetadata["stepName"]) =>
            getStepLink(stepName, projectId, pcrId, routes)
          }
          documents={documents}
          editableItemTypes={editableItemTypes}
        />
      )}
    </Page>
  );
};

const getBackLink = (props: {
  mode: ResolvedData["mode"];
  projectId: ProjectId;
  pcrId: PcrId;
  routes: BaseProps["routes"];
}) => {
  if (props.mode === "review") {
    return (
      <BackLink route={props.routes.pcrReview.getLink({ projectId: props.projectId, pcrId: props.pcrId })}>
        <Content value={x => x.pages.pcrReasoningWorkflow.backLink} />
      </BackLink>
    );
  }
  if (props.mode === "prepare") {
    return (
      <BackLink route={props.routes.pcrPrepare.getLink({ projectId: props.projectId, pcrId: props.pcrId })}>
        <Content value={x => x.pages.pcrReasoningWorkflow.backLink} />
      </BackLink>
    );
  }
  return (
    <BackLink route={props.routes.pcrDetails.getLink({ projectId: props.projectId, pcrId: props.pcrId })}>
      <Content value={x => x.pages.pcrReasoningWorkflow.backLink} />
    </BackLink>
  );
};

const renderStep = (
  stepNumber: number,
  pcr: PCRTypeForPcrReasoning,
  editor: IEditorStore<PCRDto, PCRDtoValidator>,
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
  props: BaseProps &
    ProjectChangeRequestPrepareReasoningParams &
    ResolvedData &
    Callbacks & { documents: DocumentSummaryDto[]; refresh: () => void },
  getPcrTypeName: (name: string) => string,
) => {
  const step = findStepByNumber(stepNumber);

  return (
    <>
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
      {step.stepRender({
        ...props,
        onChange: (dto: PCRDto) => props.onChange(dto),
        onSave: (dto: PCRDto) => onSave(stepNumber, props.onSave, props.routes, props.projectId, props.pcrId)(dto),
        editor,
        documentsEditor,
      })}
    </>
  );
};

const findStepByNumber = (stepNumber: number) => {
  const step = reasoningWorkflowSteps.find(x => x.stepNumber === stepNumber);
  if (!step) {
    throw Error("No such step in workflow");
  }
  return step;
};

const onSave =
  (
    step: number | undefined,
    onSave: Callbacks["onSave"],
    routes: BaseProps["routes"],
    projectId: ProjectId,
    pcrId: PcrId,
  ) =>
  (dto: PCRDto) => {
    // If on the summary
    if (!step) {
      // submit and go back to the prepare page
      return onSave(
        dto,
        routes.pcrPrepare.getLink({
          projectId,
          pcrId,
        }),
      );
    }

    // If submitting from a step set the status to incomplete
    dto.reasoningStatus = PCRItemStatus.Incomplete;

    // If on the last step go to the summary
    // If not on the last step go to the next step
    return onSave(
      dto,
      routes.pcrPrepareReasoning.getLink({
        projectId,
        pcrId,
        step: step === reasoningWorkflowSteps.length ? undefined : step + 1,
      }),
    );
  };

const getStepLink = (
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

const findStepByName = (stepName: IReasoningWorkflowMetadata["stepName"]) => {
  const step = reasoningWorkflowSteps.find(x => x.stepName === stepName);
  if (!step) {
    throw Error("No such step in workflow");
  }
  return step;
};

const PCRReasoningWorkflowContainer = (
  props: ProjectChangeRequestPrepareReasoningParams & BaseProps & { mode: "prepare" | "review" | "view" },
) => {
  const navigate = useNavigate();
  const stores = useStores();

  const [refreshedQueryOptions, refresh] = useRefreshQuery(pcrReasoningWorkflowQuery, {
    projectId: props.projectId,
    pcrId: props.pcrId,
  });

  return (
    <PCRReasoningComponentLoader
      {...props}
      editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
      documentsEditor={stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(
        props.projectId,
        props.pcrId,
      )}
      onSave={(dto, link) => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor({
          saving: true,
          projectId: props.projectId,
          pcrStepId: PCRStepId.reasoningStep,
          dto,
          message: undefined,
          onComplete: () => {
            refresh();
            navigate(link.path);
          },
        });
      }}
      onChange={dto => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor({
          saving: false,
          projectId: props.projectId,
          pcrStepId: PCRStepId.reasoningStep,
          dto,
        });
      }}
      refresh={refresh}
      refreshedQueryOptions={refreshedQueryOptions}
    />
  );
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
    return <PCRReasoningWorkflowContainer mode="view" {...props} />;
  },
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrReasoningWorkflow.title),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});

export const PCRReviewReasoningRoute = defineRoute<ProjectChangeRequestPrepareReasoningParams>({
  routeName: "pcrReviewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/reasoning",
  container: function PCRReviewReasoningWorkflowContainer(props) {
    return <PCRReasoningWorkflowContainer mode="review" {...props} />;
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
    return <PCRReasoningWorkflowContainer mode="prepare" {...props} />;
  },
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    step: parseInt(route.params.step, 10),
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrReasoningPrepareReasoning.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

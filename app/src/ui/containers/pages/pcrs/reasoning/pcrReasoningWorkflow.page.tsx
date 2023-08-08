import { PCRItemStatus, PCRStepId } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
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
import { BaseProps, ContainerBase, defineRoute } from "../../../containerBase";

export interface ProjectChangeRequestPrepareReasoningParams {
  projectId: ProjectId;
  pcrId: PcrId;
  step?: number;
}

type PCRTypeForPcrReasoning = Pick<
  Omit<PCRDto, "items">,
  "reasoningComments" | "requestNumber" | "projectId" | "id"
> & {
  items: Pick<PCRItemDto, "shortName" | "id" | "type" | "typeName">[];
};

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRTypeForPcrReasoning>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
  mode: "prepare" | "review" | "view";
}

interface ResolvedData {
  project: ProjectDto;
  pcr: PCRTypeForPcrReasoning;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  mode: "prepare" | "review" | "view";
}

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
}

class PCRReasoningComponentLoader extends ContainerBase<ProjectChangeRequestPrepareReasoningParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editor: this.props.editor,
      documentsEditor: this.props.documentsEditor,
    });

    return <PageLoader pending={combined} render={x => <PCRReasoningWorkflowComponent {...this.props} {...x} />} />;
  }
}

class PCRReasoningWorkflowComponent extends ContainerBase<
  ProjectChangeRequestPrepareReasoningParams,
  ResolvedData,
  Callbacks
> {
  render() {
    const { project, pcr, editor, documentsEditor } = this.props;
    return (
      <Page
        backLink={this.getBackLink()}
        pageTitle={<Title {...project} />}
        projectStatus={project.status}
        error={editor.error || documentsEditor.error}
        // If we are on the final summary step, remove all the validators.
        validator={!this.props.step ? [] : [editor.validator, documentsEditor.validator]}
      >
        {!!this.props.step && <Messages messages={this.props.messages} />}
        {this.props.mode === "prepare" &&
          !!this.props.step &&
          this.renderStep(this.props.step, pcr, editor, documentsEditor)}
        {!this.props.step && this.renderSummary(pcr, editor)}
      </Page>
    );
  }

  private findStepByNumber(stepNumber: number) {
    const step = reasoningWorkflowSteps.find(x => x.stepNumber === stepNumber);
    if (!step) {
      throw Error("No such step in workflow");
    }
    return step;
  }

  private findStepByName(stepName: IReasoningWorkflowMetadata["stepName"]) {
    const step = reasoningWorkflowSteps.find(x => x.stepName === stepName);
    if (!step) {
      throw Error("No such step in workflow");
    }
    return step;
  }

  private getStepLink(stepName: IReasoningWorkflowMetadata["stepName"]) {
    return this.props.routes.pcrPrepareReasoning.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      step: this.findStepByName(stepName).stepNumber,
    });
  }

  private getBackLink() {
    if (this.props.mode === "review") {
      return (
        <BackLink
          route={this.props.routes.pcrReview.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
        >
          <Content value={x => x.pages.pcrReasoningWorkflow.backLink} />
        </BackLink>
      );
    }
    if (this.props.mode === "prepare") {
      return (
        <BackLink
          route={this.props.routes.pcrPrepare.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
        >
          <Content value={x => x.pages.pcrReasoningWorkflow.backLink} />
        </BackLink>
      );
    }
    return (
      <BackLink
        route={this.props.routes.pcrDetails.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
      >
        <Content value={x => x.pages.pcrReasoningWorkflow.backLink} />
      </BackLink>
    );
  }

  private renderStep(
    stepNumber: number,
    pcr: PCRTypeForPcrReasoning,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
  ) {
    const step = this.findStepByNumber(stepNumber);
    return (
      <>
        <Section>
          <SummaryList qa="pcr-prepareReasoning">
            <SummaryListItem label={x => x.pcrLabels.requestNumber} content={pcr.requestNumber} qa="numberRow" />
            <SummaryListItem
              label={x => x.pcrLabels.types}
              content={<LineBreakList items={pcr.items.map(x => x.shortName)} />}
              qa="typesRow"
            />
          </SummaryList>
        </Section>
        {stepNumber === 1 && this.renderGuidanceSection()}
        {step.stepRender({
          ...this.props,
          onChange: (dto: PCRDto) => this.props.onChange(dto),
          onSave: (dto: PCRDto) => this.onSave(dto),
          editor,
          documentsEditor,
        })}
      </>
    );
  }

  private renderSummary(pcr: PCRTypeForPcrReasoning, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    return (
      <PCRReasoningSummary
        {...this.props}
        pcr={pcr}
        editor={editor}
        onSave={(dto: PCRDto) => this.onSave(dto)}
        onChange={dto => this.props.onChange(dto)}
        getStepLink={(stepName: IReasoningWorkflowMetadata["stepName"]) => this.getStepLink(stepName)}
      />
    );
  }

  private renderGuidanceSection() {
    return null;
    // TODO clarify what guidance on a reasoning page should be.
    // if (!pcr.guidance) return null;
    // return (
    //   <Section qa="guidance">
    //     <SimpleString>{pcr.guidance}</SimpleString>
    //   </Section>
    // );
  }

  private onSave(dto: PCRDto) {
    // If on the summary
    if (!this.props.step) {
      // submit and go back to the prepare page
      return this.props.onSave(
        dto,
        this.props.routes.pcrPrepare.getLink({
          projectId: this.props.projectId,
          pcrId: this.props.pcrId,
        }),
      );
    }

    // If submitting from a step set the status to incomplete
    dto.reasoningStatus = PCRItemStatus.Incomplete;

    // If on the last step go to the summary
    // If not on the last step go to the next step
    return this.props.onSave(
      dto,
      this.props.routes.pcrPrepareReasoning.getLink({
        projectId: this.props.projectId,
        pcrId: this.props.pcrId,
        step: this.props.step === reasoningWorkflowSteps.length ? undefined : this.props.step + 1,
      }),
    );
  }
}

const PCRReasoningWorkflowContainer = (
  props: ProjectChangeRequestPrepareReasoningParams & BaseProps & { mode: "prepare" | "review" | "view" },
) => {
  const navigate = useNavigate();
  const stores = useStores();

  return (
    <PCRReasoningComponentLoader
      {...props}
      project={stores.projects.getById(props.projectId)}
      pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
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
          onComplete: () => navigate(link.path),
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

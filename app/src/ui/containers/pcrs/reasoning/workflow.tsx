import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../../containerBase";
import { ILinkInfo, PCRItemStatus, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../../components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { PCRReasoningSummary } from "@ui/containers/pcrs/reasoning/summary";
import { IReasoningWorkflowMetadata, reasoningWorkflowSteps } from "@ui/containers/pcrs/reasoning/workflowMetadata";

export interface ProjectChangeRequestPrepareReasoningParams {
  projectId: string;
  pcrId: string;
  step?: number;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  mode: "prepare" | "review" | "view";
}

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
}

class PCRReasoningWorkflowComponent extends ContainerBase<ProjectChangeRequestPrepareReasoningParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editor: this.props.editor
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.pcr)}/>;
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
      step: this.findStepByName(stepName).stepNumber
    });
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, pcr: PCRDto) {
    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project}/>}
        project={project}
        validator={[editor.validator]}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages}/>

        {this.props.mode === "prepare" && !!this.props.step && this.renderStep(this.props.step, pcr, editor)}
        {!this.props.step && this.renderSummary(pcr, editor)}

      </ACC.Page>
    );
  }

  private getBackLink() {
    if (this.props.mode === "review") {
      return <ACC.BackLink route={this.props.routes.pcrReview.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>;
    }
    if (this.props.mode === "prepare") {
      return <ACC.BackLink route={this.props.routes.pcrPrepare.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>;
    }
    return <ACC.BackLink route={this.props.routes.pcrDetails.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>;
  }

  private renderStep(stepNumber: number, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const step = this.findStepByNumber(stepNumber);
    return (
      <React.Fragment>
        <ACC.Section>
          <ACC.SummaryList qa="pcr-prepareReasoning">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="numberRow"/>
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.shortName)}/>} qa="typesRow"/>
          </ACC.SummaryList>
        </ACC.Section>
        { stepNumber === 1 && this.renderGuidanceSection(editor.data) }
        {step.stepRender({
          ...this.props,
          onChange: (dto: PCRDto) => this.props.onChange(dto),
          onSave: (dto: PCRDto) => this.onSave(dto),
          editor,
        })}
      </React.Fragment>
    );
  }

  private renderSummary(pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    return (
      <PCRReasoningSummary
        {...this.props}
        pcr={pcr}
        editor={editor}
        onSave={(dto: PCRDto) => this.onSave(dto)}
        onChange={(dto) => this.props.onChange(dto)}
        getStepLink={(stepName: IReasoningWorkflowMetadata["stepName"]) => this.getStepLink(stepName)}
      />
    );
  }

  private renderGuidanceSection(pcr: PCRDto) {
    if (!pcr.guidance) return null;
    return (
      <ACC.Section qa="guidance">
        <ACC.Renderers.SimpleString>{pcr.guidance}</ACC.Renderers.SimpleString>
      </ACC.Section>
    );
  }

  private onSave(dto: PCRDto) {
    // If on the summary
    if (!this.props.step) {
      // submit and go back to the prepare page
      return this.props.onSave(dto, this.props.routes.pcrPrepare.getLink({
        projectId: this.props.projectId,
        pcrId: this.props.pcrId
      }));
    }

    // If submitting from a step set the status to incomplete
    dto.reasoningStatus = PCRItemStatus.Incomplete;

    // If on the last step go to the summary
    // If not on the last step go to the next step
    return this.props.onSave(dto, this.props.routes.pcrPrepareReasoning.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      step: this.props.step === reasoningWorkflowSteps.length ? undefined : this.props.step + 1
    }));
  }
}

const PCRReasoningWorkflowContainer = (props: ProjectChangeRequestPrepareReasoningParams & BaseProps & { mode: "prepare" | "review" | "view" }) => (
  <StoresConsumer>
    {stores => (
      <PCRReasoningWorkflowComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
        onSave={(dto, link) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(true, props.projectId, dto, undefined, () =>
            stores.navigation.navigateTo(link));
        }}
        onChange={(dto) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PCRViewReasoningRoute = defineRoute<ProjectChangeRequestPrepareReasoningParams>({
  routeName: "pcrViewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/reasoning",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  container: (props) => <PCRReasoningWorkflowContainer mode="view" {...props}/>,
  getTitle: () => ({
    // tslint:disable-next-line no-duplicate-string
    htmlTitle: "Reasoning for Innovate UK",
    displayTitle: "Reasoning for Innovate UK"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});

export const PCRReviewReasoningRoute = defineRoute<ProjectChangeRequestPrepareReasoningParams>({
  routeName: "pcrReviewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/reasoning",
  container: (props) => <PCRReasoningWorkflowContainer mode="review" {...props}/>,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getTitle: () => ({
    htmlTitle: "Reasoning for Innovate UK",
    displayTitle: "Reasoning for Innovate UK"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
});

export const PCRPrepareReasoningRoute = defineRoute<ProjectChangeRequestPrepareReasoningParams>({
  routeName: "pcrPrepareReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning/?:step",
  container: (props) => <PCRReasoningWorkflowContainer mode="prepare" {...props}/>,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    step: parseInt(route.params.step, 10)
  }),
  getTitle: () => ({
    htmlTitle: "Provide reasoning to Innovate UK",
    displayTitle: "Provide reasoning to Innovate UK"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});

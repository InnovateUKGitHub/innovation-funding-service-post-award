import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRReviewItemRoute } from "./viewItem";
import { PCRReviewReasoningRoute } from "./viewReasoning";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator, PCRItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PCRStatus } from "@framework/entities";
import { navigateTo } from "../../redux/actions";
import { Result } from "@ui/validation";

export interface PCRReviewParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  onChange: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onSave: (projectId: string, pcrId: string, dto: PCRDto) => void;
}

class PCRReviewComponent extends ContainerBase<PCRReviewParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editor: this.props.editor });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const Form = ACC.TypedForm<PCRDto>();

    const options: ACC.SelectOption[] = [
      { id: PCRStatus.QueriedByMonitoringOfficer.toString(), value: "Query with project manager" },
      { id: PCRStatus.SubmittedToInnovationLead.toString(), value: "Send to Innovate UK for approval" },
    ];

    const selected = options.find(x => x.id === editor.data.status.toString());

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcrDetails">
            <ACC.SummaryListItem label="Number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(pcr)} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>
        <ol className="app-task-list">
          {pcr.items.map((x, i) => this.renderItem(x, i + 1, editor.validator.items.results[i]))}
          {this.renderReasoning(pcr, editor.validator)}
        </ol>
        <Form.Form
          editor={editor}
          onChange={dto => this.props.onChange(pcr.projectId, pcr.id, dto)}
          onSubmit={() => this.props.onSave(pcr.projectId, pcr.id, editor.data)}
        >
          <Form.Fieldset heading="How do you want to proceed?">
            <Form.Radio
              name="status"
              inline={false}
              options={options}
              value={x => selected}
              update={(m, v) => m.status = parseInt(v && v.id || "", 10) || PCRStatus.Unknown}
              validation={editor.validator.status}
            />
            <Form.MultilineString
              name="comments"
              label="Add your comments"
              hint="If ou query the request, you must explain what the partner needs to amend. If you are sending it to Innovate UK, you must say whether you recomment the request for approval and why."
              value={m => m.comments}
              update={(m, v) => m.comments = (v || "")}
              validation={editor.validator.comments}
            />
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-submit">
            <Form.Submit>Submit</Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Page>
    );
  }

  private renderTypes(pcr: PCRDto): React.ReactNode {
    return pcr.items.map(x => x.typeName).reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
  }

  private renderReasoning(pcr: PCRDto, validation: PCRDtoValidator) {
    return this.renderListItem(pcr.items.length + 1, "Give more details", "Reasoning for Innovate UK", pcr.reasoningStatusName, PCRReviewReasoningRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId }), [validation.reasoningStatus, validation.reasoningComments]);
  }

  private renderItem(item: PCRItemDto, step: number, validation: PCRItemDtoValidator) {
    return this.renderListItem(step, item.typeName, "Provide your files", item.statusName, PCRReviewItemRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id }), validation.errors);
  }

  private renderListItem(step: number, title: string, text: string, status: string, route: ILinkInfo, validation: Result[]) {
    return (
      <li key={step}>
        <h2 className="app-task-list__section"><span className="app-task-list__section-number">{step}.</span>&nbsp;{title}</h2>
        {validation.map((v) => <ACC.ValidationError error={v} key={v.key} />)}
        <ul className="app-task-list__items">
          <li className="app-task-list__item">
            <span className="app-task-list__task-name"><ACC.Link route={route}>{text}</ACC.Link></span>
            <span className="app-task-list__task-completed">{status}</span>
          </li>
        </ul>
      </li>
    );
  }
}

const definition = ReduxContainer.for<PCRReviewParams, Data, Callbacks>(PCRReviewComponent);

export const PCRReview = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    // initalise editor pcr status to unknown to force state selection via form
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state, x => x.status = PCRStatus.Unknown)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(navigateTo(PCRsDashboardRoute.getLink({ projectId })))))
  })
});

export const PCRReviewRoute = definition.route({
  routeName: "pcrReview",
  routePath: "/projects/:projectId/pcrs/:pcrId/review",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadPcrTypes(),
  ],
  getTitle: () => ({
    htmlTitle: "Review project change request",
    displayTitle: "Review project change request"
  }),
  container: PCRReview,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});

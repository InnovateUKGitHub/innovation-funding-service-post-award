import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ILinkInfo, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRPrepareItemRoute } from "./prepareItem";
import { PCRPrepareReasoningRoute } from "./prepareReasoning";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PCRStatus } from "@framework/entities";
import { navigateTo } from "../../redux/actions";

interface Params {
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

class PCRPrepareComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editor: this.props.editor});

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor)} />;
  }

  private onSave(dto: PCRDto, submit: boolean) {
    if(submit) {
      dto.status = PCRStatus.SubmittedToMonitoringOfficer;
    }
    this.props.onSave(this.props.projectId, this.props.pcrId, dto);
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const Form = ACC.TypedForm<PCRDto>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section title="Details">
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Number</dt>
              <dd className="govuk-summary-list__value">{pcr.requestNumber}</dd>
              <dd className="govuk-summary-list__actions"/>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Types</dt>
              <dd className="govuk-summary-list__value">{this.renderTypes(pcr)}</dd>
              <dd className="govuk-summary-list__actions">
                <a className="govuk-link" href="#type">Add type</a>
              </dd>
            </div>
          </dl>
        </ACC.Section>
        <ol className="app-task-list">
          {pcr.items.map((x, i) => this.renderItem(x, i+1))}
          {this.renderReasoning(pcr)}
        </ol>
        <Form.Form
          editor={editor}
          onChange={dto => this.props.onChange(pcr.projectId, pcr.id, dto)}
          onSubmit={() => this.onSave(editor.data, true)}
        >
          <Form.Fieldset heading="Add comments for your monitoring officer">
            <Form.MultilineString
              name="comments"
              hint="Leave this field empty if there is nothing to add."
              value={x=> x.comments}
              update={(m,v) => m.comments = v || ""}
              validation={editor.validator.comments}
            />
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-submit">
            <Form.Submit>Submit request to monitoring officer</Form.Submit>
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-return">
            <Form.Button name="return" onClick={() => this.onSave(editor.data, false)}>Save and return to project</Form.Button>
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

  private renderReasoning(pcr: PCRDto) {
    return this.renderListItem(pcr.items.length + 1, "Give more details", "Reasoning for Innovate UK", pcr.reasoningStatusName, PCRPrepareReasoningRoute.getLink({projectId: this.props.projectId, pcrId: this.props.pcrId}));
  }

  private renderItem(item: PCRItemDto, step: number) {
    return this.renderListItem(step, item.typeName, "Provide your files", item.statusName, PCRPrepareItemRoute.getLink({projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id}));
  }

  private renderListItem(step: number, title: string, text: string, status: string, route: ILinkInfo) {
    return (
      <li key={step}>
        <h2 className="app-task-list__section"><span className="app-task-list__section-number">{step}.</span>&nbsp;{title}</h2>
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

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRPrepareComponent);

export const PCRPrepare = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(navigateTo(PCRsDashboardRoute.getLink({projectId})))))
  })
});

export const PCRPrepareRoute = definition.route({
  routeName: "pcrPrepare",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
  ],
  getTitle: () => ({
    htmlTitle: "Prepare project change request",
    displayTitle: "Prepare project change request"
  }),
  container: PCRPrepare,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});

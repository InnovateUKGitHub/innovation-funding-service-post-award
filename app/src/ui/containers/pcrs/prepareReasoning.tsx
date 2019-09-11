import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRPrepareRoute } from "./prepare";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { fakeDocuments } from "./fakePcrs";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PCRItemStatus } from "@framework/entities";
import { navigateTo } from "../../redux/actions";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  files: Pending<DocumentSummaryDto[]>;
}

interface Callbacks {
  onChange: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onSave: (projectId: string, pcrId: string, dto: PCRDto) => void;
}

class PCRViewReasoningComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editor: this.props.editor, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor, x.files)} />;
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

  private renderContents(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, files: DocumentSummaryDto[]) {
    const Form = ACC.TypedForm<PCRDto>();
    const reasoningHint = <ACC.Renderers.SimpleString>You must explain each change. Be brief and write clearly.</ACC.Renderers.SimpleString>;

    const options: ACC.SelectOption[] = [
      { id: "true", value: "This is ready to submit" }
    ];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section>
          <ACC.SummaryList>
            <ACC.SummaryListItem label="Number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(pcr)} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        <ACC.Section>
          <Form.Form
            editor={editor}
            onChange={dto => this.onChange(dto)}
            onSubmit={() => this.onSave(editor.data)}
          >
            <Form.MultilineString
              name="reason"
              label="Reason"
              labelHidden={true}
              hint={reasoningHint}
              qa="reason"
              value={m => m.reasoningComments}
              update={(m, v) => m.reasoningComments = v || ""}
              validation={editor.validator.reasoningComments}
            />
            <Form.Fieldset heading="Mark as complete">
              <Form.Checkboxes
                name="reasoningStatus"
                options={options}
                value={m => m.reasoningStatus === PCRItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.reasoningStatus = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
                validation={editor.validator.reasoningStatus}
              />
              <Form.Submit>Save and return to request</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private onChange(dto: PCRDto): void {
    this.props.onChange(this.props.projectId, this.props.pcrId, dto);
  }

  private onSave(dto: PCRDto): void {
    if (dto.reasoningStatus === PCRItemStatus.ToDo) {
      dto.reasoningStatus = PCRItemStatus.Incomplete;
    }
    this.props.onSave(this.props.projectId, this.props.pcrId, dto);
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRViewReasoningComponent);

export const PCRPrepareReasoning = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state),
    files: Pending.done(fakeDocuments)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(navigateTo(PCRPrepareRoute.getLink({ projectId, pcrId })))))
  })
});

export const PCRPrepareReasoningRoute = definition.route({
  routeName: "pcrPrepareReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId)
  ],
  getTitle: () => ({
    htmlTitle: "Provide reasoning to Innovate UK",
    displayTitle: "Provide reasoning to Innovate UK"
  }),
  container: PCRPrepareReasoning,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});

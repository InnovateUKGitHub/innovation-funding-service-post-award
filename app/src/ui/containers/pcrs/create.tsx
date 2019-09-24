import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore } from "@ui/redux";
import { ProjectChangeRequestItemStatus } from "@framework/entities";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRDto } from "@framework/dtos";
import { ProjectChangeRequestPrepareRoute } from "@ui/containers";
import { ProjectChangeRequestDtoValidatorForCreate } from "@ui/validators/projectChangeRequestDtoValidatorForCreate";

export interface CreateProjectChangeRequestParams {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, ProjectChangeRequestDtoValidatorForCreate>>;
}

interface Callbacks {
  create: (projectId: string, dto: PCRDto) => void;
}

class PCRCreateComponent extends ContainerBase<CreateProjectChangeRequestParams, Data, Callbacks> {

  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.editor, itemTypes: this.props.itemTypes });
    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.pcr, d.itemTypes)} />;
  }

  private renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.PCRDto, ProjectChangeRequestDtoValidatorForCreate>, itemTypes: Dtos.PCRItemTypeDto[]) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section qa="pcr-create">
          {this.renderForm(editor, itemTypes)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private createNewOption(itemType: Dtos.PCRItemTypeDto): Dtos.PCRItemDto {
    return {
      id: "",
      guidance: "",
      type: itemType.type,
      typeName: itemType.displayName,
      status: ProjectChangeRequestItemStatus.ToDo,
      statusName: ""
    };
  }

  private renderForm(pcrEditor: IEditorStore<Dtos.PCRDto, ProjectChangeRequestDtoValidatorForCreate>, itemTypes: Dtos.PCRItemTypeDto[]): React.ReactNode {
    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const options = itemTypes.map<ACC.SelectOption>(x => ({ id: x.type.toString(), value: x.displayName }));
    const selected = options.filter(x => pcrEditor.data.items.some(y => y.type.toString() === x.id));

    return (
      <React.Fragment>
        <PCRForm.Form editor={pcrEditor} onSubmit={() => this.props.create(this.props.projectId, pcrEditor.data)} onChange={x => this.setState({ pcr: x })} qa="pcr-create-form">
          <PCRForm.Fieldset heading="Select request types">
            <PCRForm.Checkboxes
              hint="You can select more than one."
              options={options}
              name="types"
              validation={pcrEditor.validator.items}
              value={x => selected}
              update={(model, selectedValue) => {
                model.items = itemTypes
                  .filter(x => (selectedValue || []).some(y => y.id === x.type.toString()))
                  .map<Dtos.PCRItemDto>(x => model.items.find(y => x.type === y.type) || this.createNewOption(x));
              }}
            />
          </PCRForm.Fieldset>
          <PCRForm.Submit>Create Request</PCRForm.Submit>
        </PCRForm.Form>
        <ACC.Link styling="SecondaryButton" route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Cancel</ACC.Link>
      </React.Fragment>
    );
  }
}

const definition = ReduxContainer.for<CreateProjectChangeRequestParams, Data, Callbacks>(PCRCreateComponent);

export const PCRCreate = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    itemTypes: Selectors.getAllPcrTypes().getPending(state),
    editor: Selectors.getPcrEditorForCreate(params.projectId).get(state)
  }),
  withCallbacks: (dispatch) => ({
    create: (projectId: string, dto: PCRDto) =>
      dispatch(Actions.createProjectChangeRequest(projectId, dto, (created: PCRDto) =>
        dispatch(Actions.navigateTo(ProjectChangeRequestPrepareRoute.getLink({ projectId: dto.projectId, pcrId: created.id })))))
  })
});

export const PCRCreateRoute = definition.route({
  routeName: "pcrCreate",
  routePath: "/projects/:projectId/pcrs/create",
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcrTypes(),
  ],
  getTitle: () => ({
    htmlTitle: "Start a new request",
    displayTitle: "Start a new request"
  }),
  container: PCRCreate,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(Dtos.ProjectRole.ProjectManager)
});

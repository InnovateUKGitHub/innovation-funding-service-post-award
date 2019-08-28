import React from "react";
import { ContainerBaseWithState, ContainerProps, ReduxContainer } from "../containerBase";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { ProjectDto, ProjectRole } from "@framework/dtos";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { fakeItemTypes, PCRDto, PCRItemDto, PCRItemTypeDto } from "./fakePcrs";
import { Results } from "@ui/validation";
import { PCRItemStatus, PCRStatus } from "@framework/entities";
import { PCRsDashboardRoute } from "./dashboard";

interface Params {
  projectId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  itemTypes: Pending<PCRItemTypeDto[]>;
}

interface Callbacks {

}

interface State {
  pcr: PCRDto;
}
class PCRCreateComponent extends ContainerBaseWithState<Params, Data, Callbacks, State> {
  constructor(props: ContainerProps<Params, Data, Callbacks>) {
    super(props);
    this.state = {
      pcr: {
        id: "",
        comments: "",
        lastUpdated: null as any,
        reasoningComments: "",
        reasoningStatus: PCRItemStatus.Unknown,
        reasoningStatusName: "",
        requestNumber: 0,
        started: null as any,
        status: PCRStatus.Unknown,
        statusName: "",
        items: [],
      }
    };
  }

  render() {
    const pcr = Pending.done<IEditorStore<PCRDto, Results<{}>>>({
      data: this.state.pcr,
      status: EditorStatus.Editing,
      validator: new Results(this.state.pcr, false)
    });

    const combined = Pending.combine({ project: this.props.project, pcr, itemTypes: this.props.itemTypes });
    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.pcr, d.itemTypes)} />;
  }

  private renderContents(project: ProjectDto, pcr: IEditorStore<PCRDto, Results<{}>>, itemTypes: PCRItemTypeDto[]) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section>
          <ACC.ValidationMessage message={"You must discuss all project change requests with your monitoring officer before you submit."} messageType="warning"/>
          {this.renderForm(pcr, itemTypes)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private createNewOption(itemType: PCRItemTypeDto): PCRItemDto {
    return {
      id: "",
      type: itemType.id,
      typeName: itemType.name,
      status: PCRItemStatus.Unknown,
      statusName: ""
    };
  }

  private renderForm(pcr: IEditorStore<PCRDto, Results<{}>>, itemTypes: PCRItemTypeDto[]): React.ReactNode {
    const PCRForm = ACC.TypedForm<PCRDto>();
    const options = itemTypes.map<ACC.SelectOption>(x => ({ id: x.id.toString(), value: x.name }));
    const selected = options.filter(x => pcr.data.items.some(y => y.type.toString() === x.id));

    return (
      <PCRForm.Form editor={pcr} onChange={x => this.setState({ pcr: x })}>
        <PCRForm.Fieldset heading="Select request types">
          <PCRForm.Checkboxes
            hint="You can select more that one."
            options={options}
            name="type"
            value={x => selected}
            update={(model, selectedValue) => {
              model.items = itemTypes
                .filter(x => (selectedValue || []).some(y => y.id === x.id.toString()))
                .map<PCRItemDto>(x => model.items.find(y => x.id === y.type) || this.createNewOption(x));
            }}
          />
        </PCRForm.Fieldset>
      </PCRForm.Form>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRCreateComponent);

export const PCRCreate = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    itemTypes: Pending.done(fakeItemTypes),
  }),
  withCallbacks: () => ({})
});

export const PCRCreateRoute = definition.route({
  routeName: "pcrCreate",
  routePath: "/projects/:projectId/pcrs/create",
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId)
  ],
  getTitle: () => ({
    htmlTitle: "Start a new request",
    displayTitle: "Start a new request"
  }),
  container: PCRCreate,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager)
});

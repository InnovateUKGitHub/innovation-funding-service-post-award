import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore } from "@ui/redux";
import { PCRItemStatus } from "@framework/entities/pcr";
import { PCRsDashboardRoute } from "./dashboard";
import { Results } from "@ui/validation";

interface Params {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  pcr: Pending<IEditorStore<Dtos.PCRDto, Results<{}>>>;
}

interface Callbacks {

}

class PCRCreateComponent extends ContainerBase<Params, Data, Callbacks> {

  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, itemTypes: this.props.itemTypes });
    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.pcr, d.itemTypes)} />;
  }

  private renderContents(project: Dtos.ProjectDto, pcr: IEditorStore<Dtos.PCRDto, Results<{}>>, itemTypes: Dtos.PCRItemTypeDto[]) {
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

  private createNewOption(itemType: Dtos.PCRItemTypeDto): Dtos.PCRItemDto {
    return {
      id: "",
      type: itemType.id,
      typeName: itemType.displayName,
      status: PCRItemStatus.Unknown,
      statusName: ""
    };
  }

  private renderForm(pcr: IEditorStore<Dtos.PCRDto, Results<{}>>, itemTypes: Dtos.PCRItemTypeDto[]): React.ReactNode {
    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const options = itemTypes.map<ACC.SelectOption>(x => ({ id: x.id.toString(), value: x.displayName }));
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
                .map<Dtos.PCRItemDto>(x => model.items.find(y => x.id === y.type) || this.createNewOption(x));
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
    itemTypes: Selectors.getAllPcrTypes().getPending(state),
    pcr: Selectors.getPcrEditor(params.projectId).get(state)
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

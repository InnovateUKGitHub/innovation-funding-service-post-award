import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemType } from "@framework/constants";

export interface CreateProjectChangeRequestParams {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: Dtos.PCRDto) => void;
  createNewChangeRequestItem: (itemType: Dtos.PCRItemTypeDto) => (Dtos.PCRItemDto);
}

class PCRCreateComponent extends ContainerBase<CreateProjectChangeRequestParams, Data, Callbacks> {

  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.editor, itemTypes: this.props.itemTypes });
    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.pcr, d.itemTypes)} />;
  }

  private renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>, itemTypes: Dtos.PCRItemTypeDto[]) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>
          <ACC.Content value={x => x.pcrCreate.backLink()}/>
        </ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Content value={x => x.pcrCreate.guidanceMessage()}/>
        <ACC.Section qa="pcr-create">
          {this.renderForm(editor, itemTypes)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderForm(pcrEditor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>, itemTypes: Dtos.PCRItemTypeDto[]): React.ReactNode {
    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const options = itemTypes
      .filter(x => x.enabled)
      .map<ACC.SelectOption>(x => ({ id: x.type.toString(), value: x.displayName }));
    const selected = options.filter(x => pcrEditor.data.items.some(y => y.type.toString() === x.id));
    return (
      <PCRForm.Form editor={pcrEditor} onSubmit={() => this.props.onChange(true, pcrEditor.data)} onChange={dto => this.props.onChange(false, dto)} qa="pcr-create-form">
        <PCRForm.Fieldset headingContent={x => x.pcrCreate.selectRequestTypesTitle()}>
          <PCRForm.Checkboxes
            hintContent={x => x.pcrCreate.selectTypesHint()}
            options={options}
            name="types"
            validation={pcrEditor.validator.items}
            value={x => selected}
            update={(model, selectedValue) => {
              model.items = itemTypes
                .filter(x => (selectedValue || []).some(y => y.id === x.type.toString()))
                .map(x => model.items.find(y => x.type === y.type) || this.props.createNewChangeRequestItem(x));
            }}
          />
        </PCRForm.Fieldset>
        <PCRForm.Fieldset>
          <PCRForm.Submit><ACC.Content value={x => x.pcrCreate.createRequestButton()} /></PCRForm.Submit>
          <ACC.Link styling="SecondaryButton" route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>
            <ACC.Content value={x => x.pcrCreate.cancelRequestButton()}/>
          </ACC.Link>
        </PCRForm.Fieldset>
      </PCRForm.Form>
    );
  }
}

const PCRCreateContainer = (props: CreateProjectChangeRequestParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PCRCreateComponent
          project={stores.projects.getById(props.projectId)}
          itemTypes={stores.projectChangeRequests.getAllPcrTypes()}
          editor={stores.projectChangeRequests.getPcrCreateEditor(props.projectId)}
          onChange={(saving, dto) => stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, (created) => stores.navigation.navigateTo(props.routes.pcrPrepare.getLink({ projectId: dto.projectId, pcrId: created.id })))}
          createNewChangeRequestItem={(itemType: Dtos.PCRItemTypeDto) => stores.projectChangeRequests.createNewChangeRequestItem(itemType)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const PCRCreateRoute = defineRoute({
  routeName: "pcrCreate",
  routePath: "/projects/:projectId/pcrs/create",
  container: PCRCreateContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getTitle: ({content}) => content.pcrCreate.title(),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(Dtos.ProjectRole.ProjectManager)
});

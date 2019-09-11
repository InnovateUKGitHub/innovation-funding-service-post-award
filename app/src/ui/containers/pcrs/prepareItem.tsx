import React, { ReactNode } from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { fakeDocuments } from "./fakePcrs";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { PCRPrepareRoute } from "./prepare";
import { EditorStatus,IEditorStore,  } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PCRItemStatus } from "@framework/entities";
import { navigateTo } from "../../redux/actions";

interface Params {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  files: Pending<DocumentSummaryDto[]>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  onChange: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onSave: (projectId: string, pcrId: string, dto: PCRDto) => void;
}

class PCRPrepareItemComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, pcrItem: this.props.pcrItem, editor: this.props.editor, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.editor, x.files)} />;
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

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, files: DocumentSummaryDto[]) {
    const Form = ACC.TypedForm<PCRItemDto>();

    const options: ACC.SelectOption[] = [
      { id: "true", value: "This is ready to submit" }
    ];

    const index = pcr.items.findIndex(x => x.id === pcrItem.id);

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRPrepareRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to prepare project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        error={editor.error}
        validator={editor.validator}
      >
        <ACC.Section>
          <ACC.SummaryList>
            <ACC.SummaryListItem label="Number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(pcr)} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        <ACC.Section>
          <Form.Form
            data={editor.data.items[index]}
            isSaving={editor.status === EditorStatus.Saving}
            onChange={dto => this.onChange(editor.data, dto)}
            onSubmit={() => this.onSave(editor.data)}
          >
            <Form.Fieldset heading="Mark as complete">
              <Form.Checkboxes
                name="itemStatus"
                options={options}
                value={m => m.status === PCRItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
                validation={editor.validator.items.results[index].status}
              />
              <Form.Submit>Save and return to request</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>

      </ACC.Page>
    );
  }

  private onChange(dto: PCRDto, itemDto: PCRItemDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange(this.props.projectId, this.props.pcrId, dto);
  }

  private onSave(dto: PCRDto): void {
    // if the status is todo and we are saving should change it to incomplete
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    if (dto.items[index].status === PCRItemStatus.ToDo) {
      dto.items[index].status = PCRItemStatus.Incomplete;
    }
    this.props.onSave(this.props.projectId, this.props.pcrId, dto);
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRPrepareItemComponent);

export const PCRPrepareItem = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    pcrItem: Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(state),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state),
    files: Pending.done(fakeDocuments)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(navigateTo(PCRPrepareRoute.getLink({ projectId, pcrId })))))
  })
});

export const PCRPrepareItemRoute = definition.route({
  routeName: "pcrPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId)
  ],
  getTitle: (store, params) => {
    const typeName = Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(store).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
      displayTitle: typeName ? `Prepare ${typeName}` : "Prepare project change request item",
    };
  },
  container: PCRPrepareItem,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});

import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";

import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";

export interface ProjectChangeRequestAddTypeParams {
  projectId: string;
  projectChangeRequestId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  onChange: (saving: boolean, dto: Dtos.PCRDto) => void;
  createNewChangeRequestItem: (itemType: Dtos.PCRItemTypeDto) => Dtos.PCRItemDto;
}

class PCRAddTypeComponent extends ContainerBase<ProjectChangeRequestAddTypeParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      editor: this.props.editor,
      itemTypes: this.props.itemTypes,
    });

    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.editor, d.itemTypes)} />;
  }

  private renderContents(
    project: Dtos.ProjectDto,
    editor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>,
    itemTypes: Dtos.PCRItemTypeDto[],
  ) {
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink
            route={this.props.routes.pcrPrepare.getLink({
              projectId: this.props.projectId,
              pcrId: this.props.projectChangeRequestId,
            })}
          >
            Back to requests
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section qa="pcr-AddType">{this.renderForm(editor, itemTypes)}</ACC.Section>
      </ACC.Page>
    );
  }

  private getListData(editorItems: Dtos.PCRItemDto[], itemTypes: Dtos.PCRItemTypeDto[]) {
    const filteredOptions = itemTypes.reduce<ACC.SelectOption[][]>(
      (allOptions, itemType) => {
        const id = `${itemType.type}`;
        const hasSelectedOption = editorItems.some(x => `${x.type}` === id);

        const option = {
          id,
          value: itemType.displayName,
          disabled: itemType.disabled,
        };

        const newOptions = [...allOptions[0], option];
        const newSelectedOptions = hasSelectedOption ? [...allOptions[1], option] : allOptions[1];

        return [newOptions, newSelectedOptions];
      },
      [[], []],
    );

    const [options, selected] = filteredOptions;

    return {
      options,
      selected,
    };
  }

  private renderForm(
    pcrEditor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>,
    itemTypes: Dtos.PCRItemTypeDto[],
  ): React.ReactNode {
    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const { options, selected } = this.getListData(pcrEditor.data.items, itemTypes);

    return (
      <PCRForm.Form
        qa="pcr-AddTypeForm"
        editor={pcrEditor}
        onSubmit={() => this.props.onChange(true, pcrEditor.data)}
        onChange={dto => this.props.onChange(false, dto)}
      >
        <PCRForm.Fieldset heading="Select request types">
          <PCRForm.Checkboxes
            hint="You can select more than one."
            options={options}
            name="types"
            validation={pcrEditor.validator.items}
            value={() => selected}
            update={(model, selectedValue) => {
              model.items = itemTypes
                .filter(x => (selectedValue || []).some(y => y.id === x.type.toString()))
                .map(x => model.items.find(y => x.type === y.type) || this.props.createNewChangeRequestItem(x));
            }}
          />
        </PCRForm.Fieldset>

        <PCRForm.Fieldset>
          <PCRForm.Submit>Add to request</PCRForm.Submit>

          <ACC.Link
            styling="SecondaryButton"
            route={this.props.routes.pcrPrepare.getLink({
              projectId: this.props.projectId,
              pcrId: this.props.projectChangeRequestId,
            })}
          >
            Cancel
          </ACC.Link>
        </PCRForm.Fieldset>
      </PCRForm.Form>
    );
  }
}

const PCRAddTypeContainer = (props: ProjectChangeRequestAddTypeParams & BaseProps) => {
  const stores = useStores();

  return (
    <PCRAddTypeComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      itemTypes={stores.projectChangeRequests.getAllAvailablePcrTypes(props.projectId)}
      editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.projectChangeRequestId)}
      onChange={(saving, dto) =>
        stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, () =>
          stores.navigation.navigateTo(
            props.routes.pcrPrepare.getLink({ projectId: props.projectId, pcrId: props.projectChangeRequestId }),
          ),
        )
      }
      createNewChangeRequestItem={(itemType: Dtos.PCRItemTypeDto) =>
        stores.projectChangeRequests.createNewChangeRequestItem(itemType)
      }
    />
  );
};

export const ProjectChangeRequestAddTypeRoute = defineRoute({
  routeName: "projectChangeRequestAddType",
  routePath: "/projects/:projectId/pcrs/:projectChangeRequestId/prepare/add",
  container: PCRAddTypeContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    projectChangeRequestId: route.params.projectChangeRequestId,
  }),
  getTitle: () => ({
    htmlTitle: "Add types",
    displayTitle: "Add types",
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.ProjectManager),
});

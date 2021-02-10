import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { ExpandedItem, FormGuidanceExpander } from "../../components/inputs/formGuidanceExpander";

import { useContent } from "@ui/hooks";
export interface CreateProjectChangeRequestParams {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, PCRDtoValidator>>;
}

interface Callbacks {
  content: Record<string, string>;
  onChange: (saving: boolean, dto: Dtos.PCRDto) => void;
  createNewChangeRequestItem: (itemType: Dtos.PCRItemTypeDto) => Dtos.PCRItemDto;
}

export function useCreatePcrContent() {
  const { getContent } = useContent();

  const learnMoreAboutTitle = getContent(x => x.pcrCreate.learnMoreAboutTitle);
  const reallocateCostsTitle = getContent(x => x.pcrCreate.reallocateCostsTitle);
  const reallocateCostsMessage = getContent(x => x.pcrCreate.reallocateCostsMessage);
  const removePartnerTitle = getContent(x => x.pcrCreate.removePartnerTitle);
  const removePartnerMessage = getContent(x => x.pcrCreate.removePartnerMessage);
  const addPartnerTitle = getContent(x => x.pcrCreate.addPartnerTitle);
  const addPartnerMessage = getContent(x => x.pcrCreate.addPartnerMessage);
  const changeScopeTitle = getContent(x => x.pcrCreate.changeScopeTitle);
  const changeScopeMessage = getContent(x => x.pcrCreate.changeScopeMessage);
  const changeDurationTitle = getContent(x => x.pcrCreate.changeDurationTitle);
  const changeDurationMessage = getContent(x => x.pcrCreate.changeDurationMessage);
  const changePartnersNameTitle = getContent(x => x.pcrCreate.changePartnersNameTitle);
  const changePartnersNameMessage = getContent(x => x.pcrCreate.changePartnersNameMessage);
  const putProjectOnHoldTitle = getContent(x => x.pcrCreate.putProjectOnHoldTitle);
  const putProjectOnHoldMessage = getContent(x => x.pcrCreate.putProjectOnHoldMessage);
  const endProjectEarlyTitle = getContent(x => x.pcrCreate.endProjectEarlyTitle);
  const endProjectEarlyMessage = getContent(x => x.pcrCreate.endProjectEarlyMessage);
  const selectTypesHint = getContent(x => x.pcrCreate.selectTypesHint);
  const backLink = getContent(x => x.pcrCreate.backLink);
  const selectRequestTypesTitle = getContent(x => x.pcrCreate.selectRequestTypesTitle);
  const createRequestButton = getContent(x => x.pcrCreate.createRequestButton);
  const cancelRequestButton = getContent(x => x.pcrCreate.cancelRequestButton);
  const guidanceIntroMessage = getContent(x => x.pcrCreate.guidanceIntroMessage);
  const guidanceListRow1 = getContent(x => x.pcrCreate.guidanceListRow1);
  const guidanceListRow2 = getContent(x => x.pcrCreate.guidanceListRow2);

  return {
    learnMoreAboutTitle,
    reallocateCostsTitle,
    reallocateCostsMessage,
    removePartnerTitle,
    removePartnerMessage,
    addPartnerTitle,
    addPartnerMessage,
    changeScopeTitle,
    changeScopeMessage,
    changeDurationTitle,
    changeDurationMessage,
    changePartnersNameTitle,
    changePartnersNameMessage,
    putProjectOnHoldTitle,
    putProjectOnHoldMessage,
    endProjectEarlyTitle,
    endProjectEarlyMessage,
    selectTypesHint,
    backLink,
    selectRequestTypesTitle,
    createRequestButton,
    cancelRequestButton,
    guidanceIntroMessage,
    guidanceListRow1,
    guidanceListRow2
  };
}

class PCRCreateComponent extends ContainerBase<CreateProjectChangeRequestParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.editor,
      itemTypes: this.props.itemTypes,
    });
    return <ACC.PageLoader pending={combined} render={d => this.renderContents(d.project, d.pcr, d.itemTypes)} />;
  }

  private renderContents(
    project: Dtos.ProjectDto,
    editor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>,
    itemTypes: Dtos.PCRItemTypeDto[],
  ) {
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>
            {this.props.content.backLink}
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Renderers.SimpleString>{this.props.content.guidanceIntroMessage}</ACC.Renderers.SimpleString>

        <ACC.UnorderedList>
          <li>{this.props.content.guidanceListRow1}</li>
          <li>{this.props.content.guidanceListRow2}</li>
        </ACC.UnorderedList>

        <ACC.Section qa="pcr-create">{this.renderForm(editor, itemTypes)}</ACC.Section>
      </ACC.Page>
    );
  }

  private readonly createGuidanceContent: ExpandedItem[] = [
    { header: this.props.content.reallocateCostsTitle, description: this.props.content.reallocateCostsMessage },
    { header: this.props.content.removePartnerTitle, description: this.props.content.removePartnerMessage },
    { header: this.props.content.addPartnerTitle, description: this.props.content.addPartnerMessage },
    { header: this.props.content.changeScopeTitle, description: this.props.content.changeScopeMessage },
    { header: this.props.content.changeDurationTitle, description: this.props.content.changeDurationMessage },
    { header: this.props.content.changePartnersNameTitle, description: this.props.content.changePartnersNameMessage },
    { header: this.props.content.putProjectOnHoldTitle, description: this.props.content.putProjectOnHoldMessage },
    { header: this.props.content.endProjectEarlyTitle, description: this.props.content.endProjectEarlyMessage },
  ];

  private renderForm(
    pcrEditor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>,
    itemTypes: Dtos.PCRItemTypeDto[],
  ): React.ReactNode {
    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const options = itemTypes
      .filter(x => x.enabled)
      .map<ACC.SelectOption>(x => ({ id: x.type.toString(), value: x.displayName }));
    const selected = options.filter(x => pcrEditor.data.items.some(y => y.type.toString() === x.id));

    return (
      <PCRForm.Form
        editor={pcrEditor}
        onSubmit={() => this.props.onChange(true, pcrEditor.data)}
        onChange={dto => this.props.onChange(false, dto)}
        qa="pcr-create-form"
      >
        <PCRForm.Fieldset heading={this.props.content.selectRequestTypesTitle}>
          <ACC.Renderers.SimpleString className="govuk-hint">
            {this.props.content.selectTypesHint}
          </ACC.Renderers.SimpleString>

          <FormGuidanceExpander title={this.props.content.learnMoreAboutTitle} items={this.createGuidanceContent} qa="pcr-create-guidance"/>

          <PCRForm.Checkboxes
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
          <PCRForm.Submit>{this.props.content.createRequestButton}</PCRForm.Submit>
          <ACC.Link
            styling="SecondaryButton"
            route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}
          >
            {this.props.content.cancelRequestButton}
          </ACC.Link>
        </PCRForm.Fieldset>
      </PCRForm.Form>
    );
  }
}

const PCRCreateContainer = (props: CreateProjectChangeRequestParams & BaseProps) => {
  const { projects, projectChangeRequests, navigation } = useStores();
  const pcrContent = useCreatePcrContent();

  return (
    <PCRCreateComponent
      {...props}
      content={pcrContent}
      project={projects.getById(props.projectId)}
      itemTypes={projectChangeRequests.getAllPcrTypes()}
      editor={projectChangeRequests.getPcrCreateEditor(props.projectId)}
      onChange={(saving, dto) =>
        projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, created =>
          navigation.navigateTo(props.routes.pcrPrepare.getLink({ projectId: dto.projectId, pcrId: created.id })),
        )
      }
      createNewChangeRequestItem={(itemType: Dtos.PCRItemTypeDto) =>
        projectChangeRequests.createNewChangeRequestItem(itemType)
      }
    />
  );
};

export const PCRCreateRoute = defineRoute({
  routeName: "pcrCreate",
  routePath: "/projects/:projectId/pcrs/create",
  container: PCRCreateContainer,
  getParams: route => ({
    projectId: route.params.projectId,
  }),
  getTitle: ({ content }) => content.pcrCreate.title(),
  accessControl: (auth, { projectId }, config) =>
    auth.forProject(projectId).hasAnyRoles(Dtos.ProjectRole.ProjectManager),
});

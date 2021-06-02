import * as Dtos from "@framework/dtos";
import * as ACC from "@ui/components";

import { Pending } from "@shared/pending";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";

export interface CreatePcrParams {
  projectId: string;
}

interface CreatePcrProps extends CreatePcrParams, BaseProps {
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, PCRDtoValidator>>;
  content: Record<string, string>;
  onChange: (saving: boolean, dto: Dtos.PCRDto) => void;
  createNewChangeRequestItem: (itemType: Dtos.PCRItemTypeDto) => Dtos.PCRItemDto;
}

function PCRCreateComponent({ content, ...props }: CreatePcrProps) {
  const getListData = (editorItems: Dtos.PCRItemDto[], itemTypes: Dtos.PCRItemTypeDto[]) => {
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
  };

  const calculateUpdatedOptions = (
    options: Dtos.PCRItemTypeDto[],
    model: Dtos.PCRDto,
    selectedValues: ACC.SelectOption[],
  ): Dtos.PCRItemDto[] => {
    const filteredItems = options.filter(x => selectedValues.some(y => y.id === `${x.type}`));
    return filteredItems.map(x => model.items.find(y => x.type === y.type) || props.createNewChangeRequestItem(x));
  };

  const renderPage = (
    project: Dtos.ProjectDto,
    itemTypes: Dtos.PCRItemTypeDto[],
    editor: IEditorStore<Dtos.PCRDto, PCRDtoValidator>,
  ) => {
    const pcrDashboardLink = props.routes.pcrsDashboard.getLink({ projectId: props.projectId });
    const pcrDashboardBackLink = <ACC.BackLink route={pcrDashboardLink}>{content.backLink}</ACC.BackLink>;

    const PCRForm = ACC.TypedForm<Dtos.PCRDto>();
    const { options, selected } = getListData(editor.data.items, itemTypes);

    const createGuidanceContent = [
      { header: content.reallocateCostsTitle, description: content.reallocateCostsMessage },
      { header: content.removePartnerTitle, description: content.removePartnerMessage },
      { header: content.addPartnerTitle, description: content.addPartnerMessage },
      { header: content.changeScopeTitle, description: content.changeScopeMessage },
      { header: content.changeDurationTitle, description: content.changeDurationMessage },
      { header: content.changePartnersNameTitle, description: content.changePartnersNameMessage },
      { header: content.putProjectOnHoldTitle, description: content.putProjectOnHoldMessage },
      { header: content.endProjectEarlyTitle, description: content.endProjectEarlyMessage },
    ];

    return (
      <ACC.Page
        backLink={pcrDashboardBackLink}
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Renderers.SimpleString>{content.guidanceIntroMessage}</ACC.Renderers.SimpleString>

        <ACC.UL>
          <li>{content.guidanceListRow1}</li>
          <li>{content.guidanceListRow2}</li>
        </ACC.UL>

        <ACC.Section qa="pcr-create">
          <PCRForm.Form
            qa="pcr-create-form"
            editor={editor}
            onSubmit={() => props.onChange(true, editor.data)}
            onChange={dto => props.onChange(false, dto)}
          >
            <PCRForm.Fieldset heading={content.selectRequestTypesTitle}>
              <ACC.Renderers.SimpleString className="govuk-hint">{content.selectTypesHint}</ACC.Renderers.SimpleString>

              <ACC.Inputs.FormGuidanceExpander
                title={content.learnMoreAboutTitle}
                items={createGuidanceContent}
                qa="pcr-create-guidance"
              />

              <PCRForm.Checkboxes
                name="types"
                options={options}
                validation={editor.validator.items}
                value={() => selected}
                update={(model, selectedValue) => {
                  const updatedItems = calculateUpdatedOptions(itemTypes, model, selectedValue || []);

                  model.items = updatedItems;
                }}
              />
            </PCRForm.Fieldset>

            <PCRForm.Fieldset>
              <PCRForm.Submit>{content.createRequestButton}</PCRForm.Submit>

              <ACC.Link styling="SecondaryButton" route={pcrDashboardLink}>
                {content.cancelRequestButton}
              </ACC.Link>
            </PCRForm.Fieldset>
          </PCRForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  };

  const combined = Pending.combine({
    project: props.project,
    editor: props.editor,
    itemTypes: props.itemTypes,
  });

  return <ACC.PageLoader pending={combined} render={x => renderPage(x.project, x.itemTypes, x.editor)} />;
}

export function useCreatePcrContent() {
  const { getContent } = useContent();

  return {
    learnMoreAboutTitle: getContent(x => x.pcrCreate.learnMoreAboutTitle),
    reallocateCostsTitle: getContent(x => x.pcrCreate.reallocateCostsTitle),
    reallocateCostsMessage: getContent(x => x.pcrCreate.reallocateCostsMessage),
    removePartnerTitle: getContent(x => x.pcrCreate.removePartnerTitle),
    removePartnerMessage: getContent(x => x.pcrCreate.removePartnerMessage),
    addPartnerTitle: getContent(x => x.pcrCreate.addPartnerTitle),
    addPartnerMessage: getContent(x => x.pcrCreate.addPartnerMessage),
    changeScopeTitle: getContent(x => x.pcrCreate.changeScopeTitle),
    changeScopeMessage: getContent(x => x.pcrCreate.changeScopeMessage),
    changeDurationTitle: getContent(x => x.pcrCreate.changeDurationTitle),
    changeDurationMessage: getContent(x => x.pcrCreate.changeDurationMessage),
    changePartnersNameTitle: getContent(x => x.pcrCreate.changePartnersNameTitle),
    changePartnersNameMessage: getContent(x => x.pcrCreate.changePartnersNameMessage),
    putProjectOnHoldTitle: getContent(x => x.pcrCreate.putProjectOnHoldTitle),
    putProjectOnHoldMessage: getContent(x => x.pcrCreate.putProjectOnHoldMessage),
    endProjectEarlyTitle: getContent(x => x.pcrCreate.endProjectEarlyTitle),
    endProjectEarlyMessage: getContent(x => x.pcrCreate.endProjectEarlyMessage),
    selectTypesHint: getContent(x => x.pcrCreate.selectTypesHint),
    backLink: getContent(x => x.pcrCreate.backLink),
    selectRequestTypesTitle: getContent(x => x.pcrCreate.selectRequestTypesTitle),
    createRequestButton: getContent(x => x.pcrCreate.createRequestButton),
    cancelRequestButton: getContent(x => x.pcrCreate.cancelRequestButton),
    guidanceIntroMessage: getContent(x => x.pcrCreate.guidanceIntroMessage),
    guidanceListRow1: getContent(x => x.pcrCreate.guidanceListRow1),
    guidanceListRow2: getContent(x => x.pcrCreate.guidanceListRow2),
  };
}

function PCRCreateContainer(props: CreatePcrParams & BaseProps) {
  const { projects, projectChangeRequests, navigation } = useStores();
  const pcrContent = useCreatePcrContent();

  return (
    <PCRCreateComponent
      {...props}
      content={pcrContent}
      project={projects.getById(props.projectId)}
      itemTypes={projectChangeRequests.getAllAvailablePcrTypes(props.projectId)}
      editor={projectChangeRequests.getPcrCreateEditor(props.projectId)}
      createNewChangeRequestItem={itemType => projectChangeRequests.createNewChangeRequestItem(itemType)}
      onChange={(saving, dto) =>
        projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, created =>
          navigation.navigateTo(
            props.routes.pcrPrepare.getLink({
              projectId: dto.projectId,
              pcrId: created.id,
            }),
          ),
        )
      }
    />
  );
}

export const PCRCreateRoute = defineRoute({
  routeName: "pcrCreate",
  routePath: "/projects/:projectId/pcrs/create",
  container: PCRCreateContainer,
  getParams: route => ({ projectId: route.params.projectId }),
  getTitle: ({ content }) => content.pcrCreate.title(),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(Dtos.ProjectRole.ProjectManager),
});

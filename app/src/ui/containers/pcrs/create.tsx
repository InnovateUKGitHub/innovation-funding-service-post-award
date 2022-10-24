import { useNavigate } from "react-router-dom";
import * as Dtos from "@framework/dtos";
import * as ACC from "@ui/components";

import { Pending } from "@shared/pending";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { ProjectRole } from "@framework/constants";
import { useProjectParticipants } from "@ui/features/project-participants";

import { PcrTypesGuidance } from "./components/PcrTypesGuidance";

export interface CreatePcrParams {
  projectId: string;
}

interface CreatePcrProps extends CreatePcrParams, BaseProps {
  projectId: string;
  project: Pending<Dtos.ProjectDto>;
  itemTypes: Pending<Dtos.PCRItemTypeDto[]>;
  editor: Pending<IEditorStore<Dtos.PCRDto, PCRDtoValidator>>;
  content: Record<string, string>;
  onChange: (saving: boolean, dto: Dtos.PCRDto) => void;
  createNewChangeRequestItem: (itemType: Dtos.PCRItemTypeDto) => Dtos.PCRItemDto;
}

function PCRCreateComponent({ content, ...props }: CreatePcrProps) {
  const { isMultipleParticipants } = useProjectParticipants();

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
          {isMultipleParticipants && <li>{content.guidanceListRow1}</li>}
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
              <PcrTypesGuidance qa="create" types={itemTypes} />

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
    selectTypesHint: getContent(x => x.pages.pcrCreate.selectTypesHint),
    backLink: getContent(x => x.pages.pcrCreate.backLink),
    selectRequestTypesTitle: getContent(x => x.pages.pcrCreate.selectRequestTypesTitle),
    createRequestButton: getContent(x => x.pages.pcrCreate.buttonCreateRequest),
    cancelRequestButton: getContent(x => x.pages.pcrCreate.buttonCancelRequest),
    guidanceIntroMessage: getContent(x => x.pages.pcrCreate.guidanceIntroMessage),
    guidanceListRow1: getContent(x => x.pages.pcrCreate.guidanceList.row1),
    guidanceListRow2: getContent(x => x.pages.pcrCreate.guidanceList.row2),
  };
}

function PCRCreateContainer(props: CreatePcrParams & BaseProps) {
  const { projects, projectChangeRequests } = useStores();
  const pcrContent = useCreatePcrContent();
  const navigate = useNavigate();

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
          navigate(
            props.routes.pcrPrepare.getLink({
              projectId: dto.projectId,
              pcrId: created.id,
            }).path,
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
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.pcrCreate.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager),
});

import { PCRDto, PCRItemDto, PCRItemTypeDto, ProjectDto } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { BackLink, Content, createTypedForm, Link, Page, PageLoader, Projects, Section } from "@ui/components";
import { CheckboxOptionProps } from "@ui/components/inputs";
import { useContent } from "@ui/hooks";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { useNavigate } from "react-router-dom";
import { BaseProps } from "../../containerBase";
import { PcrDisabledReasoning } from "../components/PcrDisabledReasoning/PcrDisabledReasoning";
import { usePcrItemName } from "../utils/getPcrItemName";

/**
 * Difference between "Create", "Modify" and "Update"
 *
 * Modify - A union of "Create" and "Update"
 * Create - When a PCR doesn't exist, and will exist when the user submits
 * Update - When a PCR exists, and will be updated when the user submits
 */

interface PcrCreateParams {
  projectId: ProjectId;
}

export interface PcrModifyParams extends PcrCreateParams {
  projectChangeRequestId?: string;
}

export interface PcrUpdateParams extends PcrCreateParams {
  projectChangeRequestId: string;
}

interface PcrBaseParams {
  projectId: ProjectId;
  project: ProjectDto;
  itemTypes: PCRItemTypeDto[];
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  onChange: (saving: boolean, dto: PCRDto) => void;
  createNewChangeRequestItem: (itemType: PCRItemTypeDto) => PCRItemDto;
}

interface PcrModifySelectedProps extends PcrModifyParams, PcrBaseParams {}

const PCRForm = createTypedForm<PCRDto>();

const PcrModifySelectedPage = ({
  projectId,
  routes,
  project,
  editor,
  itemTypes,
  onChange,
  createNewChangeRequestItem,
  projectChangeRequestId,
}: PcrModifySelectedProps & BaseProps) => {
  const { getContent } = useContent();
  const { getPcrItemContent } = usePcrItemName();
  const cancelLink = projectChangeRequestId
    ? routes.pcrPrepare.getLink({ projectId, pcrId: projectChangeRequestId })
    : routes.pcrsDashboard.getLink({ projectId });

  const availableOptions: CheckboxOptionProps[] = [];
  const selectedOptions: CheckboxOptionProps[] = [];
  const dtoUnavailable: PCRItemTypeDto[] = [];

  for (const itemType of itemTypes) {
    const { name, description } = getPcrItemContent(itemType.displayName);

    const dtoOption: CheckboxOptionProps = {
      id: String(itemType.type),
      value: (
        <>
          <span>{name}</span>
          <br />
          <span className="govuk-hint">{description}</span>
        </>
      ),
      qa: `pcr-modify-option-${itemType.type}`,
    };

    if (!itemType.disabled) {
      availableOptions.push(dtoOption);
    } else {
      dtoUnavailable.push(itemType);
    }

    if (
      editor.data.items
        .filter(editorItemType => editorItemType?.id?.length === 0)
        .some(editorItemType => itemType.type === editorItemType.type)
    ) {
      selectedOptions.push(dtoOption);
    }
  }

  return (
    <Page
      backLink={
        <BackLink route={cancelLink}>
          {projectChangeRequestId
            ? getContent(x => x.pages.pcrModifyOptions.backToPcr)
            : getContent(x => x.pages.pcrModifyOptions.backToPcrs)}
        </BackLink>
      }
      pageTitle={<Projects.Title {...project} />}
      project={project}
      validator={editor.validator}
      error={editor.error}
    >
      <Content markdown value={x => x.pages.pcrModifyOptions.guidance} />

      <Section qa="pcr-modify-options-section">
        <PCRForm.Form
          qa="pcr-modify-options-form"
          editor={editor}
          onSubmit={() => onChange(true, editor.data)}
          onChange={dto => onChange(false, dto)}
        >
          <PCRForm.Fieldset heading={x => x.pages.pcrModifyOptions.selectRequestTypesTitle}>
            <PCRForm.Checkboxes
              options={availableOptions}
              name="types"
              validation={editor.validator.items}
              value={() => selectedOptions}
              update={(model, selectedValues) => {
                const selectedOptions = itemTypes.filter(x => selectedValues?.some(y => y.id === `${x.type}`));
                const updatedItems = [
                  ...model.items.filter(x => x.id.length !== 0),
                  ...selectedOptions.map(
                    x =>
                      model.items.filter(x => x.id.length === 0).find(y => x.type === y.type) ||
                      createNewChangeRequestItem(x),
                  ),
                ];

                model.items = updatedItems;
              }}
            />

            <PcrDisabledReasoning items={dtoUnavailable} />
          </PCRForm.Fieldset>

          <PCRForm.Fieldset>
            <PCRForm.Submit>
              {projectChangeRequestId
                ? getContent(x => x.pages.pcrModifyOptions.buttonUpdateRequest)
                : getContent(x => x.pages.pcrModifyOptions.buttonCreateRequest)}
            </PCRForm.Submit>

            <Link styling="SecondaryButton" route={cancelLink}>
              {getContent(x => x.pages.pcrModifyOptions.buttonCancelRequest)}
            </Link>
          </PCRForm.Fieldset>
        </PCRForm.Form>
      </Section>
    </Page>
  );
};

const PcrModifySelectedContainer = (props: PcrModifyParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  const pending = Pending.combine({
    project: stores.projects.getById(props.projectId),
    itemTypes: stores.projectChangeRequests.getAllAvailablePcrTypes(props.projectId, props.projectChangeRequestId),
    editor: props.projectChangeRequestId
      ? stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.projectChangeRequestId)
      : stores.projectChangeRequests.getPcrCreateEditor(props.projectId),
  });

  return (
    <PageLoader
      pending={pending}
      render={({ editor, itemTypes, project }) => (
        <PcrModifySelectedPage
          {...props}
          project={project}
          itemTypes={itemTypes}
          editor={editor}
          createNewChangeRequestItem={itemType => stores.projectChangeRequests.createNewChangeRequestItem(itemType)}
          onChange={(saving, dto) =>
            stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, created =>
              navigate(
                props.routes.pcrPrepare.getLink({
                  projectId: dto.projectId,
                  pcrId: props.projectChangeRequestId ?? created.id,
                }).path,
              ),
            )
          }
        />
      )}
    />
  );
};

export const PcrUpdateSelectedContainer = (props: PcrUpdateParams & BaseProps) => PcrModifySelectedContainer(props);
export const PcrCreateSelectedContainer = (props: PcrCreateParams & BaseProps) => PcrModifySelectedContainer(props);
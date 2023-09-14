import { PCRItemStatus, PCRItemType, PCRStepId } from "@framework/constants/pcrConstants";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { FinancialVirementDto } from "@framework/dtos/financialVirementDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { ForbiddenError } from "@shared/appError";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { EditorStatus } from "@ui/redux/constants/enums";
import { BaseProps } from "@ui/containers/containerBase";
import { GrantMovingOverFinancialYearForm } from "@ui/containers/pages/pcrs/financialVirements/financialVirementsSummary";
import { NavigationArrowsForPCRs } from "@ui/containers/pages/pcrs/navigationArrows";
import { PcrStepProps, PcrWorkflow, WorkflowPcrType } from "@ui/containers/pages/pcrs/pcrWorkflow";
import WithScrollToTopOnPropChange from "@ui/features/scroll-to-top-on-prop-change";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { Results } from "@ui/validation/results";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { PCRWorkflowValidator } from "@ui/validation/validators/pcrWorkflowValidator";
import { PcrSummaryConsumer, PcrSummaryProvider } from "./components/PcrSummary/PcrSummary";
import { createContext, isValidElement, useContext } from "react";
import { Result } from "@ui/validation/result";
import { ProjectChangeRequestPrepareItemParams } from "./pcrItemWorkflowContainer";

interface Data {
  virement: FinancialVirementDto;
  project: ProjectDto;
  partners: PartnerDto[];
  pcr: PCRDto;
  pcrItem: PCRItemDto;
  pcrItemType: PCRItemTypeDto;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  editableItemTypes: PCRItemType[];
  mode: "prepare" | "review" | "view";
}

interface Callbacks {
  onChange: (props: { dto: PCRDto; pcrStepId?: PCRStepId }) => void;
  onSave: (props: { dto: PCRDto; pcrStepId?: PCRStepId; link: ILinkInfo }) => void;
}

type PcrItemProps = Data & Callbacks & ProjectChangeRequestPrepareItemParams & BaseProps;

const PcrItemContext = createContext<PcrItemProps & { workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>> }>(
  null as unknown as PcrItemProps & { workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>> },
);

const PCRForm = createTypedForm<PCRItemDto>();

export const PCRItemWorkflow = (props: BaseProps & Callbacks & Data & ProjectChangeRequestPrepareItemParams) => {
  const { project, partners, virement, editor, documentsEditor, pcrItem, step } = props;

  const workflow = PcrWorkflow.getWorkflow(pcrItem as WorkflowPcrType, step) as unknown as PcrWorkflow<
    PCRItemDto,
    Results<PCRItemDto>
  >;

  if (!workflow) {
    throw new Error("missing a workflow in pcrItemWorkflow");
  }
  const validation = workflow
    ? workflow.getValidation(new PCRWorkflowValidator(editor.validator, documentsEditor.validator))
    : [editor.validator, documentsEditor.validator];

  return (
    <PcrItemContext.Provider value={{ ...props, workflow }}>
      <PcrSummaryProvider type={pcrItem.type} partners={partners} virement={virement}>
        <Page
          backLink={<PcrBackLink />}
          pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
          projectStatus={project.status}
          validator={validation}
          error={editor.error || documentsEditor.error}
        >
          <Messages messages={props.messages} />

          <Workflow />
        </Page>
      </PcrSummaryProvider>
    </PcrItemContext.Provider>
  );
};

const Workflow = () => {
  const { mode, step, pcrItem, workflow } = useContext(PcrItemContext);
  const isPrepareMode = mode === "prepare";
  const isFirstStep = step === 1;

  const displayGuidance = isPrepareMode && isFirstStep;
  return (
    <>
      {displayGuidance && renderGuidanceSection(pcrItem)}

      {workflow?.isOnSummary() ? <SummarySection /> : <WorkflowStep />}
    </>
  );
};

const SummarySection = () => {
  const { mode, workflow, routes, editableItemTypes, pcrItem, pcr } = useContext(PcrItemContext);
  const isPrepareMode = mode === "prepare";
  const isReviewing = mode === "review";
  const displayNavigationArrows = mode === "review" || mode === "view";

  return (
    <WithScrollToTopOnPropChange propToScrollOn={workflow?.getCurrentStepName()}>
      <PcrSummaryConsumer>
        {summaryContext => {
          const displayCompleteForm = isPrepareMode && summaryContext.isSummaryValid;

          return (
            <Section qa="item-save-and-return">
              <Summary />
              {displayCompleteForm && <WorkflowItemForm allowSubmit={summaryContext.allowSubmit} />}

              {displayNavigationArrows && (
                <NavigationArrowsForPCRs
                  pcr={pcr}
                  currentItem={pcrItem}
                  isReviewing={isReviewing}
                  editableItemTypes={editableItemTypes}
                  routes={routes}
                />
              )}
            </Section>
          );
        }}
      </PcrSummaryConsumer>
    </WithScrollToTopOnPropChange>
  );
};

const Summary = () => {
  const {
    editor,
    itemId,
    workflow,
    projectId,
    pcrId,
    project,
    pcr,
    onSave,
    mode,
    config,
    messages,
    routes,
    currentRoute,
  } = useContext(PcrItemContext);
  const pcrItem = editor.data.items.find(x => x.id === itemId);
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);
  const validator = editor.validator.items.results.find(x => x.model.id === pcrItem.id);
  if (!validator) throw new Error(`Cannot find validator matching itemId ${itemId}`);

  const workflowSummary = workflow?.getSummary();

  // TODO: This should throw and Error and stop the UI from crashing
  if (!workflowSummary) return null;
  if (!workflowSummary.summaryRender) {
    throw new Error(`pcr item workflow ${workflow.getCurrentStepName()} is missing a summaryRender method`);
  }

  return workflowSummary.summaryRender({
    projectId,
    validator,
    pcrItem,
    project,
    pcr,
    onSave: () => handleSave(workflow, editor.data, itemId, projectId, pcrId, onSave, routes, false),
    getStepLink: stepName => getStepLink(workflow, stepName, routes, projectId, pcrId, itemId),
    getEditLink: (stepName, validation) => <EditLink stepName={stepName} validation={validation} />,
    getViewLink: stepName => <ViewLink stepName={stepName} />,
    mode,
    config,
    messages,
    routes,
    currentRoute,
  });
};

const renderGuidanceSection = (pcrItem: PCRItemDto) => {
  if (!pcrItem.guidance) return null;

  return (
    <Section qa="guidance">
      <Markdown trusted value={pcrItem.guidance} />
    </Section>
  );
};

const PcrBackLink = () => {
  const { mode, routes, projectId, pcrId } = useContext(PcrItemContext);
  if (mode === "review") {
    return <BackLink route={routes.pcrReview.getLink({ projectId, pcrId })}>Back to request</BackLink>;
  }
  if (mode === "prepare") {
    return <BackLink route={routes.pcrPrepare.getLink({ projectId, pcrId })}>Back to request</BackLink>;
  }
  return <BackLink route={routes.pcrDetails.getLink({ projectId, pcrId })}>Back to request</BackLink>;
};

const ViewLink = ({ stepName }: { stepName: PCRStepId }) => {
  const { mode, workflow, routes, projectId, pcrId, itemId } = useContext(PcrItemContext);
  if (mode !== "review") return null;

  return (
    <Link replace route={getStepReviewLink(workflow, stepName, routes, projectId, pcrId, itemId)}>
      View
    </Link>
  );
};

const EditLink = ({ stepName, validation }: { stepName: PCRStepId; validation: Result | null }) => {
  const { mode, workflow, routes, projectId, pcrId, itemId } = useContext(PcrItemContext);

  if (mode !== "prepare") return null;

  return (
    <Link
      id={validation ? validation.key : undefined}
      replace
      route={getStepLink(workflow, stepName, routes, projectId, pcrId, itemId)}
    >
      Edit
    </Link>
  );
};

const getStepLink = (
  workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
  stepName: string,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  pcrId: PcrId,
  itemId: PcrItemId,
) => {
  return routes.pcrPrepareItem.getLink({
    projectId,
    pcrId,
    itemId,
    step: workflow && workflow.findStepNumberByName(stepName),
  });
};

const getStepReviewLink = (
  workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
  stepName: string,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  pcrId: PcrId,
  itemId: PcrItemId,
) => {
  return routes.pcrReviewItem.getLink({
    projectId,
    pcrId,
    itemId,
    step: workflow && workflow.findStepNumberByName(stepName),
  });
};

const WorkflowStep = () => {
  const {
    editor,
    mode,
    itemId,
    projectId,
    pcrId,
    pcrItem,
    workflow,
    pcr,
    pcrItemType,
    documentsEditor,
    project,
    routes,
    onChange,
    onSave,
  } = useContext(PcrItemContext);
  const validator = editor.validator.items.results.find(x => x.model.id === pcrItem.id);
  if (!validator) throw new Error(`Cannot find validator matching itemId ${itemId}`);
  const status = editor.status || EditorStatus.Editing;

  const currentStep = workflow.getCurrentStepInfo();

  if (!currentStep) throw Error("PCR step does not exist on this workflow.");

  const props: PcrStepProps<PCRItemDto, typeof validator> = {
    pcr,
    pcrItem,
    pcrItemType,
    documentsEditor,
    project,
    validator,
    status,
    routes,
    mode,
    onChange: itemDto => handleChange(workflow, editor.data, itemDto, itemId, onChange),
    onSave: skipToSummary => handleSave(workflow, editor.data, itemId, projectId, pcrId, onSave, routes, skipToSummary),
    getRequiredToCompleteMessage: function RequiredToCompleteMessage(message) {
      const standardMessage = "This is required to complete this request.";

      if (!message) return standardMessage;

      return (
        <span>
          {message}
          <br />
          {standardMessage}
        </span>
      );
    },
  };

  if (mode === "review") {
    // When reviewing a pcr, the MO should only be able to visit pages which support read only.
    if (!currentStep.readonlyStepRender) throw new ForbiddenError();
    const ReadonlyCurrentStep = currentStep.readonlyStepRender;
    return <ReadonlyCurrentStep {...props} />;
  }

  if (!currentStep.stepRender) {
    throw new Error("component is still using the original stepRender which is not found in the workflow config");
  }

  const CurrentStep = currentStep.stepRender;

  if (!isValidElement(CurrentStep)) {
    throw new Error("CurrentStep is not a valid react element");
  }

  return (
    <WithScrollToTopOnPropChange propToScrollOn={workflow.getCurrentStepName()}>
      <CurrentStep {...props} />
    </WithScrollToTopOnPropChange>
  );
};

const WorkflowItemForm = ({ allowSubmit }: { allowSubmit: boolean }) => {
  const { editor, itemId, workflow, onChange, onSave, projectId, pcrId, routes } = useContext(PcrItemContext);
  const pcrItem = editor.data.items.find(x => x.id === itemId);
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);
  const canReallocatePcr = pcrItem.type === PCRItemType.MultiplePartnerFinancialVirement;

  const options: SelectOption[] = [{ id: "true", value: "I agree with this change." }];

  return (
    <PCRForm.Form
      qa="pcr_complete_item_form"
      data={pcrItem}
      onChange={dto => handleChange(workflow, editor.data, dto, itemId, onChange)}
      onSubmit={() => handleSave(workflow, editor.data, itemId, projectId, pcrId, onSave, routes, false)}
      isSaving={editor.status === EditorStatus.Saving}
    >
      {canReallocatePcr && <GrantMovingOverFinancialYearForm form={PCRForm} editor={editor} />}

      <PCRForm.Fieldset heading="Mark as complete">
        <PCRForm.Checkboxes
          name="itemStatus"
          options={options}
          value={x => (x.status === PCRItemStatus.Complete ? options : [])}
          update={(x, value) =>
            (x.status = value && value.some(y => y.id === "true") ? PCRItemStatus.Complete : PCRItemStatus.Incomplete)
          }
        />

        {allowSubmit && <PCRForm.Submit>Save and return to request</PCRForm.Submit>}
      </PCRForm.Fieldset>
    </PCRForm.Form>
  );
};

const handleChange = (
  workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
  dto: PCRDto,
  itemDto: PCRItemDto,
  itemId: PcrItemId,
  onChange: Callbacks["onChange"],
) => {
  const index = dto.items.findIndex(x => x.id === itemId);
  dto.items[index] = itemDto;
  onChange({ dto, pcrStepId: workflow.getCurrentStepName() });
};

const handleSave = (
  workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
  dto: PCRDto,
  itemId: PcrItemId,
  projectId: ProjectId,
  pcrId: PcrId,
  onSave: Callbacks["onSave"],
  routes: BaseProps["routes"],
  skipToSummary = false,
) => {
  const item = dto.items.find(x => x.id === itemId);
  if (!item) throw new Error(`Cannot find item matching ${itemId}`);

  if (workflow.isOnSummary()) {
    // If submitting from the summary set the status to "Incomplete" only if it's in "To do" (i.e. if it's set to "Complete" then leave it as it is)
    if (item?.status === PCRItemStatus.ToDo) item.status = PCRItemStatus.Incomplete;
    // submit and go back to the prepare page
    return onSave({
      dto,
      pcrStepId: workflow.getCurrentStepName(),
      link: routes.pcrPrepare.getLink({
        projectId,
        pcrId,
      }),
    });
  }

  // If submitting from a step set the status to incomplete
  item.status = PCRItemStatus.Incomplete;

  if (skipToSummary) {
    return onSave({
      dto,
      pcrStepId: workflow.getCurrentStepName(),
      link: routes.pcrPrepareItem.getLink({
        projectId,
        pcrId,
        itemId,
      }),
    });
  }

  const nextStep = workflow.getNextStepInfo();

  return onSave({
    dto,
    pcrStepId: workflow.getCurrentStepName(),
    link: routes.pcrPrepareItem.getLink({
      projectId,
      pcrId,
      itemId,
      step: nextStep?.stepNumber,
    }),
  });
};

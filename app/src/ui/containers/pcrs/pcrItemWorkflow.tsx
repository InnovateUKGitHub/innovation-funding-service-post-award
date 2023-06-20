import { PCRItemStatus, PCRItemType, PCRStepId } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { FinancialVirementDto } from "@framework/dtos/financialVirementDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { ForbiddenError } from "@shared/appError";
import { Pending } from "@shared/pending";
import { createTypedForm, SelectOption } from "@ui/components/form";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink, Link } from "@ui/components/links";
import { PageLoader } from "@ui/components/loading";
import { Title } from "@ui/components/projects/title";
import { Markdown } from "@ui/components/renderers/markdown";
import { Messages } from "@ui/components/renderers/messages";
import { EditorStatus } from "@ui/constants/enums";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { GrantMovingOverFinancialYearForm } from "@ui/containers/pcrs/financialVirements/financialVirementsSummary";
import { NavigationArrowsForPCRs } from "@ui/containers/pcrs/navigationArrows";
import { PcrStepProps, PcrWorkflow, WorkflowPcrType } from "@ui/containers/pcrs/pcrWorkflow";
import WithScrollToTopOnPropChange from "@ui/features/scroll-to-top-on-prop-change";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { IStores, useStores } from "@ui/redux/storesProvider";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PCRWorkflowValidator } from "@ui/validators/pcrWorkflowValidator";
import { useNavigate } from "react-router-dom";
import { PcrSummaryConsumer, PcrSummaryProvider } from "./components/PcrSummary/PcrSummary";

export interface ProjectChangeRequestPrepareItemParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
  step?: number;
}

interface Data {
  virement: Pending<FinancialVirementDto>;
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  pcrItemType: Pending<PCRItemTypeDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>>;
  editableItemTypes: Pending<PCRItemType[]>;
  mode: "prepare" | "review" | "view";
}

interface Callbacks {
  onChange: (props: { dto: PCRDto; pcrStepId?: PCRStepId }) => void;
  onSave: (props: { dto: PCRDto; pcrStepId?: PCRStepId; link: ILinkInfo }) => void;
}

const PCRForm = createTypedForm<PCRItemDto>();

class PCRItemWorkflow extends ContainerBase<ProjectChangeRequestPrepareItemParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partners: this.props.partners,
      virement: this.props.virement,
      pcr: this.props.pcr,
      pcrItem: this.props.pcrItem,
      pcrItemType: this.props.pcrItemType,
      editor: this.props.editor,
      documentsEditor: this.props.documentsEditor,
      editableItemTypes: this.props.editableItemTypes,
    });

    return (
      <PageLoader
        pending={combined}
        render={x =>
          this.renderContents(
            x.project,
            x.partners,
            x.virement,
            x.editor,
            x.documentsEditor,
            x.pcr,
            x.pcrItem,
            x.pcrItemType,
            x.editableItemTypes,
          )
        }
      />
    );
  }

  private getStepLink(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, stepName: string) {
    return this.props.routes.pcrPrepareItem.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      step: workflow && workflow.findStepNumberByName(stepName),
    });
  }

  private getStepReviewLink(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, stepName: string) {
    return this.props.routes.pcrReviewItem.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      step: workflow && workflow.findStepNumberByName(stepName),
    });
  }

  private getEditLink(
    workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
    stepName: string,
    validation: Result | null,
  ) {
    if (this.props.mode !== "prepare") return null;

    return (
      <Link id={validation ? validation.key : undefined} replace route={this.getStepLink(workflow, stepName)}>
        Edit
      </Link>
    );
  }

  private getViewLink(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, stepName: string) {
    if (this.props.mode !== "review") return null;

    return (
      <Link replace route={this.getStepReviewLink(workflow, stepName)}>
        View
      </Link>
    );
  }

  private renderContents(
    project: ProjectDto,
    partners: PartnerDto[],
    virement: FinancialVirementDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
    pcr: PCRDto,
    pcrItem: PCRItemDto,
    pcrItemType: PCRItemTypeDto,
    editableItemTypes: PCRItemType[],
  ) {
    const workflow = PcrWorkflow.getWorkflow(pcrItem as WorkflowPcrType, this.props.step);
    const validation = workflow
      ? workflow.getValidation(new PCRWorkflowValidator(editor.validator, documentsEditor.validator))
      : [editor.validator, documentsEditor.validator];

    return (
      // TODO: Raise ticket to move this provider closer to 'financialVirementsSummary.tsx'
      <PcrSummaryProvider type={pcrItem.type} partners={partners} virement={virement}>
        <Page
          backLink={this.getBackLink()}
          pageTitle={<Title {...project} />}
          project={project}
          validator={validation}
          error={editor.error || documentsEditor.error}
        >
          <Messages messages={this.props.messages} />

          {workflow &&
            this.renderWorkflow(
              workflow,
              project,
              pcr,
              pcrItem,
              pcrItemType,
              editor,
              documentsEditor,
              editableItemTypes,
            )}
        </Page>
      </PcrSummaryProvider>
    );
  }

  private getBackLink() {
    if (this.props.mode === "review") {
      return (
        <BackLink
          route={this.props.routes.pcrReview.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
        >
          Back to request
        </BackLink>
      );
    }
    if (this.props.mode === "prepare") {
      return (
        <BackLink
          route={this.props.routes.pcrPrepare.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
        >
          Back to request
        </BackLink>
      );
    }
    return (
      <BackLink
        route={this.props.routes.pcrDetails.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
      >
        Back to request
      </BackLink>
    );
  }

  private renderWorkflow(
    workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
    project: ProjectDto,
    pcr: PCRDto,
    pcrItem: PCRItemDto,
    pcrItemType: PCRItemTypeDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    const isPrepareMode = this.props.mode === "prepare";
    const isFirstStep = this.props.step === 1;

    const displayGuidance = isPrepareMode && isFirstStep;

    return (
      <>
        {displayGuidance && this.renderGuidanceSection(pcrItem)}

        {workflow.isOnSummary()
          ? this.renderSummarySection(workflow, project, pcr, pcrItem, editor, editableItemTypes)
          : this.renderStep(workflow, project, pcr, pcrItem, pcrItemType, editor, documentsEditor)}
      </>
    );
  }

  private renderGuidanceSection(pcrItem: PCRItemDto) {
    if (!pcrItem.guidance) return null;

    return (
      <Section qa="guidance">
        <Markdown trusted value={pcrItem.guidance} />
      </Section>
    );
  }

  private renderStep(
    workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
    project: ProjectDto,
    pcr: PCRDto,
    pcrItem: PCRItemDto,
    pcrItemType: PCRItemTypeDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>,
  ) {
    const validator = editor.validator.items.results.find(x => x.model.id === pcrItem.id);
    if (!validator) throw new Error(`Cannot find validator matching itemId ${this.props.itemId}`);
    const status = editor.status || EditorStatus.Editing;
    const { mode } = this.props;

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
      routes: this.props.routes,
      mode,
      onChange: itemDto => this.onChange(workflow, editor.data, itemDto),
      onSave: skipToSummary => this.onSave(workflow, editor.data, skipToSummary),
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

    const CurrentStep = currentStep.stepRender;
    return (
      <WithScrollToTopOnPropChange propToScrollOn={workflow.getCurrentStepName()}>
        <CurrentStep {...props} />
      </WithScrollToTopOnPropChange>
    );
  }

  private renderSummary(
    workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
    project: ProjectDto,
    pcr: PCRDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
  ) {
    const pcrItem = editor.data.items.find(x => x.id === this.props.itemId);
    if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${this.props.itemId}`);
    const validator = editor.validator.items.results.find(x => x.model.id === pcrItem.id);
    if (!validator) throw new Error(`Cannot find validator matching itemId ${this.props.itemId}`);
    const { projectId, mode } = this.props;
    const workflowSummary = workflow.getSummary();

    // TODO: This should throw and Error and stop the UI from crashing
    if (!workflowSummary) return null;

    return workflowSummary.summaryRender({
      projectId,
      validator,
      pcrItem,
      project,
      pcr,
      onSave: () => this.onSave(workflow, editor.data),
      getStepLink: stepName => this.getStepLink(workflow, stepName),
      getEditLink: (stepName, validation) => this.getEditLink(workflow, stepName, validation),
      getViewLink: stepName => this.getViewLink(workflow, stepName),
      mode,
      config: this.props.config,
      messages: this.props.messages,
      routes: this.props.routes,
      currentRoute: this.props.currentRoute,
    });
  }

  private renderCompleteForm(
    workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    config: {
      allowSubmit: boolean;
    },
  ) {
    const pcrItem = editor.data.items.find(x => x.id === this.props.itemId);
    if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${this.props.itemId}`);
    const canReallocatePcr = pcrItem.type === PCRItemType.MultiplePartnerFinancialVirement;

    const options: SelectOption[] = [{ id: "true", value: "I agree with this change." }];

    return (
      <PCRForm.Form
        qa="pcr_complete_item_form"
        data={pcrItem}
        onChange={dto => this.onChange(workflow, editor.data, dto)}
        onSubmit={() => this.onSave(workflow, editor.data)}
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

          {config.allowSubmit && <PCRForm.Submit>Save and return to request</PCRForm.Submit>}
        </PCRForm.Fieldset>
      </PCRForm.Form>
    );
  }

  private renderSummarySection(
    workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>,
    project: ProjectDto,
    pcr: PCRDto,
    pcrItem: PCRItemDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    const { mode } = this.props;
    const isPrepareMode = mode === "prepare";
    const isReviewing = mode === "review";
    const displayNavigationArrows = mode === "review" || mode === "view";

    return (
      <WithScrollToTopOnPropChange propToScrollOn={workflow.getCurrentStepName()}>
        <PcrSummaryConsumer>
          {summaryContext => {
            const displayCompleteForm = isPrepareMode && summaryContext.isSummaryValid;

            return (
              <Section qa="item-save-and-return">
                {this.renderSummary(workflow, project, pcr, editor)}

                {displayCompleteForm &&
                  this.renderCompleteForm(workflow, editor, {
                    allowSubmit: summaryContext.allowSubmit,
                  })}

                {displayNavigationArrows && (
                  <NavigationArrowsForPCRs
                    pcr={pcr}
                    currentItem={pcrItem}
                    isReviewing={isReviewing}
                    editableItemTypes={editableItemTypes}
                    routes={this.props.routes}
                  />
                )}
              </Section>
            );
          }}
        </PcrSummaryConsumer>
      </WithScrollToTopOnPropChange>
    );
  }

  private onChange(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, dto: PCRDto, itemDto: PCRItemDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange({ dto, pcrStepId: workflow.getCurrentStepName() });
  }

  private onSave(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, dto: PCRDto, skipToSummary = false) {
    const item = dto.items.find(x => x.id === this.props.itemId);
    if (!item) throw new Error(`Cannot find item matching ${this.props.itemId}`);

    if (workflow.isOnSummary()) {
      // If submitting from the summary set the status to "Incomplete" only if it's in "To do" (i.e. if it's set to "Complete" then leave it as it is)
      if (item?.status === PCRItemStatus.ToDo) item.status = PCRItemStatus.Incomplete;
      // submit and go back to the prepare page
      return this.props.onSave({
        dto,
        pcrStepId: workflow.getCurrentStepName(),
        link: this.props.routes.pcrPrepare.getLink({
          projectId: this.props.projectId,
          pcrId: this.props.pcrId,
        }),
      });
    }

    // If submitting from a step set the status to incomplete
    item.status = PCRItemStatus.Incomplete;

    if (skipToSummary) {
      return this.props.onSave({
        dto,
        pcrStepId: workflow.getCurrentStepName(),
        link: this.props.routes.pcrPrepareItem.getLink({
          projectId: this.props.projectId,
          pcrId: this.props.pcrId,
          itemId: this.props.itemId,
        }),
      });
    }

    const nextStep = workflow.getNextStepInfo();

    return this.props.onSave({
      dto,
      pcrStepId: workflow.getCurrentStepName(),
      link: this.props.routes.pcrPrepareItem.getLink({
        projectId: this.props.projectId,
        pcrId: this.props.pcrId,
        itemId: this.props.itemId,
        step: nextStep?.stepNumber,
      }),
    });
  }
}

const PCRItemContainer = (
  props: ProjectChangeRequestPrepareItemParams & BaseProps & { mode: "prepare" | "review" | "view" },
) => {
  const stores = useStores();
  const navigate = useNavigate();

  return (
    <PCRItemWorkflow
      {...props}
      virement={stores.financialVirements.get(props.projectId, props.pcrId, props.itemId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
      project={stores.projects.getById(props.projectId)}
      pcrItem={stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId)}
      pcrItemType={stores.projectChangeRequests.getPcrTypeForItem(props.projectId, props.pcrId, props.itemId)}
      pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
      editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
      editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
      documentsEditor={stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(
        props.projectId,
        props.itemId,
      )}
      onSave={({ dto, pcrStepId = PCRStepId.none, link }) => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor({
          saving: true,
          projectId: props.projectId,
          pcrStepId,
          dto,
          onComplete: () => {
            navigate(link.path);
          },
        });
      }}
      onChange={({ dto, pcrStepId = PCRStepId.none }) => {
        stores.messages.clearMessages();
        stores.projectChangeRequests.updatePcrEditor({ saving: false, projectId: props.projectId, pcrStepId, dto });
      }}
    />
  );
};

const getTitle = (defaultTitle: string, params: ProjectChangeRequestPrepareItemParams, stores: IStores) => {
  const typeName = stores.projectChangeRequests
    .getItemById(params.projectId, params.pcrId, params.itemId)
    .then(x => x.typeName).data;

  return {
    htmlTitle: typeName ? `${typeName}` : defaultTitle,
    displayTitle: typeName ? `${typeName}` : defaultTitle,
  };
};

export const PCRViewItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  allowRouteInActiveAccess: true,
  routeName: "pcrViewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/item/:itemId",
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    itemId: route.params.itemId as PcrItemId,
    pcrId: route.params.pcrId as PcrId,
  }),
  container: function PCRViewItemContainer(props) {
    return <PCRItemContainer {...props} mode="view" />;
  },
  getTitle: ({ params, stores }) => getTitle("View project change request item", params, stores),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});

export const PCRReviewItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  routeName: "pcrReviewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId",
  routePathWithQuery: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId?:step",
  container: function PCRReviewItemContainer(props) {
    return <PCRItemContainer {...props} mode="review" />;
  },
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    itemId: route.params.itemId as PcrItemId,
    pcrId: route.params.pcrId as PcrId,
    step: parseInt(route.params.step, 10),
  }),
  getTitle: ({ params, stores }) => getTitle("Review project change request item", params, stores),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer),
});

export const PCRPrepareItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  routeName: "pcrPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId",
  routePathWithQuery: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId?:step",
  container: function PCRPrepareItemContainer(props) {
    return <PCRItemContainer {...props} mode="prepare" />;
  },
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    step: parseInt(route.params.step, 10),
  }),
  getTitle: ({ params, stores, content }) =>
    getTitle(
      content.getCopyString(x => x.pages.pcrPrepareItem.title),
      params,
      stores,
    ),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

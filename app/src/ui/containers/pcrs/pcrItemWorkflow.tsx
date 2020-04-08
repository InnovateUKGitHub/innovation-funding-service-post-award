import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ILinkInfo, PCRItemDto, PCRItemStatus, PCRItemType, ProjectDto, ProjectRole } from "@framework/types";
import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { EditorStatus, IEditorStore, IStores, StoresConsumer } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRDtoValidator } from "@ui/validators";
import { Result } from "@ui/validation/result";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { Results } from "@ui/validation";
import { PCRWorkflowValidator } from "@ui/validators/pcrWorkflowValidator";
import { GrantMovingOverFinancialYearForm } from "./financialVirements/financialVirementsSummary";
import { NavigationArrowsForPCRs } from "@ui/containers/pcrs/navigationArrows";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export interface ProjectChangeRequestPrepareItemParams {
  projectId: string;
  pcrId: string;
  itemId: string;
  step?: number;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  pcrItemType: Pending<PCRItemTypeDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  documentsEditor: Pending<IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>>;
  editableItemTypes: Pending<PCRItemType[]>;
  mode: "prepare" | "review" | "view";
}

interface Callbacks {
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto, link: ILinkInfo) => void;
}

class Component extends ContainerBase<ProjectChangeRequestPrepareItemParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      pcrItem: this.props.pcrItem,
      pcrItemType: this.props.pcrItemType,
      editor: this.props.editor,
      documentsEditor: this.props.documentsEditor,
      editableItemTypes: this.props.editableItemTypes,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.editor, x.documentsEditor, x.pcr, x.pcrItem, x.pcrItemType, x.editableItemTypes)} />;
  }

  private getStepLink(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, stepName: string) {
    return this.props.routes.pcrPrepareItem.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      step: workflow && workflow.findStepNumberByName(stepName)
    });
  }

  private getEditLink(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, stepName: string, validation: Result | null) {
    if (this.props.mode !== "prepare") {
      return null;
    }
    return <ACC.Link id={validation ? validation.key : undefined} replace={true} route={this.getStepLink(workflow, stepName)}>Edit</ACC.Link>;
  }

  private renderContents(project: ProjectDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, pcr: PCRDto, pcrItem: PCRItemDto, pcrItemType: PCRItemTypeDto, editableItemTypes: PCRItemType[]) {
    const workflow = PcrWorkflow.getWorkflow(pcrItem, this.props.step, this.props.config.features);
    const validation = workflow ? workflow.getValidation(new PCRWorkflowValidator(editor.validator, documentsEditor.validator)) : [editor.validator, documentsEditor.validator];
    return (
      <ACC.Page
        backLink={this.getBackLink()}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={validation}
        error={editor.error || documentsEditor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />
        {workflow && this.renderWorkflow(workflow, project, pcr, pcrItem, pcrItemType, editor, documentsEditor, editableItemTypes)}
      </ACC.Page>
    );
  }

  private getBackLink() {
    if (this.props.mode === "review") {
      return <ACC.BackLink route={this.props.routes.pcrReview.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>;
    }
    if (this.props.mode === "prepare") {
      return <ACC.BackLink route={this.props.routes.pcrPrepare.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>;
    }
    return <ACC.BackLink route={this.props.routes.pcrDetails.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>;
  }

  private renderWorkflow(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, pcrItemType: PCRItemTypeDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>, editableItemTypes: PCRItemType[]) {
    return (
      <React.Fragment>
        {this.props.mode === "prepare" && this.props.step === 1 && this.renderGuidanceSection(pcrItem)}
        {this.props.mode === "prepare" && !workflow.isOnSummary() && this.renderStep(workflow, project, pcr, pcrItem, pcrItemType, editor, documentsEditor)}
        {workflow.isOnSummary() && this.renderSummarySection(workflow, project, pcr, pcrItem, editor, editableItemTypes)}
      </React.Fragment>
    );
  }

  private renderGuidanceSection(pcrItem: PCRItemDto) {
    if (!pcrItem.guidance) return null;
    return (
      <ACC.Section qa="guidance">
        <ACC.Renderers.Markdown value={pcrItem.guidance} />
      </ACC.Section>
    );
  }

  private renderStep(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, pcrItemType: PCRItemTypeDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>) {
    const validator = editor.validator.items.results.find(x => x.model.id === pcrItem.id)!;
    const status = editor.status || EditorStatus.Editing;

    const currentStep = workflow.getCurrentStepInfo()!;

    return (
      currentStep.stepRender({
        pcr,
        pcrItem,
        pcrItemType,
        documentsEditor,
        project,
        validator,
        status,
        isClient: this.props.isClient,
        onChange: itemDto => this.onChange(editor.data, itemDto),
        onSave: (skipToSummary) => this.onSave(workflow, editor.data, skipToSummary),
        getRequiredToCompleteMessage: (message) => {
          const standardMessage = "This is required to complete this request.";
          if (message) {
            return <span>{message}<br />{standardMessage}</span>;
          }
          return standardMessage;
        }
      })
    );
  }

  private renderSummary(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const pcrItem = editor.data.items.find(x => x.id === this.props.itemId)!;
    const validator = editor.validator.items.results.find(x => x.model.id === pcrItem.id)!;
    const { projectId, mode } = this.props;
    return workflow.getSummary()!.summaryRender({
      projectId,
      validator,
      pcrItem,
      project,
      pcr,
      onSave: () => this.onSave(workflow, editor.data),
      getStepLink: (stepName) => this.getStepLink(workflow, stepName),
      getEditLink: (stepName, validation) => this.getEditLink(workflow, stepName, validation),
      mode,
      config: this.props.config,
      isClient: this.props.isClient,
      messages: this.props.messages,
      route: this.props.route,
      routes: this.props.routes
    });
  }

  private renderCompleteForm(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const PCRForm = ACC.TypedForm<PCRItemDto>();

    const options: ACC.SelectOption[] = [
      { id: "true", value: "I have finished making changes." }
    ];

    const pcrItem = editor.data.items.find(x => x.id === this.props.itemId)!;

    const typeSpecificForm = pcrItem.type === PCRItemType.MultiplePartnerFinancialVirement ? <GrantMovingOverFinancialYearForm form={PCRForm} editor={editor}/> : null;
    return (
      <PCRForm.Form
        qa="pcr_complete_item_form"
        data={pcrItem}
        onChange={dto => this.onChange(editor.data, dto)}
        onSubmit={() => this.onSave(workflow, editor.data)}
        isSaving={editor.status === EditorStatus.Saving}
      >
        {typeSpecificForm}
        <PCRForm.Fieldset heading="Mark as complete">
          <PCRForm.Checkboxes
            name="itemStatus"
            options={options}
            value={x => x.status === PCRItemStatus.Complete ? options : []}
            update={(x, value) => x.status = (value && value.some(y => y.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
          />
          <PCRForm.Submit>Save and return to request</PCRForm.Submit>
        </PCRForm.Fieldset>
      </PCRForm.Form>
    );
  }

  private renderNavigationArrows(pcr: PCRDto, pcrItem: PCRItemDto, editableItemTypes: PCRItemType[]) {
    return <NavigationArrowsForPCRs pcr={pcr} currentItem={pcrItem} isReviewing={this.props.mode === "review"} editableItemTypes={editableItemTypes} routes={this.props.routes} />;
  }

  private renderSummarySection(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: PCRItemType[]) {
    return (
      <ACC.Section qa="item-save-and-return">
        {this.renderSummary(workflow, project, pcr, editor)}
        {this.props.mode === "prepare" && this.renderCompleteForm(workflow, editor)}
        {(this.props.mode === "review" || this.props.mode === "view") && this.renderNavigationArrows(pcr, pcrItem, editableItemTypes)}
      </ACC.Section>
    );
  }

  private onChange(dto: PCRDto, itemDto: PCRItemDto): void {
    const index = dto.items.findIndex(x => x.id === this.props.itemId);
    dto.items[index] = itemDto;
    this.props.onChange(dto);
  }

  private onSave(workflow: PcrWorkflow<PCRItemDto, Results<PCRItemDto>>, dto: PCRDto, skipToSummary: boolean = false) {

    const item = dto.items.find(x => x.id === this.props.itemId)!;

    // If on the summary
    if (workflow.isOnSummary()) {
      // If submitting from the summary set the status to "Incomplete" only if it's in "To do" (i.e. if it's set to "Complete" then leave it as it is)
      if (item.status === PCRItemStatus.ToDo) item.status = PCRItemStatus.Incomplete;
      // submit and go back to the prepare page
      return this.props.onSave(dto, this.props.routes.pcrPrepare.getLink({
        projectId: this.props.projectId,
        pcrId: this.props.pcrId
      }));
    }

    // If submitting from a step set the status to incomplete
    item.status = PCRItemStatus.Incomplete;

    if (skipToSummary) {
      return this.props.onSave(dto, this.props.routes.pcrPrepareItem.getLink({
        projectId: this.props.projectId,
        pcrId: this.props.pcrId,
        itemId: this.props.itemId
      }));
    }

    const nextStep = workflow.getNextStepInfo();

    return this.props.onSave(dto, this.props.routes.pcrPrepareItem.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      itemId: this.props.itemId,
      step: nextStep && nextStep.stepNumber,
    }));
  }
}

const PCRItemContainer = (props: ProjectChangeRequestPrepareItemParams & BaseProps & { mode: "prepare" | "review" | "view" }) => (
  <StoresConsumer>
    {stores => (
      <Component
        project={stores.projects.getById(props.projectId)}
        pcrItem={stores.projectChangeRequests.getItemById(props.projectId, props.pcrId, props.itemId)}
        pcrItemType={stores.projectChangeRequests.getPcrTypeForItem(props.projectId, props.pcrId, props.itemId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
        documentsEditor={stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(props.projectId, props.itemId)}
        editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
        onSave={(dto, link) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(true, props.projectId, dto, undefined, () =>
            stores.navigation.navigateTo(link));
        }}
        onChange={(dto) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(false, props.projectId, dto);
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

const getTitle = (defaultTitle: string, params: ProjectChangeRequestPrepareItemParams, stores: IStores) => {
  const typeName = stores.projectChangeRequests.getItemById(params.projectId, params.pcrId, params.itemId).then(x => x.typeName).data;
  return {
    htmlTitle: typeName ? `${typeName}` : defaultTitle,
    displayTitle: typeName ? `${typeName}` : defaultTitle,
  };
};

export const PCRViewItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  routeName: "pcrViewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/item/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    itemId: route.params.itemId,
    pcrId: route.params.pcrId
  }),
  container: (props) => <PCRItemContainer mode="view" {...props} />,
  getTitle: ({ params, stores }) => getTitle("View project change request item", params, stores),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});

export const PCRReviewItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  routeName: "pcrReviewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId",
  container: (props) => <PCRItemContainer mode="review" {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    itemId: route.params.itemId,
    pcrId: route.params.pcrId
  }),
  getTitle: ({ params, stores }) => getTitle("Review project change request item", params, stores),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
});

export const PCRPrepareItemRoute = defineRoute<ProjectChangeRequestPrepareItemParams>({
  routeName: "pcrPrepareItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId?:step",
  container: (props) => <PCRItemContainer mode="prepare" {...props} />,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    step: parseInt(route.params.step, 10)
  }),
  getTitle: ({ params, stores }) => getTitle("Prepare project change request item", params, stores),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});

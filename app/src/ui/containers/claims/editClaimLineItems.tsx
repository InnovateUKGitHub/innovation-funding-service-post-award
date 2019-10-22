import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import { Pending } from "@shared/pending";
import { ProjectDto, ProjectRole } from "@framework/types";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { ContainerBaseWithState, ContainerProps, ReduxContainer } from "@ui/containers/containerBase";
import { DocumentList, ValidationMessage } from "@ui/components";
import { ClaimDetailsValidator, ClaimLineItemDtoValidator } from "@ui/validators/claimDetailsValidator";
import { IRoutes } from "@ui/routing";

export interface EditClaimDetailsParams {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  claimDetails: Pending<ClaimDetailsDto>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  claimDetails: ClaimDetailsDto;
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>;
}

interface Callbacks {
  validate: (partnerId: string, periodId: number, costCategoryId: string, dto: ClaimDetailsDto) => void;
  save: (projectId: string, partnerId: string, periodId: number, costCategoryId: string, dto: ClaimDetailsDto) => void;
  saveAndUpload: (projectId: string, partnerId: string, costCategoryId: string, periodId: number, dto: ClaimDetailsDto) => void;
}

export class EditClaimLineItemsComponent extends ContainerBaseWithState<EditClaimDetailsParams, Data, Callbacks, { showAddRemove: boolean }> {
  constructor(props: ContainerProps<EditClaimDetailsParams, Data, Callbacks>) {
    super(props);
    this.state = { showAddRemove: false };
  }

  componentDidMount() {
    this.setState({ showAddRemove: true });
  }

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      claimDetails: this.props.claimDetails,
      costCategories: this.props.costCategories,
      forecastDetail: this.props.forecastDetail,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  // @TODO fix back link
  private renderContents({ project, costCategories, documents, forecastDetail, claimDetails, editor }: CombinedData) {
    const back = this.props.routes.prepareClaim.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={back}>Back to claim</ACC.BackLink>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Section>
          <ACC.TextHint text={costCategory.hintText} />
          {costCategory.isCalculated ? this.renderCalculated(costCategory, claimDetails, forecastDetail, documents, editor) : this.renderTable(editor, forecastDetail, documents)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderCalculated(costCategory: CostCategoryDto, claimDetails: ClaimDetailsDto, forecastDetail: ForecastDetailsDTO, documents: DocumentSummaryDto[], editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator> ) {
    const mockItems = [{
      costCategoryId: costCategory.id,
      description: costCategory.name,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      id: "",
      value: claimDetails.value
    }];

    const LineItemForm = ACC.TypedForm<ClaimDetailsDto>();
    const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();

    return (
      <LineItemForm.Form
        editor={editor}
        onSubmit={() => this.props.save(this.props.projectId, this.props.partnerId, this.props.periodId, this.props.costCategoryId, editor.data)}
        qa="current-claim-summary-form"
      >
        <LineItemForm.Fieldset>
          <LineItemTable.Table
            data={mockItems}
            footers={this.renderFooters(mockItems, forecastDetail, false, editor)}
            qa="current-claim-summary-table"
          >
            <LineItemTable.String header="Description" qa="cost-description" value={(x, i) => x.description} />
            <LineItemTable.Currency header="Cost (£)" qa="cost-value" value={(x, i) => x.value} width={30} />
          </LineItemTable.Table>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          {this.renderDocuments(documents)}
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <LineItemForm.Button name="upload" onClick={() => this.props.saveAndUpload(this.props.projectId, this.props.partnerId, this.props.costCategoryId, this.props.periodId, editor.data)}>Upload and remove documents</LineItemForm.Button>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset heading={"Additional information"} qa="additional-info-form" headingQa="additional-info-heading">
          <LineItemForm.MultilineString
            label="additional-info"
            hint={"Explain any difference between the forecast costs and the total costs."}
            labelHidden={true}
            name="comments"
            value={() => editor.data.comments}
            update={(dto, v) => dto.comments = v}
            qa="info-text-area"
          />
        </LineItemForm.Fieldset>
        <LineItemForm.Submit>Save and return to claim</LineItemForm.Submit>
      </LineItemForm.Form>
    );

  }

  private renderTable(editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>, forecastDetail: ForecastDetailsDTO, documents: DocumentSummaryDto[]) {
    const LineItemForm = ACC.TypedForm<ClaimDetailsDto>();
    const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();
    const validationResults = editor.validator.items.results;

    return (
      <LineItemForm.Form
        editor={editor}
        onSubmit={() => this.props.save(this.props.projectId, this.props.partnerId, this.props.periodId, this.props.costCategoryId, editor.data)}
        qa="current-claim-summary-form"
      >
        <LineItemForm.Hidden name="itemCount" value={x => x.lineItems.length} />
        <LineItemForm.Fieldset>
          <LineItemTable.Table
            data={editor.data.lineItems}
            validationResult={validationResults}
            footers={this.renderFooters(editor.data.lineItems, forecastDetail, this.state.showAddRemove, editor)}
            qa="current-claim-summary-table"
          >
            <LineItemTable.Custom header="Description" qa="cost-description" value={(x, i) => this.renderDescription(x, i, validationResults[i.row], editor)} />
            <LineItemTable.Custom header="Cost (£)" qa="cost-value" classSuffix="numeric" value={(x, i) => this.renderCost(x, i, validationResults[i.row], editor)} width={30} />
            {this.state.showAddRemove ?
              <LineItemTable.Custom header="Action" hideHeader={true} qa="remove" value={(x, i) => <a href="" className="govuk-link" role="button" onClick={e => this.removeItem(x, i, e, editor)}>Remove</a>} width={1}/>
              : null}
          </LineItemTable.Table>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          {this.renderDocuments(documents)}
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <LineItemForm.Button name="upload" onClick={() => this.props.saveAndUpload(this.props.projectId, this.props.partnerId, this.props.costCategoryId, this.props.periodId, editor.data)}>Upload and remove documents</LineItemForm.Button>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset heading={"Additional information"} qa="additional-info-form" headingQa="additional-info-heading">
          <LineItemForm.MultilineString
            label="additional-info"
            hint={"Explain any difference between the forecast costs and the total costs."}
            labelHidden={true}
            name="comments"
            value={() => editor.data.comments}
            update={(data, v) => data.comments = v}
            qa="info-text-area"
          />
        </LineItemForm.Fieldset>
        <LineItemForm.Submit>Save and return to claim</LineItemForm.Submit>
      </LineItemForm.Form>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return (
      <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "All documents open in a new window." : ""} qa="supporting-documents-section">
        <ACC.Renderers.SimpleString>If you are unsure what evidence to provide, speak to your monitoring officer.  They will use these documents when reviewing your claim.</ACC.Renderers.SimpleString>
        {documents.length > 0 ? <DocumentList documents={documents} qa="supporting-documents" /> : <ValidationMessage message="No documents uploaded." messageType="info" />}
      </ACC.Section>
    );
  }

  renderCost(item: ClaimLineItemDto, index: { column: number; row: number; }, validation: ClaimLineItemDtoValidator, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    return (
      <span>
        <ACC.ValidationError error={validation.cost} />
        <ACC.Inputs.NumberInput
          name={`value${index.row}`}
          value={item.value}
          disabled={editor.status === EditorStatus.Saving}
          onChange={val => this.updateItem(index, editor, dto => dto.value = val!)}
          ariaLabel={`value of claim line item ${index.row + 1}`}
        />
      </span>
    );
  }

  renderDescription(item: ClaimLineItemDto, index: { column: number; row: number; }, validation: ClaimLineItemDtoValidator, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    return (
      <span>
        <ACC.ValidationError error={validation.description} />
        <ACC.Inputs.TextInput
          name={`description${index.row}`}
          value={item.description}
          disabled={editor.status === EditorStatus.Saving}
          onChange={val => this.updateItem(index, editor, dto => dto.description = val!)}
          ariaLabel={`description of claim line item ${index.row + 1}`}
        />
      </span>
    );
  }

  removeItem(item: ClaimLineItemDto, i: { column: number; row: number; }, e: React.SyntheticEvent<HTMLAnchorElement>, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    e.preventDefault();
    const dto = editor.data;
    dto.lineItems.splice(i.row, 1);
    this.props.validate(this.props.partnerId, this.props.periodId, this.props.costCategoryId, dto);
  }

  addItem(e: React.SyntheticEvent<HTMLAnchorElement>, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    e.preventDefault();
    const dto = editor.data;
    dto.lineItems.push({
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    } as ClaimLineItemDto);
    this.props.validate(this.props.partnerId, this.props.periodId, this.props.costCategoryId, dto);
  }

  updateItem(i: { column: number; row: number; }, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>, update: (item: ClaimLineItemDto) => void) {
    const dto = editor.data;
    update(dto.lineItems[i.row]);
    this.props.validate(this.props.partnerId, this.props.periodId, this.props.costCategoryId, dto);
  }

  private renderFooters(data: ClaimLineItemDto[], forecastDetail: ForecastDetailsDTO, showAddRemove: boolean, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    const total = data.reduce((t, item) => t + (item.value || 0), 0);
    // @TODO remove multiply by 100
    const forecast = forecastDetail.value;
    const diff = 100 * (forecast - total) / forecast;

    const footers: JSX.Element[] = [];

    if (showAddRemove) {
      footers.push(
        <tr key={1} className="govuk-table__row">
          <td className="govuk-table__cell" colSpan={3}><a href="" className="govuk-link" role="button" onClick={(e) => this.addItem(e, editor)} data-qa="add-cost">Add a cost</a></td>
        </tr>
      );
    }

    footers.push(
      <tr key={2} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Total costs</td>
        <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={total} /></td>
        {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td> : null}
      </tr>
    );

    footers.push(
      <tr key={3} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Forecast costs</td>
        <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={forecast} /></td>
        {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td> : null}
      </tr>
    );

    if (forecast > 0) {
      footers.push(
        <tr key={4} className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Difference</td>
          <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Percentage value={diff} /></td>
          {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td> : null}
        </tr>
      );
    }

    return footers;
  }

}

const afterSave = (dispatch: any, projectId: string, partnerId: string, periodId: number, routes: IRoutes) => {
  dispatch(Actions.navigateTo(routes.prepareClaim.getLink({ projectId, periodId, partnerId })));
};

const redirectToUploadPage = (dispatch: any, projectId: string, partnerId: string, costCategoryId: string, periodId: number, routes: IRoutes) => {
  dispatch(Actions.navigateTo(routes.claimDetailDocuments.getLink({ projectId, partnerId, costCategoryId, periodId })));
};

const definition = ReduxContainer.for<EditClaimDetailsParams, Data, Callbacks>(EditClaimLineItemsComponent);

export const EditClaimLineItems = definition.connect({
  withData: (state, props) => {
    return {
      project: Selectors.getActiveProject(props.projectId, state),
      claimDetails: Selectors.getClaimDetails(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      forecastDetail: Selectors.getForecastDetail(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
      editor: Selectors.getClaimDetailsEditor(props.partnerId, props.periodId, props.costCategoryId).get(state),
      documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state)
    };
  },
  withCallbacks: (dispatch, routes) => ({
    validate: (partnerId: string, periodId: number, costCategoryId: string, dto: ClaimDetailsDto) =>
      dispatch(Actions.validateClaimDetails(partnerId, periodId, costCategoryId, dto)),
    save: (projectId: string, partnerId: string, periodId: number, costCategoryId: string, dto: ClaimDetailsDto) =>
      dispatch(Actions.saveClaimDetails(projectId, partnerId, periodId, costCategoryId, dto, () =>
        afterSave(dispatch, projectId, partnerId, periodId, routes))),
    saveAndUpload: (projectId: string, partnerId: string, costCategoryId: string, periodId: number, dto: ClaimDetailsDto) =>
      dispatch(Actions.saveClaimDetails(projectId, partnerId, periodId, costCategoryId, dto, () =>
        redirectToUploadPage(dispatch, projectId, partnerId, costCategoryId, periodId, routes))),
  })
});

export const EditClaimLineItemsRoute = definition.route({
  routeName: "claimLineItemEdit",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadCostCategories(),
    Actions.loadClaimDetails(params.projectId, params.partnerId, params.periodId, params.costCategoryId),
    Actions.loadForecastDetail(params.partnerId, params.periodId, params.costCategoryId),
    Actions.loadClaimDetailDocuments({projectId: params.projectId, partnerId: params.partnerId, periodId: params.periodId, costCategoryId: params.costCategoryId})
  ],
  container: EditClaimLineItems,
  accessControl: (auth, params) => auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: (store, params) => {
    const costCatName = Selectors.getCostCatetory(params.costCategoryId).getPending(store).then(x => x!.name).data;
    return {
      htmlTitle: costCatName ? `Add costs for ${costCatName}` : "Add costs",
      displayTitle: costCatName || "Costs"
    };
  },
});

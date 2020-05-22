import React from "react";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { ClaimDto, ProjectDto, ProjectRole } from "@framework/types";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "@ui/containers/containerBase";
import { ValidationMessage } from "@ui/components";
import { ClaimDetailsValidator, ClaimLineItemDtoValidator } from "@ui/validators/claimDetailsValidator";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

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
  draftClaim: Pending<ClaimDto | null>;
}

interface CombinedData {
  project: ProjectDto;
  claimDetails: ClaimDetailsDto;
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>;
  draftClaim: ClaimDto | null;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ClaimDetailsDto, goToUpdload?: boolean) =>  void;
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
      draftClaim: this.props.draftClaim,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  // @TODO fix back link
  private renderContents({ project, costCategories, documents, forecastDetail, claimDetails, editor, draftClaim }: CombinedData) {
    const back = this.props.routes.prepareClaim.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={back}>Back to claim</ACC.BackLink>}
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        {this.isInterimClaim(draftClaim, project) && <ACC.ValidationMessage messageType="alert" qa="interim-claim-guidance-FC" message={"Do not change any information for costs you have already been paid. Add the month for which the cost is being claimed in the description, using different costs for the same expenditure across different months."}/>}
        {this.renderGuidanceMessage()}
        <ACC.Section>
          <ACC.TextHint text={costCategory.hintText} />
          {costCategory.isCalculated ? this.renderCalculated(costCategory, claimDetails, forecastDetail, documents, editor) : this.renderTable(editor, forecastDetail, documents)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderCalculated(costCategory: CostCategoryDto, claimDetails: ClaimDetailsDto, forecastDetail: ForecastDetailsDTO, documents: DocumentSummaryDto[], editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator> ) {
    const mockItems: ClaimLineItemDto[] = [{
      costCategoryId: costCategory.id,
      description: costCategory.name,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      id: "",
      value: claimDetails.value,
      lastModifiedDate: new Date()
    }];

    const LineItemForm = ACC.TypedForm<ClaimDetailsDto>();
    const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();

    return (
      <LineItemForm.Form
        editor={editor}
        onSubmit={() => this.props.onUpdate(true, editor.data, false)}
        qa="current-claim-summary-form"
      >
        <LineItemForm.Fieldset>
          <LineItemTable.Table
            data={mockItems}
            footers={this.renderFooters(mockItems, forecastDetail, false, editor)}
            qa="current-claim-summary-table"
          >
            <LineItemTable.String header="Description" qa="cost-description" value={(x, i) => x.description} />
            <LineItemTable.ShortDate header="Last updated" qa="cost-last-updated" value={(x, i) => x.lastModifiedDate} />
            <LineItemTable.Currency header="Cost (£)" qa="cost-value" value={(x, i) => x.value} width={30} />
          </LineItemTable.Table>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          {this.renderDocuments(documents)}
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <LineItemForm.Button name="upload" onClick={() => this.props.onUpdate(true, editor.data, true)}>Upload and remove documents</LineItemForm.Button>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset heading={"Additional information"} qa="additional-info-form" headingQa="additional-info-heading">
          <LineItemForm.MultilineString
            label="additional-info"
            hint="Explain any difference between the forecast costs and the total costs, and what actions are you taking because of this. For example updating the project plan or financial forecast."
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
        onSubmit={() => this.props.onUpdate(true, editor.data, false)}
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
            <LineItemTable.ShortDate header="Last updated" qa="cost-last-updated" value={x => x.lastModifiedDate} />
            {this.state.showAddRemove ?
              <LineItemTable.Custom header="Action" hideHeader={true} qa="remove" value={(x, i) => <a href="" className="govuk-link" role="button" onClick={e => this.removeItem(x, i, e, editor)}>Remove</a>} width={1}/>
              : null}
          </LineItemTable.Table>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          {this.renderDocuments(documents)}
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <LineItemForm.Button name="upload" onClick={() => this.props.onUpdate(true, editor.data, true)}>Upload and remove documents</LineItemForm.Button>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset heading={"Additional information"} qa="additional-info-form" headingQa="additional-info-heading">
          <LineItemForm.MultilineString
            label="additional-info"
            hint="Explain any difference between the forecast costs and the total costs, and what actions are you taking because of this. For example updating the project plan or financial forecast."
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

  private renderGuidanceMessage() {
    return (
      <ACC.Renderers.SimpleString qa="guidance-message">
        You must break down your total costs and upload evidence for each expenditure you are claiming for. Contact your monitoring officer for more information about the level of detail you are required to provide.
      </ACC.Renderers.SimpleString>
    );
  }

  private renderDocuments(documents: DocumentSummaryDto[]) {
    return (
      <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "All documents open in a new window." : ""} qa="supporting-documents-section">
        <ACC.Renderers.SimpleString>Upload evidence of the costs for your monitoring officer to review. If you do not upload documents your monitoring officer is unlikely to accept your claim. Contact them for advice on which documents to provide.</ACC.Renderers.SimpleString>
        {documents.length > 0 ? <ACC.DocumentTable documents={documents} qa="supporting-documents"/> : <ValidationMessage message="No documents uploaded." messageType="info" />}
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
    this.props.onUpdate(false, dto);
  }

  addItem(e: React.SyntheticEvent<HTMLAnchorElement>, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    e.preventDefault();
    const dto = editor.data;
    dto.lineItems.push({
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    } as ClaimLineItemDto);
    this.props.onUpdate(false, dto);
  }

  updateItem(i: { column: number; row: number; }, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>, update: (item: ClaimLineItemDto) => void) {
    const dto = editor.data;
    update(dto.lineItems[i.row]);
    this.props.onUpdate(false, dto);
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
          <td className="govuk-table__cell" colSpan={4}><a href="" className="govuk-link" role="button" onClick={(e) => this.addItem(e, editor)} data-qa="add-cost">Add a cost</a></td>
        </tr>
      );
    }

    footers.push(
      <tr key={2} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Total costs</td>
        <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={total} /></td>
        <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td>
        {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td> : null}
      </tr>
    );

    footers.push(
      <tr key={3} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Forecast costs</td>
        <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={forecast} /></td>
        <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td>
        {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td> : null}
      </tr>
    );

    if (forecast > 0) {
      footers.push(
        <tr key={4} className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Difference</td>
          <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Percentage value={diff} /></td>
          <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td>
          {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText></td> : null}
        </tr>
      );
    }

    return footers;
  }

  // TODO: Interim solution for monthly claims. Remove once permanent solution in place.
  private isInterimClaim(draftClaim: ClaimDto | null, project: ProjectDto) {
    return !!draftClaim && draftClaim.periodId === project.periodId;
  }

}

const getDestination = (props: EditClaimDetailsParams & BaseProps, goToUpload: boolean|undefined) => {
  if(goToUpload) {
    return props.routes.claimDetailDocuments.getLink({projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId});
  }
  else {
    return props.routes.prepareClaim.getLink({projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId});
  }
};

const EditClaimLineItemsContainer = (props: EditClaimDetailsParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <EditClaimLineItemsComponent
          project={stores.projects.getById(props.projectId)}
          claimDetails={stores.claimDetails.get(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          costCategories={stores.costCategories.getAll()}
          forecastDetail={stores.forecastDetails.get(props.partnerId, props.periodId, props.costCategoryId)}
          documents={stores.claimDetailDocuments.getClaimDetailDocuments(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          editor={stores.claimDetails.getClaimDetailsEditor(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          onUpdate={(saving, dto, goToUpload) => stores.claimDetails.updateClaimDetailsEditor(saving, props.projectId, props.partnerId, props.periodId, props.costCategoryId, dto, () => stores.navigation.navigateTo(getDestination(props, goToUpload)))}
          // TODO Used for interim solution to claim monthly. Can be removed once full solution is in place.
          draftClaim={stores.claims.getDraftClaimForPartner(props.partnerId)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const EditClaimLineItemsRoute = defineRoute({
  routeName: "claimLineItemEdit",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
  container: EditClaimLineItemsContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  accessControl: (auth, params) => auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ params, stores }) => {
    const costCatName =  stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add costs for ${costCatName}` : "Add costs",
      displayTitle: costCatName || "Costs"
    };
  },
});

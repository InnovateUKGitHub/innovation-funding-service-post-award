import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import * as ACC from "../../components";
import { PrepareClaimRoute } from ".";
import { ClaimDetailDocumentsRoute } from "./claimDetailDocuments";
import { IEditorStore } from "../../redux/reducers/editorsReducer";
import { ClaimLineItemDtosValidator, ClaimLineItemDtoValidator } from "../../validators/claimLineItemDtosValidator";
import {DocumentList, ValidationMessage} from "../../components";
import { ProjectDto } from "../../../types";

interface Params {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  lineItems: Pending<ClaimLineItemDto[]>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: IEditorStore<ClaimLineItemDto[], ClaimLineItemDtosValidator>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  lineItems: ClaimLineItemDto[];
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
}

interface Callbacks {
  validate: (partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemDto[]) => void;
  save: (projectId: string, partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemDto[]) => void;
  saveAndUpload: (projectId: string, partnerId: string, costCategoryId: string, periodId: number, dto: ClaimLineItemDto[]) => void;
}

export class EditClaimLineItemsComponent extends ContainerBase<Params, Data, Callbacks> {

  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.lineItems,
      this.props.costCategories,
      this.props.forecastDetail,
      this.props.documents,
      (project, lineItems, costCategories, forecastDetail, documents) => ({ project, lineItems, costCategories, forecastDetail, documents })
    );
    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data, this.props.editor)} />;
  }

  // TODO fix back link
  private renderContents(
    {project, lineItems, costCategories, documents, forecastDetail}: CombinedData,
    editor: IEditorStore<ClaimLineItemDto[], ClaimLineItemDtosValidator>
  ) {
    const back = PrepareClaimRoute.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={back}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.ValidationSummary validation={this.props.editor && this.props.editor.validator} compressed={false} />
        <ACC.Section>
          <ACC.Projects.Title pageTitle={`Claim for ${costCategory.name}`} project={project} />
        </ACC.Section>
        <ACC.Section title="Breakdown of costs">
          <ACC.InsetText text={costCategory.hintText} />
          {this.renderTable(editor, forecastDetail, documents)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderTable(editor: IEditorStore<ClaimLineItemDto[], ClaimLineItemDtosValidator>, forecastDetail: ForecastDetailsDTO, documents: DocumentSummaryDto[]) {
    const LineItemForm = ACC.TypedForm<ClaimLineItemDto[]>();
    const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();

    return (
      <LineItemForm.Form data={editor.data} qa={"current-claim-summary-form"} onChange={x => { /* Todo */ }} onSubmit={() => this.props.save(this.props.projectId, this.props.partnerId, this.props.periodId, this.props.costCategoryId, this.props.editor.data)}>
        <LineItemForm.Fieldset>
          <LineItemTable.Table qa="current-claim-summary-table" data={editor.data} validationResult={editor.validator.items.results} footers={this.renderFooters(editor, forecastDetail)}>
            <LineItemTable.Custom header="Description of cost" qa="cost-description" value={(x, i) => this.renderDescription(x, i, editor.validator.items.results[i.row])} />
            <LineItemTable.Custom header="Cost (£)" qa="cost-value" classSuffix="numeric" value={(x, i) => this.renderCost(x, i, editor.validator.items.results[i.row])} width={30} />
            <LineItemTable.Custom header="" qa="remove" value={(x, i) => <a href="#" onClick={e => this.removeItem(x, i, e)}>remove</a>} width={1} />
          </LineItemTable.Table>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <ACC.Section title="Supporting documents" subtitle={documents.length > 0 ? "(Documents open in a new window)" : ""} qa="supporting-documents-section">
            <ValidationMessage message={"If you are unsure what evidence to provide, speak to your Monitoring Officer. They will use these documents when reviewing your claim."} messageType={"info"} />
            {documents.length > 0 ? <DocumentList documents={documents} qa="supporting-documents" /> : <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-right-2">No documents attached</p>}
          </ACC.Section>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <LineItemForm.Button name="return" onClick={() => this.props.saveAndUpload(this.props.projectId, this.props.partnerId, this.props.costCategoryId, this.props.periodId, this.props.editor.data)}>Upload and remove documents</LineItemForm.Button>
        </LineItemForm.Fieldset>
        <LineItemForm.Submit>Save and return to claim form</LineItemForm.Submit>
      </LineItemForm.Form>
    );
  }

  renderCost(item: ClaimLineItemDto, index: { column: number; row: number; }, validation: ClaimLineItemDtoValidator) {
    return (
      <span>
        <ACC.ValidationError error={validation.cost} />
        <ACC.Inputs.NumberInput name={`value${index.row}`} value={item.value} onChange={val => this.updateItem(index, dto => (dto.value = val!))} />
      </span>
    );
  }

  renderDescription(item: ClaimLineItemDto, index: { column: number; row: number; }, validation: ClaimLineItemDtoValidator) {
    return (
      <span>
        <ACC.ValidationError error={validation.description} />
        <ACC.Inputs.TextInput name="description" value={item.description} onChange={val => this.updateItem(index, dto => (dto.description = val!))} />
      </span>
    );
  }

  removeItem(item: ClaimLineItemDto, i: { column: number; row: number; }, e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const dto = this.props.editor.data;
    dto.splice(i.row, 1);
    this.props.validate(this.props.partnerId, this.props.periodId, this.props.costCategoryId, dto);
  }

  addItem(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const dto = this.props.editor.data;
    dto.push({
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    } as ClaimLineItemDto);
    this.props.validate(this.props.partnerId, this.props.periodId, this.props.costCategoryId, dto);
  }

  updateItem(i: { column: number; row: number; }, update: (item: ClaimLineItemDto) => void) {
    const dto = this.props.editor.data;
    update(dto[i.row]);
    this.props.validate(this.props.partnerId, this.props.periodId, this.props.costCategoryId, dto);
  }

  private renderFooters(editor: IEditorStore<ClaimLineItemDto[], ClaimLineItemDtosValidator>, forecastDetail: ForecastDetailsDTO) {
    const total = editor.data.reduce((t, item) => t + (item.value || 0), 0);
    // TODO remove multiply by 100
    const forecast = forecastDetail.value;
    const diff = 100 * (forecast - total) / forecast;

    return [
      (
        <tr key={1} className="govuk-table__row">
          <td className="govuk-table__cell" colSpan={3}><a href="#" onClick={(e) => this.addItem(e)}>Add a cost</a></td>
        </tr>
      ),
      (
        <tr key={2} className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Total costs</td>
          <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={total} /></td>
          <td className="govuk-table__cell" />
        </tr>
      ),
      (
        <tr key={3} className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Forecast costs</td>
          <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={forecast} /></td>
          <td className="govuk-table__cell" />
        </tr>
      ),
      (
        <tr key={4} className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">Difference</td>
          <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Percentage value={diff} /></td>
          <td className="govuk-table__cell" />
        </tr>
      )
    ];
  }

}

const afterSave = (dispatch: any, projectId: string, partnerId: string, periodId: number) => {
  dispatch(Actions.navigateTo(PrepareClaimRoute.getLink({ projectId, periodId, partnerId })));
};

const redirectToUploadPage = (dispatch: any, projectId: string, partnerId: string, costCategoryId: string, periodId: number) => {
  dispatch(Actions.navigateTo(ClaimDetailDocumentsRoute.getLink({projectId, partnerId, costCategoryId, periodId})));
};

const definition = ReduxContainer.for<Params, Data, Callbacks>(EditClaimLineItemsComponent);

const getEditor: (editor: IEditorStore<ClaimLineItemDto[], ClaimLineItemDtosValidator>, partnerId: string, periodId: number, costCategoryId: string, original: Pending<ClaimLineItemDto[]>) => IEditorStore<ClaimLineItemDto[], ClaimLineItemDtosValidator> = (editor, partnerId, periodId, costCategoryId, original) => {
  if (editor) {
    return editor;
  }

  // default to a double item if empty
  return original
    .then(x => x && x.length ? x : [{costCategoryId, partnerId, periodId}, {costCategoryId, partnerId, periodId}])
    .then(x => {
      const clone = JSON.parse(JSON.stringify(x)) as ClaimLineItemDto[];
      return {
        data: clone,
        validator: new ClaimLineItemDtosValidator(clone, false),
        error: null
      };
    }).data!;
};

export const EditClaimLineItems = definition.connect({
  withData: (state, props) => {
    const lineItemsSelector = Selectors.findClaimLineItemsByPartnerCostCategoryAndPeriod(props.partnerId, props.costCategoryId, props.periodId);
    return {
      project: Selectors.getProject(props.projectId).getPending(state),
      lineItems: lineItemsSelector.getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      forecastDetail: Selectors.getForecastDetail(props.partnerId, props.periodId, props.costCategoryId).getPending(state),
      editor: getEditor(state.editors.claimLineItems[lineItemsSelector.key], props.partnerId, props.periodId, props.costCategoryId, lineItemsSelector.getPending(state)),
      documents: Selectors.getClaimDetailDocuments(props.partnerId, props.periodId, props.costCategoryId).getPending(state)
    };
  },
  withCallbacks: (dispatch) => ({
    validate: (partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemDto[]) => dispatch(Actions.validateClaimLineItems(partnerId, periodId, costCategoryId, dto)),
    save: (projectId: string, partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemDto[]) => dispatch(Actions.saveClaimLineItems(partnerId, periodId, costCategoryId, dto, () => afterSave(dispatch, projectId, partnerId, periodId))),
    saveAndUpload: (projectId: string, partnerId: string, costCategoryId: string, periodId: number, dto: ClaimLineItemDto[]) => dispatch(Actions.saveClaimLineItems(partnerId, periodId, costCategoryId, dto, () => redirectToUploadPage(dispatch, projectId, partnerId, costCategoryId, periodId))),
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
    Actions.loadForecastDetail(params.partnerId, params.periodId, params.costCategoryId),
    Actions.loadClaimLineItemsForCategory(params.partnerId, params.costCategoryId, params.periodId),
    Actions.loadClaimDetailDocuments(params.partnerId, params.periodId, params.costCategoryId)
  ],
  container: EditClaimLineItems
});

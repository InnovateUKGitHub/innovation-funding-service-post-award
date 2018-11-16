import React from "react";
import classNames from "classnames";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import {Pending} from "../../../shared/pending";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {IEditorStore} from "../../redux/reducers/editorsReducer";
import {ClaimsDashboardRoute} from "./dashboard";
import {Currency, DateRange, Percentage} from "../../components/renderers";
import { PrepareClaimRoute } from "./prepare";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { ClaimDto, ProjectDto } from "../../../types";
import * as Colour from "../../styles/colours";
import { ValidationMessage } from "../../components";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  claim: Pending<ClaimDto>;
  claimDetails: Pending<ClaimDetailsDto[]>;
  forecastDetails: Pending<ForecastDetailsDTO[]>;
  golCosts: Pending<GOLCostDto[]>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>>;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  claim: ClaimDto;
  claimDetails: ClaimDetailsDto[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: GOLCostDto[];
  costCategories: CostCategoryDto[];
  editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
}

interface Callbacks {
  saveAndReturn: (updateClaim: boolean, projectId: string, partnerId: string, periodId: number, data: CombinedData) => void;
  onChange: (partnerId: string, periodId: number, data: CombinedData) => void;
}

interface TableRow {
  categoryId: string;
  categoryName: string;
  claims: { [k: string]: number };
  forecasts: { [k: string]: number };
  golCosts: number;
  total: number;
  difference: number;
}

interface Index {
  column: number;
  row: number;
}

export class ClaimForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.partner,
      this.props.claim,
      this.props.claimDetails,
      this.props.forecastDetails,
      this.props.golCosts,
      this.props.costCategories,
      this.props.editor,
      (a, b, c, d, e, f, g, h) => ({ project: a, partner: b, claim: c, claimDetails: d, forecastDetails: e, golCosts: f, costCategories: g, editor: h })
    );

    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={data => this.renderContents(data)} />;
  }

  private saveAndReturn(data: CombinedData) {
    this.props.saveAndReturn(false, this.props.projectId, this.props.partnerId, this.props.periodId, data);
  }

  private submitClaim(data: CombinedData) {
    this.props.saveAndReturn(true, this.props.projectId, this.props.partnerId, this.props.periodId, data);
  }

  private parseClaimData(data: CombinedData) {
    const tableRows: TableRow[] = [];

    data.costCategories.filter(x => x.organistionType === "Industrial").forEach(category => {
      // TODO - remove this logic from here, waiting on SF to provide
      const currentPeriod = data.claim.periodId;
      const row: TableRow = {
        categoryId: category.id,
        categoryName: category.name,
        claims: {},
        forecasts: {},
        golCosts: 0,
        total: 0,
        difference: 0
      };

      data.claimDetails.forEach(x => {
        if(x.costCategoryId === category.id && x.periodId < currentPeriod) {
          row.claims[x.periodId] = x.value;
          row.total += x.value;
        }
      });

      data.editor.data.forEach(x => {
        if(x.costCategoryId === category.id && x.periodId >= currentPeriod) {
          row.forecasts[x.periodId] = x.value;
          row.total += x.value;
        }
      });

      const gol = data.golCosts.find(x => x.costCategoryId === category.id);
      row.golCosts = !!gol ? gol.value : 0;
      row.difference = this.calculateDifference(row.golCosts, row.total);

      tableRows.push(row);
    });

    return tableRows;
  }

  calculateDifference(a: number, b: number) {
    return ((a - b) / Math.max(1, a)) * 100;
  }

  calculateClaimPeriods(data: CombinedData) {
    const periods: { [k: string]: React.ReactNode } = {};
    data.claimDetails.forEach(x => periods[x.periodId] = this.renderDateRange(x));
    data.forecastDetails.forEach(x => periods[x.periodId] = this.renderDateRange(x));
    return periods;
  }

  renderDateRange(details: ClaimDetailsDto | ForecastDetailsDTO) {
    return DateRange({ start: details.periodStart, end: details.periodEnd });
  }

  public renderContents(data: CombinedData) {
    const parsed    = this.parseClaimData(data);
    const Table     = ACC.TypedTable<typeof parsed[0]>();
    const Form      = ACC.TypedForm<ForecastDetailsDTO[]>();
    const intervals = this.calculateClaimPeriods(data);
    const claims    = Object.keys(parsed[0].claims);
    const forecasts = Object.keys(parsed[0].forecasts);
    const periods   = claims.concat(forecasts);

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={PrepareClaimRoute.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.ValidationSummary validation={data.editor.validator} compressed={false} />
        {this.renderWarnings(data.editor.validator, parsed)}
        <ACC.Projects.Title pageTitle="Claim" project={data.project} />
        <ACC.Section title={"Update forecasts table for " + data.partner.name} qa="partner-name">
          <Form.Form
            data={data.editor.data}
            qa={"claim-forecast-form"}
            onSubmit={() => this.submitClaim(data)}
          >
            <Table.Table
              data={parsed}
              qa="cost-category-table"
              headers={this.renderTableHeaders(periods, data.claim)}
              footers={this.renderTableFooters(periods, parsed, data.editor.validator)}
              headerRowClass="govuk-body-s"
              bodyRowClass={x => classNames("govuk-body-s", {"table__row--warning": x.total > x.golCosts})}
            >
              <Table.String header="Month" value={x => x.categoryName} qa="category-name" />

              {claims.map((p, i) => <Table.Currency key={p} header={intervals[p]} value={x => x.claims[p]} qa={"category-claim" + i} isDivider={i === claims.length - 1 || i === claims.length - 2} />)}
              {forecasts.map((p, i) => <Table.Custom key={p} header={intervals[p]} value={(x, index) => this.renderForecastCell(x, p, index, data)} qa={"category-forecast" + i}  isDivider={i === forecasts.length - 1} />)}

              <Table.Currency header="" value={x => x.total} qa="category-total" isDivider={true} />
              <Table.Currency header="" value={x => x.golCosts} qa="category-gol-costs" isDivider={true} />
              <Table.Percentage header="" value={x => x.difference} qa="category-difference" />
            </Table.Table>
            <Form.Fieldset>
              <Form.Submit>Submit claim and forecast changes</Form.Submit>
              <ACC.Renderers.SimpleString>Changes last saved:
                <ACC.Renderers.ShortDateTime value={data.claim.forecastLastModified} />
              </ACC.Renderers.SimpleString>
            </Form.Fieldset>
            <Form.Fieldset>
              <Form.Button name="save" onClick={() => this.saveAndReturn(data)}>Save and return to claim</Form.Button>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  renderWarnings(validator: ForecastDetailsDtosValidator, data: TableRow[]) {
    const categories = data.filter(x => x.total > x.golCosts).map(x => x.categoryName);
    return validator.showValidationErrors && !validator.isValid && categories.length > 0
      ? <ValidationMessage messageType="info" message={`The total of forecasts and costs for ${categories.join(", ")} exceeds the grant offer letter costs. The Monitoring Officer may require more information in order to approve the claim.`} />
      : null;
  }

  renderForecastCell(forecastRow: TableRow, period: string, index: Index, data: CombinedData) {
    return (
      <span>
        <ACC.ValidationError error={data.editor.validator.items.results[index.row].id} />
        <ACC.Inputs.NumberInput
          name={"value" + index.row + index.column}
          value={forecastRow.forecasts[period]}
          onChange={val => this.updateItem(data, forecastRow.categoryId, period, dto => dto.value = val!)}
          className="govuk-!-font-size-16"
        />
      </span>
    );
  }

  updateItem(data: CombinedData, categoryId: string, period: string, update: (item: ForecastDetailsDTO) => void) {
    const item = data.editor.data.find(x => x.costCategoryId === categoryId && x.periodId === parseInt(period, 10));

    if(!!item) {
      update(item);
    }

    this.props.onChange(this.props.partnerId, this.props.periodId, data);
  }

  renderTableHeaders(periods: string[], claim: ClaimDto) {
    const currentClaimPeriod = claim.periodId - 1;
    const previous = currentClaimPeriod - 1;

    return [(
      <tr key="cHeader1" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header govuk-table__header--numeric" />
        {previous > 0 ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={previous}>Previous costs</th> : null}
        {currentClaimPeriod > 0 ? <th className="govuk-table__header govuk-table__header--numeric">Current claim period costs</th> : null}
        <th className="govuk-table__header govuk-table__header--numeric" colSpan={periods.length - currentClaimPeriod}>Forecasts</th>
        <th className="govuk-table__header govuk-table__header--numeric">Forecasts and costs total</th>
        <th className="govuk-table__header govuk-table__header--numeric">Grant offer letter costs</th>
        <th className="govuk-table__header govuk-table__header--numeric">Difference</th>
      </tr>
    ),
    (
      <tr key="cHeader2" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header">Period</th>
        {periods.map((p, i) => <th key={i} className="govuk-table__header" style={{textAlign: "right"}}>{"P" + p}</th>)}
        <th className="govuk-table__header" />
        <th className="govuk-table__header" />
        <th className="govuk-table__header" />
      </tr>
    )];
  }

  renderTableFooters(periods: string[], parsed: TableRow[], validator: ForecastDetailsDtosValidator) {
    const cells          = [];
    const costTotal      = parsed.reduce((total, item) => total + item.total, 0);
    const golTotal       = parsed.reduce((total, item) => total + item.golCosts, 0);
    const totals = periods.map(p => parsed.reduce((total, item) => {
      const claim = item.claims[p];
      const value = isNaN(claim) ? item.forecasts[p] : claim;
      return total + value;
    }, 0));

    const isValid = validator.isValid || !validator.showValidationErrors;

    totals.push(costTotal);
    totals.push(golTotal);

    cells.push(<th key="th" className="govuk-table__cell govuk-!-font-weight-bold">Total</th>);
    cells.push(totals.map(this.renderTableFooterCell));
    cells.push(<td key="total_diff" className="govuk-table__cell govuk-table__cell--numeric"><Percentage className="govuk-!-font-weight-bold" value={this.calculateDifference(golTotal, costTotal)} /></td>);

    return [<tr key="footer1" className={classNames("govuk-table__row", "govuk-body-s", {"table__row--warning": !isValid})}>{cells}</tr>];
  }

  renderTableFooterCell = (total: number, key: number) => (
    <td key={key} className="govuk-table__cell govuk-table__cell--numeric">
      <Currency className="govuk-!-font-weight-bold" value={total} />
    </td>
  )
}

const updateRedirect = (updateClaim: boolean, dispatch: any, projectId: string, partnerId: string, periodId: number) => {
  const redirect = updateClaim ? redirectSave : goBack;
  redirect(dispatch, projectId, partnerId, periodId);
};

const redirectSave = (dispatch: any, projectId: string, partnerId: string) => {
  dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({projectId, partnerId})));
};

const goBack = (dispatch: any, projectId: string, partnerId: string, periodId: number) => {
  dispatch(Actions.navigateTo(PrepareClaimRoute.getLink({projectId, partnerId, periodId})));
};

const definition = ReduxContainer.for<Params, Data, Callbacks>(ClaimForecastComponent);

export const ForecastClaim = definition.connect({
  withData: (state, props) => {
    const claimSelector = Selectors.getClaim(props.partnerId, props.periodId);
    return {
      claim: claimSelector.getPending(state),
      project: Selectors.getProject(props.projectId).getPending(state),
      partner: Selectors.getPartner(props.partnerId).getPending(state),
      claimDetails: Selectors.findClaimDetailsByPartner(props.partnerId).getPending(state),
      forecastDetails: Selectors.findForecastDetailsByPartner(props.partnerId, props.periodId).getPending(state),
      golCosts: Selectors.findGolCostsByPartner(props.partnerId).getPending(state),
      costCategories: Selectors.getCostCategories().getPending(state),
      editor: Selectors.getForecastDetailsEditor(props.partnerId, props.periodId).get(state)
    };
  },
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, data) => dispatch(Actions.validateForecastDetails(partnerId, periodId, data.editor.data, data.claimDetails, data.golCosts, data.costCategories)),
    saveAndReturn: (updateClaim, projectId, partnerId, periodId, data) => dispatch(Actions.saveForecastDetails(updateClaim, partnerId, periodId, data.editor.data, data.claimDetails, data.golCosts, data.costCategories, () => updateRedirect(updateClaim, dispatch, projectId, partnerId, periodId)))
  })
});

export const ClaimForecastRoute = definition.route({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
  getLoadDataActions: ({ projectId, partnerId, periodId }) => [
    Actions.loadProject(projectId),
    Actions.loadPartner(partnerId),
    Actions.loadClaim(partnerId, periodId),
    Actions.loadClaimDetailsForPartner(partnerId),
    Actions.loadForecastDetailsForPartner(partnerId, periodId),
    Actions.loadForecastGOLCostsForPartner(partnerId),
    Actions.loadCostCategories(),
  ],
  container: ForecastClaim
});

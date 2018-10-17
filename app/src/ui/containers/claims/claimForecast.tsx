import React from "react";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import {Pending} from "../../../shared/pending";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {routeConfig} from "../../routing";
import {IEditorStore} from "../../redux/reducers/editorsReducer";
import {ClaimDtoValidator} from "../../validators/claimDtoValidator";
import {ClaimsDashboardRoute} from "./dashboard";
import {Currency, DateRange, Percentage} from "../../components/renderers";
import {ClaimDetailsDto, ClaimDto, ForecastDetailsDTO} from "../../models";
import { Interval } from "luxon";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  partner: Pending<Dtos.PartnerDto>;
  claim: Pending<Dtos.ClaimDto>;
  claimDetails: Pending<Dtos.ClaimDetailsDto[]>;
  forecastDetails: Pending<Dtos.ForecastDetailsDTO[]>;
  golCosts: Pending<Dtos.GOLCostDto[]>;
  costCategories: Pending<Dtos.CostCategoryDto[]>;
  editor: Pending<IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  claim: Dtos.ClaimDto;
  claimDetails: Dtos.ClaimDetailsDto[];
  forecastDetails: Dtos.ForecastDetailsDTO[];
  golCosts: Dtos.GOLCostDto[];
  costCategories: Dtos.CostCategoryDto[];
  editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface Callbacks {
  saveAndReturn: (projectId: string, partnerId: string, periodId: number, dto: ClaimDto) => void;
  onChange: (partnerId: string, periodId: number, dto: ClaimDto) => void;
}

interface TableRow {
  categoryName: string;
  periods: { [k: string]: number };
  golCosts: number;
  total: number;
  difference: number;
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

  private onChange(dto: ClaimDto) {
    this.props.onChange(this.props.partnerId, this.props.periodId, dto);
  }

  private saveAndReturn(dto: ClaimDto) {
    this.props.saveAndReturn(this.props.projectId, this.props.partnerId, this.props.periodId, dto);
  }

  private parseClaimData(data: CombinedData) {
    const tableRows: TableRow[] = [];

    data.costCategories.filter(x => x.organistionType === "Industrial").forEach(category => {
      const currentPeriod = data.claim.periodId;
      const row: TableRow = {
        categoryName: category.name,
        periods: {},
        golCosts: 0,
        total: 0,
        difference: 0
      };

      for(let i = data.claim.periodId - 1; i > 0; i--) {
        row.periods[i] = 0;
      }

      data.claimDetails.forEach(x => {
        if(x.costCategoryId === category.id && x.periodId < currentPeriod) {
          row.periods[x.periodId] = x.value;
          row.total += x.value;
        }
      });

      data.forecastDetails.forEach(x => {
        if(x.costCategoryId === category.id && x.periodId >= currentPeriod) {
          row.periods[x.periodId] = x.value;
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
    return Math.ceil(((a - b) / Math.max(1, a)) * 100);
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

  periodHeader(period: Interval) {
    const words  = [period.start.monthShort, "to", period.end.monthShort, period.end.year];

    if(period.start.year !== period.end.year) {
      words.splice(1, 0, period.start.year);
    }

    return words.join(" ");
  }

  public renderContents(data: CombinedData) {
    const parsed    = this.parseClaimData(data);
    const Table     = ACC.TypedTable<typeof parsed[0]>();
    const Form      = ACC.TypedForm<Dtos.ClaimDto>();
    const intervals = this.calculateClaimPeriods(data);
    const periods   = Object.keys(parsed[0].periods);

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={routeConfig.prepareClaim.getLink({ projectId: this.props.projectId, partnerId: this.props.partnerId, periodId: this.props.periodId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="Claim" project={data.project} />
        <ACC.Section>
          <Form.Form data={data.editor.data} qa={"claim-forecast-form"} onChange={(dto) => this.onChange(dto)} onSubmit={() => this.saveAndReturn(data.editor.data)}>
            <Table.Table data={parsed}
              qa="cost-category-table"
              headers={this.renderTableHeaders(periods, data.claim)}
              footers={this.renderTableFooters(periods, parsed)}
            >
              <Table.String header="Month" value={x => x.categoryName} qa="category-name" />
              {periods.map(p => <Table.Currency key={p} header={intervals[p]} value={x => x.periods[p]} qa="category-period" />)}
              <Table.Currency header="" value={x => x.total} qa="category-total" />
              <Table.Currency header="" value={x => x.golCosts} qa="category-gol-costs" />
              <Table.Percentage header="" value={x => x.difference} qa="category-difference" />
            </Table.Table>
            <Form.Fieldset>
              <Form.Submit>Submit claim and forecast changes</Form.Submit>
            </Form.Fieldset>
          </Form.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  renderTableHeaders(periods: string[], claim: ClaimDto) {
    const currentClaimPeriod = claim.periodId - 1;
    const previous = currentClaimPeriod - 1;

    return [(
      <tr key="cHeader1" className="govuk-table__row">
        <th className="govuk-table__header" />
        {previous > 0 ? <th className="govuk-table__header" colSpan={previous}>Previous Costs</th> : null}
        {currentClaimPeriod > 1 ? <th className="govuk-table__header">Current claim period costs</th> : null}
        <th className="govuk-table__header" colSpan={periods.length - currentClaimPeriod}>Forecasts</th>
        <th className="govuk-table__header">Forecasts and costs total</th>
        <th className="govuk-table__header">Grant offer letter costs</th>
        <th className="govuk-table__header">Difference</th>
      </tr>
    ),
    (
      <tr key="cHeader2" className="govuk-table__row">
        <th className="govuk-table__header">Period</th>
        {periods.map((p, i) => <th key={i} className="govuk-table__header" style={{textAlign: "right"}}>{"P" + p}</th>)}
        <th className="govuk-table__header" colSpan={3} />
      </tr>
    )];
  }

  renderTableFooters(periods: string[], parsed: TableRow[]) {
    const cells     = [];
    const totals    = periods.map(p => parsed.reduce((total, item) => total + item.periods[p], 0));
    const costTotal = parsed.reduce((total, item) => total + item.total, 0);
    const golTotal  = parsed.reduce((total, item) => total + item.golCosts, 0);
    totals.push(costTotal);
    totals.push(golTotal);

    cells.push(<th key="th" className="govuk-table__cell govuk-!-font-weight-bold">Total</th>);
    cells.push(totals.map(this.renderTableFooterCell));
    cells.push(<td key="total_diff" className="govuk-table__cell govuk-table__cell--numeric"><Percentage className="govuk-!-font-weight-bold" value={this.calculateDifference(golTotal, costTotal)} /></td>);

    return [<tr key="footer1" className="govuk-table__row">{cells}</tr>];
  }

  renderTableFooterCell = (total: number, key: number) => (
    <td key={key} className="govuk-table__cell govuk-table__cell--numeric">
      <Currency className="govuk-!-font-weight-bold" value={total} />
    </td>
  )
}
const goBack = (dispatch: any, projectId: string, partnerId: string) => {
  dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({projectId, partnerId})));
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
      editor: Selectors.getClaimEditor(props.partnerId, props.periodId).get(state, x => {x.status = "Submitted";})
    };
  },
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto) => dispatch(Actions.validateClaim(partnerId, periodId, dto, [], [])),
    saveAndReturn: (projectId, partnerId, periodId, dto) => dispatch(Actions.saveClaim(partnerId, periodId, dto, [], [], () => goBack(dispatch, projectId, partnerId)))
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

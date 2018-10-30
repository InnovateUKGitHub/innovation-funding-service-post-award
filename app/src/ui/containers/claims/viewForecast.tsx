import React from "react";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "../../../shared/pending";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Currency, DateRange, Percentage } from "../../components/renderers";
import { ClaimDetailsDto, ClaimDto, ForecastDetailsDTO } from "../../models";
<<<<<<< HEAD
import { Interval } from "luxon";
import { ProjectOverviewPage } from "../../components/projectOverview";
=======
import { PrepareClaimRoute } from "./prepare";
>>>>>>> develop

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
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  claim: Dtos.ClaimDto;
  claimDetails: Dtos.ClaimDetailsDto[];
  forecastDetails: Dtos.ForecastDetailsDTO[];
  golCosts: Dtos.GOLCostDto[];
  costCategories: Dtos.CostCategoryDto[];
}

interface Callbacks { }

interface TableRow {
  categoryName: string;
  periods: { [k: string]: number };
  golCosts: number;
  total: number;
  difference: number;
}

export class ViewForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.partner,
      this.props.claim,
      this.props.claimDetails,
      this.props.forecastDetails,
      this.props.golCosts,
      this.props.costCategories,
      (a, b, c, d, e, f, g) => ({ project: a, partner: b, claim: c, claimDetails: d, forecastDetails: e, golCosts: f, costCategories: g })
    );

    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={data => this.renderContents(data)} />;
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

      for (let i = data.claim.periodId - 1; i > 0; i--) {
        row.periods[i] = 0;
      }

      data.claimDetails.forEach(x => {
        if (x.costCategoryId === category.id && x.periodId < currentPeriod) {
          row.periods[x.periodId] = x.value;
          row.total += x.value;
        }
      });

      data.forecastDetails.forEach(x => {
        if (x.costCategoryId === category.id && x.periodId >= currentPeriod) {
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
    return Math.round((((a - b) / Math.max(1, a)) * 100) * 10) / 10;
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
    const parsed = this.parseClaimData(data);
    const Table = ACC.TypedTable<typeof parsed[0]>();
    const intervals = this.calculateClaimPeriods(data);
    const periods = Object.keys(parsed[0].periods);

    return (
      <ProjectOverviewPage selectedTab={ViewForecastRoute.routeName} project={data.project} partners={[data.partner]}>
        <ACC.Section title={data.partner.name} qa={"partner-name"}/>
          <ACC.Section>
            <Table.Table
              data={parsed}
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
          </ACC.Section>
    </ProjectOverviewPage>
    );
  }

  renderTableHeaders(periods: string[], claim: ClaimDto) {
    const currentClaimPeriod = this.props.periodId - 1;
    const previous = currentClaimPeriod - 1;
    const forecasts = periods.length > currentClaimPeriod;

    return [(
      <tr key="cHeader1" className="govuk-table__row">
        <th className="govuk-table__header" />
        {previous > 0 ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={previous}>Previous costs</th> : null}
        {currentClaimPeriod > 0 ? <th className="govuk-table__header govuk-table__header--numeric">Current claim period costs</th> : null}
        {forecasts ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={periods.length - currentClaimPeriod}>Forecasts</th> : null}
        <th className="govuk-table__header govuk-table__header--numeric">Forecasts and costs total</th>
        <th className="govuk-table__header govuk-table__header--numeric">Grant offer letter costs</th>
        <th className="govuk-table__header govuk-table__header--numeric">Difference</th>
      </tr>
    ),
    (
      <tr key="cHeader2" className="govuk-table__row">
        <th className="govuk-table__header">Period</th>
        {periods.map((p, i) => <th key={i} className="govuk-table__header" style={{ textAlign: "right" }}>{"P" + p}</th>)}
        <th className="govuk-table__header" colSpan={3} />
      </tr>
    )];
  }

  renderTableFooters(periods: string[], parsed: TableRow[]) {
    const cells = [];
    const totals = periods.map(p => parsed.reduce((total, item) => total + item.periods[p], 0));
    const costTotal = parsed.reduce((total, item) => total + item.total, 0);
    const golTotal = parsed.reduce((total, item) => total + item.golCosts, 0);
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
const definition = ReduxContainer.for<Params, Data, Callbacks>(ViewForecastComponent);

export const ViewForecast = definition.connect({
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
    };
  },
  withCallbacks: () => ({})
});

export const ViewForecastRoute = definition.route({
  routeName: "viewForecast",
  routePath: "/projects/:projectId/claims/:partnerId/viewForecast/:periodId",
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
  container: ViewForecast
});

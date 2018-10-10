import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import {Pending} from "../../../shared/pending";
import * as Dtos from "../../models";
import {routeConfig} from "../../routing";
import {IEditorStore} from "../../redux/reducers/editorsReducer";
import {ClaimDtoValidator} from "../../validators/claimDtoValidator";
import {ClaimsDashboardRoute} from "./dashboard";
import {Currency} from "../../components/renderers";
import {ClaimDto} from "../../models";

interface Params {
  projectId: string;
  partnerId: string;
  periodId: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  claim: Pending<Dtos.ClaimDto>;
  partner: Pending<Dtos.PartnerDto>;
  claimDetails: Pending<Dtos.ClaimDetailsDto[]>;
  forecastDetails: Pending<Dtos.ForecastDetailsDTO[]>;
  golCosts: Pending<Dtos.GOLCostDto[]>;
  costCategories: Pending<Dtos.CostCategoryDto[]>;
  editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>;
}

interface CombinedData {
  project: Dtos.ProjectDto;
  partner: Dtos.PartnerDto;
  claim: Dtos.ClaimDto;
  claimDetails: Dtos.ClaimDetailsDto[];
  costCategories: Dtos.CostCategoryDto[];
  forecastDetails: Dtos.ForecastDetailsDTO[];
  golCosts: Dtos.GOLCostDto[];
}

interface TableRow {
  categoryName: string;
  periods: { [k: string]: number };
  golCosts: number;
  total: number;
  difference: number;
}

interface Callbacks {
  saveAndReturn: (dto: Dtos.ClaimDto, projectId: string, partnerId: string, periodId: number) => void;
  onChange: (partnerId: string, periodId: number, dto: Dtos.ClaimDto) => void;
}

export class ClaimForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  public render() {
    const combined = Pending.combine(
      this.props.project,
      this.props.partner,
      this.props.claim,
      this.props.claimDetails,
      this.props.forecastDetails,
      this.props.costCategories,
      this.props.golCosts,
      (a, b, c, d, e, f, g) => ({ project: a, partner: b, claim: c, claimDetails: d, forecastDetails: e, costCategories: f, golCosts: g })
    );

    const Loader = ACC.TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private saveAndReturn() {
    this.props.saveAndReturn(this.props.editor.data, this.props.projectId, this.props.partnerId, this.props.periodId);
  }

  private parseClaimData(data: CombinedData) {
    const tabular: TableRow[] = [];

    data.costCategories.forEach(category => {
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
      row.difference = Math.ceil(((row.golCosts - row.total) / row.golCosts) * 100);

      tabular.push(row);
    });

    return tabular;
  }

  public renderContents(data: CombinedData) {
    const project = data.project;
    const partner = data.partner;
    const parsed  = this.parseClaimData(data);
    const periods = Object.keys(parsed[0].periods);
    const totals  = periods.map(p => parsed.reduce((total, item) => total + item.periods[p], 0));
    const Table   = ACC.Table.forData(parsed);
    const Form    = ACC.TypedForm<Dtos.ClaimDto>();

    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={routeConfig.prepareClaim.getLink({ projectId: project.id, partnerId: partner.id, periodId: this.props.periodId })}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="Claim" project={project} />
        <ACC.Section>
          <Form.Form data={this.props.editor.data} onChange={(dto) => this.props.onChange(this.props.partnerId, this.props.periodId, dto)} onSubmit={() => this.saveAndReturn()}>
            <Table.Table
              qa="cost-category-table"
              headers={this.renderTableHeaders(periods, data.claim)}
              footers={this.renderTableFooters(totals)}
            >
              <Table.String header="Month" value={x => x.categoryName} qa="category-name" />
              {periods.map(p => <Table.Currency key={p} header={""} value={x => x.periods[p]} qa="category-period" />)}
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

  renderTableFooters(totals: number[]) {
    return [this.renderTableFooterRow(1, "Total", totals.map(this.renderTableFooterCell))];
  }

  renderTableFooterRow = (key: number, title: string, value: React.ReactNode) => (
    <tr key={key} className="govuk-table__row">
      <th className="govuk-table__cell govuk-!-font-weight-bold">{title}</th>
      {value}
    </tr>
  )

  renderTableFooterCell = (total: number) => (
    <td className="govuk-table__cell govuk-table__cell--numeric">
      <Currency className="govuk-!-font-weight-bold" value={total} />
    </td>
  )
}

// TODO extract shared function?
const getEditor = (editor: IEditorStore<Dtos.ClaimDto, ClaimDtoValidator>, original: Pending<Dtos.ClaimDto>) => {
  if (editor) {
    return editor;
  }
  return original.then(x => {
    const clone = JSON.parse(JSON.stringify(x!)) as Dtos.ClaimDto;
    const updatedClaimDto = { ...clone, status: "Submitted" };
    return {
      data: updatedClaimDto,
      validator: new ClaimDtoValidator(x!, false),
      error: null
    };
  }).data!;
};

const goBack = (dispatch: any, projectId: string, partnerId: string) => {
  dispatch(Actions.navigateTo(ClaimsDashboardRoute.getLink({projectId, partnerId})));
};

const definition = ReduxContainer.for<Params, Data, Callbacks>(ClaimForecastComponent);

export const ForecastClaim = definition.connect({
  withData: (state, props) => {
    const claimSelector = Selectors.getClaim(props.partnerId, props.periodId);
    return {
      project: Selectors.getProject(props.projectId).getPending(state),
      claim: claimSelector.getPending(state),
      partner: Selectors.getPartner(props.partnerId).getPending(state),
      editor: getEditor(state.editors.claim[claimSelector.key], claimSelector.getPending(state)),

      claimDetails: Pending.create(state.data.claimDetails[props.partnerId]),
      forecastDetails: Pending.create(state.data.forecastDetails[props.partnerId + "_" + props.periodId]),
      golCosts: Pending.create(state.data.forecastGolCosts[props.partnerId]),
      costCategories: Pending.create(state.data.costCategories.all),
    };
  },
  withCallbacks: (dispatch) => ({
    onChange: (partnerId, periodId, dto) => dispatch(Actions.validateClaim(partnerId, periodId, dto)),
    saveAndReturn: (dto, projectId, partnerId, periodId) => dispatch(Actions.saveClaim(partnerId, periodId, dto, () => goBack(dispatch, projectId, partnerId)))
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

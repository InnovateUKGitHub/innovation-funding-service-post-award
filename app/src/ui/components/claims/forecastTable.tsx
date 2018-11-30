import React from "react";
import classNames from "classnames";
import * as ACC from "../../components";
import { Currency, DateRange, Percentage } from "../../components/renderers";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { ClaimDto } from "../../../types";
import { IEditorStore } from "../../redux";
import { ForecastData } from "../../containers/claims/forecasts/common";

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

interface Props {
  hideValidation?: boolean;
  data: ForecastData;
  onChange?: (data: ForecastDetailsDTO[]) => void;
}

export class ForecastTable extends React.Component<Props> {
  public render() {
    const { data, hideValidation } = this.props;

    const parsed    = this.parseClaimData(data);
    const Table     = ACC.TypedTable<typeof parsed[0]>();
    const intervals = this.calculateClaimPeriods(data);
    const claims    = Object.keys(parsed[0].claims);
    const forecasts = Object.keys(parsed[0].forecasts);
    const periods   = claims.concat(forecasts);

    return (
      <Table.Table
        data={parsed}
        qa="forecast-table"
        headers={this.renderTableHeaders(periods, data.claim)}
        footers={this.renderTableFooters(periods, parsed, data.editor)}
        headerRowClass="govuk-body-s"
        bodyRowClass={x => classNames("govuk-body-s", {"table__row--warning": !hideValidation && (x.total > x.golCosts)})}
      >
        <Table.String header="Month" value={x => x.categoryName} qa="category-name" />

        {claims.map((p, i) => <Table.Currency key={p} header={intervals[p]} value={x => x.claims[p]} qa={"category-claim" + i} isDivider={i === claims.length - 1 || i === claims.length - 2} />)}
        {forecasts.map((p, i) => <Table.Custom key={p} header={intervals[p]} value={(x, index) => this.renderForecastCell(x, p, index, data)} cellClassName={() => "govuk-table__cell--numeric"} classSuffix="numeric" qa={"category-forecast" + i} isDivider={i === forecasts.length - 1} />)}

        <Table.Currency header="" value={x => x.total} qa="category-total" isDivider={true} />
        <Table.Currency header="" value={x => x.golCosts} qa="category-gol-costs" isDivider={true} />
        <Table.Percentage header="" value={x => x.difference} qa="category-difference" />
      </Table.Table>
    );
  }

  private parseClaimData(data: ForecastData) {
    const tableRows: TableRow[] = [];
    // TODO - remove this logic from here, waiting on SF to provide
    const currentPeriod = data.claim.periodId;
    const forecasts = !!data.editor ? data.editor.data : data.forecastDetails;

    data.costCategories.filter(x => x.organistionType === "Industrial").forEach(category => {
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

      forecasts.forEach(x => {
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

  private calculateClaimPeriods(data: ForecastData) {
    const periods: { [k: string]: React.ReactNode } = {};
    data.claimDetails.forEach(x => periods[x.periodId] = this.renderDateRange(x));
    data.forecastDetails.forEach(x => periods[x.periodId] = this.renderDateRange(x));
    return periods;
  }

  private renderDateRange(details: ClaimDetailsDto | ForecastDetailsDTO) {
    return DateRange({ start: details.periodStart, end: details.periodEnd });
  }

  renderForecastCell(forecastRow: TableRow, period: string, index: Index, data: ForecastData) {
    const editor = data.editor;
    const value  = forecastRow.forecasts[period];

    return !editor ? (
      <Currency value={value} />
    ) : (
      <span>
        <ACC.ValidationError error={editor.validator.items.results[index.row].id} />
        <ACC.Inputs.NumberInput
          name={"value" + index.row + index.column}
          value={value}
          onChange={val => this.updateItem(editor.data, forecastRow.categoryId, period, dto => dto.value = val!)}
          className="govuk-!-font-size-16"
        />
      </span>
    );
  }

  updateItem(data: ForecastDetailsDTO[], categoryId: string, period: string, update: (item: ForecastDetailsDTO) => void) {
    const item = data.find(x => x.costCategoryId === categoryId && x.periodId === parseInt(period, 10));

    if(!!item) {
      update(item);
    }

    if(!!this.props.onChange) {
      this.props.onChange(data);
    }
  }

  renderTableHeaders(periods: string[], claim: ClaimDto) {
    const currentClaimPeriod = claim.periodId - 1;
    const previous = currentClaimPeriod - 1;
    const forecasts = periods.length > currentClaimPeriod;

    return [(
      <tr key="cHeader1" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header govuk-table__header--numeric" />
        {previous > 0 ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={previous}>Previous costs</th> : null}
        {currentClaimPeriod > 0 ? <th className="govuk-table__header govuk-table__header--numeric">Current claim period costs</th> : null}
        {forecasts ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={periods.length - currentClaimPeriod}>Forecasts</th> : null}
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

  renderTableFooters(periods: string[], parsed: TableRow[], editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>) {
    const cells     = [];
    const costTotal = parsed.reduce((total, item) => total + item.total, 0);
    const golTotal  = parsed.reduce((total, item) => total + item.golCosts, 0);
    const totals = periods.map(p => parsed.reduce((total, item) => {
      const claim = item.claims[p];
      const value = isNaN(claim) ? item.forecasts[p] : claim;
      return total + value;
    }, 0));

    const validator = !this.props.hideValidation && !!editor ? editor.validator : false;
    const warning   = !!validator && validator.showValidationErrors && !validator.isValid;
    totals.push(costTotal);
    totals.push(golTotal);

    cells.push(<th key="th" className="govuk-table__cell govuk-!-font-weight-bold">Total</th>);
    cells.push(totals.map(this.renderTableFooterCell));
    cells.push(<td key="total_diff" className="govuk-table__cell govuk-table__cell--numeric"><Percentage className="govuk-!-font-weight-bold" value={this.calculateDifference(golTotal, costTotal)} /></td>);

    return [<tr key="footer1" className={classNames("govuk-table__row", "govuk-body-s", {"table__row--warning": warning})}>{cells}</tr>];
  }

  renderTableFooterCell = (total: number, key: number) => (
    <td key={key} className="govuk-table__cell govuk-table__cell--numeric">
      <Currency className="govuk-!-font-weight-bold" value={total} />
    </td>
  )
}

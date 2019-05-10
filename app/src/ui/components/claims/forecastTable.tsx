import React from "react";
import classNames from "classnames";
import * as ACC from "@ui/components";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { ForecastDetailsDtosValidator, ForecastDetailsDtoValidator } from "@ui/validators";
import { ForecastData } from "@ui/containers/claims/forecasts/common";

interface TableRow {
  categoryId: string;
  categoryName: string;
  claims: { [k: string]: number };
  forecasts: { [k: string]: number };
  golCosts: number;
  total: number;
  difference: number;
  validators: ForecastDetailsDtoValidator[];
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
    // if there is no claim then we must be in period 1 ie, claim period 0
    const periodId  = !!data.claim ? Math.min(data.project.periodId, data.claim.periodId) : 0;
    const parsed    = this.parseClaimData(data, periodId);
    const Table     = ACC.TypedTable<typeof parsed[0]>();
    const intervals = this.calculateClaimPeriods(data);
    const claims    = Object.keys(parsed[0].claims);
    const forecasts = Object.keys(parsed[0].forecasts);
    const periods   = claims.concat(forecasts);

    return (
      <Table.Table
        data={parsed}
        qa="forecast-table"
        headers={this.renderTableHeaders(periods, periodId)}
        footers={this.renderTableFooters(periods, parsed, data.editor)}
        headerRowClass="govuk-body-s govuk-table__header--light"
        bodyRowClass={x => classNames("govuk-body-s", {
          "table__row--warning": !hideValidation && x.total > x.golCosts,
          "table__row--error": !hideValidation && x.validators.some(v => !v.isValid)
        })}
      >
        <Table.String header="Month" value={x => x.categoryName} qa="category-name" />

        {claims.map((p, i) => <Table.Currency
          key={p}
          header={intervals[p]}
          value={x => x.claims[p]}
          qa={"category-claim" + i}
          isDivider={i === claims.length - 1 || i === claims.length - 2 ? "normal" : undefined}
        />)}

        {forecasts.map((p, i) => <Table.Custom
          key={p}
          header={intervals[p]}
          value={(x, index) => this.renderForecastCell(x, p, index, data)}
          cellClassName={() => "govuk-table__cell--numeric"}
          classSuffix="numeric"
          qa={"category-forecast" + i}
          isDivider={i === forecasts.length - 1 ? "bold" : undefined}
        />)}

        <Table.Currency header="No data" hideHeader={true} value={x => x.total} qa="category-total" isDivider="normal" />
        <Table.Currency header="No data" hideHeader={true} value={x => x.golCosts} qa="category-gol-costs" isDivider="normal" />
        <Table.Percentage header="No data" hideHeader={true} value={x => x.difference} qa="category-difference" />
      </Table.Table>
    );
  }

  private parseClaimData(data: ForecastData, periodId: number) {
    const tableRows: TableRow[] = [];
    const forecasts = !!data.editor ? data.editor.data : data.forecastDetails;

    data.costCategories
      .filter(x => x.competitionType === data.project.competitionType && x.organisationType === data.partner.organisationType)
      .forEach(category => {
        const validators = data.editor && data.editor.validator.items.results
          .filter(x => x.model.costCategoryId === category.id)
          .sort((a, b) => a.model.periodId - b.model.periodId);

        const row: TableRow = {
          categoryId: category.id,
          categoryName: category.name,
          claims: {},
          forecasts: {},
          golCosts: 0,
          total: 0,
          difference: 0,
          validators: validators || []
        };

        data.claimDetails.forEach(x => {
          if (x.costCategoryId === category.id && x.periodId <= periodId) {
            row.claims[x.periodId] = x.value;
            row.total += x.value;
          }
        });

        forecasts.forEach(x => {
          if (x.costCategoryId === category.id && x.periodId > periodId) {
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

  private renderDateRange(details: ClaimDetailsSummaryDto | ForecastDetailsDTO) {
    return ACC.Renderers.CondensedDateRange({ start: details.periodStart, end: details.periodEnd });
  }

  renderForecastCell(forecastRow: TableRow, period: string, index: Index, data: ForecastData) {
    const editor = data.editor;
    const value  = forecastRow.forecasts[period];
    const costCategory = data.costCategories.find(x => x.id === forecastRow.categoryId);
    const validator = forecastRow.validators[index.column - 1];
    const error = validator && validator.value;

    if ((costCategory && costCategory.isCalculated) || !editor || parseInt(period, 10) <= data.project.periodId) {
      return <ACC.Renderers.Currency value={value} />;
    }

    return (
      <span>
        <ACC.Inputs.NumberInput
          id={error && !error.isValid ? error.key : ""}
          name={`value_${period}_${forecastRow.categoryId}`}
          value={value}
          ariaLabel={`${forecastRow.categoryName} Period ${period}`}
          onChange={val => this.updateItem(editor.data, forecastRow.categoryId, period, dto => dto.value = val!)}
          className="govuk-!-font-size-16"
          disabled={editor.status === EditorStatus.Saving}
        />
      </span>
    );
  }

  updateItem(data: ForecastDetailsDTO[], categoryId: string, period: string, update: (item: ForecastDetailsDTO) => void) {
    const item = data.find(x => x.costCategoryId === categoryId && x.periodId === parseInt(period, 10));

    if(!!item) {
      update(item);
      const updatedCategory = this.props.data.costCategories.find(x => x.id === categoryId);
      const overheadRate = this.props.data.partner.overheadRate;

      if(updatedCategory && updatedCategory.name === "Labour" && overheadRate) {
        const overheadsCategory = this.props.data.costCategories
          .filter(x => x.competitionType === this.props.data.project.competitionType && x.organisationType === this.props.data.partner.organisationType)
          .find(x => x.isCalculated);

        const categoryToUpdate = overheadsCategory && data.find(x => x.costCategoryId === overheadsCategory.id && x.periodId === item.periodId);
        if(categoryToUpdate) {
          categoryToUpdate.value = item.value * overheadRate/100;
        }
      }
    }

    if(!!this.props.onChange) {
      this.props.onChange(data);
    }
  }

  renderTableHeaders(periods: string[], claimPeriod: number) {
    const previous = claimPeriod - 1;
    const forecasts = periods.length > claimPeriod;

    return [(
      <tr key="cHeader1" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header govuk-table__header--numeric">
          <ACC.Renderers.AccessibilityText>Cost categories</ACC.Renderers.AccessibilityText>
        </th>
        {previous > 0 ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={previous}>Previous costs</th> : null}
        {claimPeriod > 0 ? <th className="govuk-table__header govuk-table__header--numeric">Costs this period</th> : null}
        {forecasts ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={periods.length - claimPeriod}>Forecast</th> : null}
        <th className="govuk-table__header govuk-table__header--numeric">Total</th>
        <th className="govuk-table__header govuk-table__header--numeric">Total eligible costs</th>
        <th className="govuk-table__header govuk-table__header--numeric">Difference</th>
      </tr>
    ),
    (
      <tr key="cHeader2" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header">Period</th>
        {periods.map((p, i) => <th key={i} className="govuk-table__header" style={{textAlign: "right"}}>{p}</th>)}
        <th className="govuk-table__header">
          <ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText>
        </th>
        <th className="govuk-table__header">
          <ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText>
        </th>
        <th className="govuk-table__header">
          <ACC.Renderers.AccessibilityText>No data</ACC.Renderers.AccessibilityText>
        </th>
      </tr>
    )];
  }

  renderTableFooters(periods: string[], parsed: TableRow[], editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>) {
    const cells     = [];
    const costTotal = parsed.reduce((total, item) => total + item.total, 0);
    const golTotal  = parsed.reduce((total, item) => total + item.golCosts, 0);
    const totals = periods.map(p => parsed.reduce((total, item) => {
      const claim = item.claims[p];
      const value = (isNaN(claim) ? item.forecasts[p] : claim) || 0;
      return total + value;
    }, 0));

    const validator = !this.props.hideValidation && !!editor ? editor.validator : false;
    const warning   = !!validator && validator.showValidationErrors && !validator.totalCosts.isValid;
    const warningId = !!validator && warning ? validator.totalCosts.key : "";

    totals.push(costTotal);
    totals.push(golTotal);

    cells.push(<th key="th" className="govuk-table__cell govuk-!-font-weight-bold acc-table__cell-top-border">Total</th>);
    cells.push(totals.map(this.renderTableFooterCell));
    cells.push((
      <td key="total_diff" className="govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border govuk-!-font-weight-regular">
        <ACC.Renderers.Percentage value={this.calculateDifference(golTotal, costTotal)} />
      </td>
    ));

    return [<tr id={warningId} key="footer1" className={classNames("govuk-table__row", "govuk-body-s", {"table__row--error": warning})}>{cells}</tr>];
  }

  renderTableFooterCell = (total: number, key: number) => (
    <td key={key} className="govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border govuk-!-font-weight-regular">
      <ACC.Renderers.Currency value={total} />
    </td>
  )
}

import React from "react";
import classNames from "classnames";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { ForecastDetailsDtosValidator, ForecastDetailsDtoValidator } from "@ui/validators";
import { ForecastData } from "@ui/containers/claims/forecasts/common";
import { TypedTable } from "../table";
import { CondensedDateRange } from "../renderers/date";
import { Currency } from "../renderers/currency";
import { NumberInput } from "../inputs/numberInput";
import { AccessibilityText } from "../renderers/accessibilityText";
import { Percentage } from "../renderers/percentage";

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
  editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
  onChange?: (data: ForecastDetailsDTO[]) => void;
  isSubmitting?: boolean;
}

export class ForecastTable extends React.Component<Props> {
  componentDidMount() {
    // hack into next event cycle as react is too fast for dom
    setTimeout(() => {
      const col1 = document.getElementsByClassName("sticky-col-right-1");
      const col2 = document.getElementsByClassName("sticky-col-right-2");
      const col3 = document.getElementsByClassName("sticky-col-right-3");

      if (!col1.length || !col2.length) return;

      const width1 = col1[0].getBoundingClientRect().width;
      const width2 = col2[0].getBoundingClientRect().width;

      Array.from(col2).forEach((x: any) => x.style.right = `${width1}px`);
      Array.from(col3).forEach((x: any) => x.style.right = `${width1 + width2}px`);
    });
  }

  public render() {
    const { data, hideValidation, isSubmitting, editor } = this.props;
    // if there is no claim then we must be in period 1 ie, claim period 0
    const periodId = !!data.claim ? Math.min(data.project.periodId, data.claim.periodId) : 0;
    const parsed = this.parseClaimData(data, editor, periodId, data.project.totalPeriods);
    const Table = TypedTable<typeof parsed[0]>();
    const intervals = this.calculateClaimPeriods(data);
    const claims = Object.keys(parsed[0].claims);
    const forecasts = Object.keys(parsed[0].forecasts);
    const periods = claims.concat(forecasts);

    return (
      <Table.Table
        data={parsed}
        qa="forecast-table"
        headers={this.renderTableHeaders(periods, periodId)}
        footers={this.renderTableFooters(periods, parsed, this.props.hideValidation !== true && editor ? editor.validator: undefined)}
        headerRowClass="govuk-body-s govuk-table__header--light"
        bodyRowClass={x => classNames("govuk-body-s", {
          "table__row--warning": !hideValidation && x.total > x.golCosts,
          "table__row--error": !hideValidation && x.validators.some(v => !v.isValid)
        })}
      >
        <Table.String header="Month" value={x => x.categoryName} colClassName={() => "sticky-col sticky-col-left-1"} qa="category-name" />

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
          value={(x, index) => this.renderForecastCell(x, parseInt(p, 10), index, data, editor, isSubmitting || false)}
          cellClassName={() => "govuk-table__cell--numeric"}
          classSuffix="numeric"
          qa={"category-forecast" + i}
          isDivider={i === forecasts.length - 1 ? "bold" : undefined}
        />)}

        <Table.Currency colClassName={() => "sticky-col sticky-col-right-3"} header="No data" hideHeader={true} value={x => x.total} qa="category-total" isDivider="normal" />
        <Table.Currency colClassName={() => "sticky-col sticky-col-right-2"} header="No data" hideHeader={true} value={x => x.golCosts} qa="category-gol-costs" isDivider="normal" />
        <Table.Percentage colClassName={() => "sticky-col sticky-col-right-1"} header="No data" hideHeader={true} value={x => x.difference} qa="category-difference" />
      </Table.Table>
    );
  }

  private parseClaimData(data: ForecastData, editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>|undefined, periodId: number, totalPeriods: number | null) {
    const tableRows: TableRow[] = [];
    const forecasts = !!editor ? editor.data : data.forecastDetails;
    const costCategories = data.costCategories.filter(x => x.competitionType === data.project.competitionType && x.organisationType === data.partner.organisationType);

    costCategories.forEach(category => {
      const validators = editor && editor.validator.items.results
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

      let currentPeriodId = 1;

      while (currentPeriodId <= periodId) {
        this.addClaimDetailInfoToRow(currentPeriodId, category, data.claimDetails, row);
        currentPeriodId++;
      }

      if (totalPeriods) {
        while (currentPeriodId <= totalPeriods) {
          this.addForecastInfoToRow(currentPeriodId, category, forecasts, row);
          currentPeriodId++;
        }
      }

      const gol = data.golCosts.find(x => x.costCategoryId === category.id);
      row.golCosts = !!gol ? gol.value : 0;
      row.difference = this.calculateDifference(row.golCosts, row.total);

      tableRows.push(row);
    });

    return tableRows;
  }

  private addClaimDetailInfoToRow(periodId: number, costCategory: CostCategoryDto, claimDetails: ClaimDetailsSummaryDto[], row: TableRow) {
    const detail = claimDetails.find(x => x.costCategoryId === costCategory.id && x.periodId === periodId);
    if (detail) {
      row.claims[periodId] = detail.value;
      row.total += detail.value;
    }
    else {
      row.claims[periodId] = 0;
    }
  }

  private addForecastInfoToRow(periodId: number, costCategory: CostCategoryDto, forecasts: ForecastDetailsDTO[], row: TableRow) {
    const forecast = forecasts.find(x => x.costCategoryId === costCategory.id && x.periodId === periodId);
    if (forecast) {
      row.forecasts[periodId] = forecast.value;
      row.total += forecast.value;
    }
    else {
      row.forecasts[periodId] = 0;
    }
  }

  private calculateDifference(a: number, b: number) {
    return ((a - b) / Math.max(1, a)) * 100;
  }

  private calculateClaimPeriods(data: ForecastData) {
    const periods: { [k: string]: React.ReactNode } = {};
    data.claimDetails.forEach(x => periods[x.periodId] = this.renderDateRange(x));
    data.forecastDetails.forEach(x => periods[x.periodId] = this.renderDateRange(x));
    return periods;
  }

  private renderDateRange(details: ClaimDetailsSummaryDto | ForecastDetailsDTO) {
    return <CondensedDateRange start={details.periodStart} end={details.periodEnd}/>;
  }

  private renderForecastCell(forecastRow: TableRow, periodId: number, index: Index, data: ForecastData, editor: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>|undefined, isSubmitting: boolean) {
    const value = forecastRow.forecasts[periodId];
    const costCategory = data.costCategories.find(x => x.id === forecastRow.categoryId);
    const validator = forecastRow.validators[index.column - 1];
    const error = validator && validator.value;

    if ((costCategory && costCategory.isCalculated) || !editor || periodId < data.project.periodId || (periodId === data.project.periodId && !isSubmitting)) {
      return <Currency value={value} />;
    }

    return (
      <span>
        <NumberInput
          id={error && !error.isValid ? error.key : ""}
          name={`value_${periodId}_${forecastRow.categoryId}`}
          value={value}
          ariaLabel={`${forecastRow.categoryName} Period ${periodId}`}
          onChange={val => this.updateItem(editor.data, forecastRow.categoryId, periodId, dto => dto.value = val!)}
          className="govuk-!-font-size-16"
          disabled={editor.status === EditorStatus.Saving}
        />
      </span>
    );
  }

  private updateItem(data: ForecastDetailsDTO[], categoryId: string, periodId: number, update: (item: ForecastDetailsDTO) => void) {
    const item = data.find(x => x.costCategoryId === categoryId && x.periodId === periodId);

    if (!!item) {
      update(item);
      const updatedCategory = this.props.data.costCategories.find(x => x.id === categoryId);
      const overheadRate = this.props.data.partner.overheadRate;

      if (updatedCategory && updatedCategory.name === "Labour" && overheadRate) {
        const overheadsCategory = this.props.data.costCategories
          .filter(x => x.competitionType === this.props.data.project.competitionType && x.organisationType === this.props.data.partner.organisationType)
          .find(x => x.isCalculated);

        const categoryToUpdate = overheadsCategory && data.find(x => x.costCategoryId === overheadsCategory.id && x.periodId === item.periodId);
        if (categoryToUpdate) {
          categoryToUpdate.value = item.value * overheadRate / 100;
        }
      }
    }

    if (!!this.props.onChange) {
      this.props.onChange(data);
    }
  }

  private renderTableHeaders(periods: string[], claimPeriod: number) {
    const previous = claimPeriod - 1;
    const forecasts = periods.length > claimPeriod;

    return [(
      <tr key="cHeader1" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-left-1">
          <AccessibilityText>Cost categories</AccessibilityText>
        </th>
        {previous > 0 ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={previous}>Costs claimed</th> : null}
        {claimPeriod > 0 ? <th className="govuk-table__header govuk-table__header--numeric">Costs you are claiming</th> : null}
        {forecasts ? <th className="govuk-table__header govuk-table__header--numeric" colSpan={periods.length - claimPeriod}>Forecast</th> : null}
        <th className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-right-3">Total</th>
        <th className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-right-2">Total eligible costs</th>
        <th className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-right-1">Difference</th>
      </tr>
    ),
    (
      <tr key="cHeader2" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header sticky-col sticky-col-left-1">Period</th>
        {periods.map((p, i) => <th key={i} className="govuk-table__header" style={{ textAlign: "right" }}>{p}</th>)}
        <th className="govuk-table__header sticky-col sticky-col-right-3">
          <AccessibilityText>No data</AccessibilityText>
        </th>
        <th className="govuk-table__header sticky-col sticky-col-right-2">
          <AccessibilityText>No data</AccessibilityText>
        </th>
        <th className="govuk-table__header sticky-col sticky-col-right-1">
          <AccessibilityText>No data</AccessibilityText>
        </th>
      </tr>
    )];
  }

  private renderTableFooters(periods: string[], parsed: TableRow[], validator: ForecastDetailsDtosValidator|undefined) {
    const cells = [];
    const costTotal = parsed.reduce((total, item) => total + item.total, 0);
    const golTotal = parsed.reduce((total, item) => total + item.golCosts, 0);
    const totals = periods.map(p => parsed.reduce((total, item) => {
      const claim = item.claims[p];
      const value = (isNaN(claim) ? item.forecasts[p] : claim) || 0;
      return total + value;
    }, 0));

    const warning = !!validator && validator.showValidationErrors && !validator.totalCosts.isValid;
    const warningId = !!validator && warning ? validator.totalCosts.key : "";

    cells.push(<th key="th" className="govuk-table__cell govuk-!-font-weight-bold acc-table__cell-top-border sticky-col sticky-col-left-1">Total</th>);
    cells.push(totals.map((value, index) => this.renderTableFooterCell(value, index)));
    cells.push(this.renderTableFooterCell(costTotal, totals.length + 1, "sticky-col sticky-col-right-3"));
    cells.push(this.renderTableFooterCell(golTotal, totals.length + 2, "sticky-col sticky-col-right-2"));
    cells.push((
      <td key="total_diff" className="govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border govuk-!-font-weight-regular sticky-col sticky-col-right-1">
        <Percentage value={this.calculateDifference(golTotal, costTotal)} />
      </td>
    ));

    return [<tr id={warningId} key="footer1" className={classNames("govuk-table__row", "govuk-body-s", { "table__row--error": warning })}>{cells}</tr>];
  }

  private renderTableFooterCell = (total: number, key: number, className?: string) => (
    <td key={key} className={`govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border govuk-!-font-weight-regular ${className}`}>
      <Currency value={total} />
    </td>
  )
}

import { CostCategoryType } from "@framework/constants/enums";
import { PartnerStatus } from "@framework/constants/partner";
import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { numberComparator } from "@framework/util/comparator";
import { diffAsPercentage, roundCurrency, roundCurrencyDown } from "@framework/util/numberHelper";
import { EditorStatus } from "@ui/constants/enums";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import {
  IForecastDetailsDtosValidator,
  IForecastDetailsDtoValidator,
} from "@ui/validators/forecastDetailsDtosValidator";
import { default as classNames, default as cx } from "classnames";
import React from "react";
import { Content } from "../content";
import { NumberInput } from "../inputs/numberInput";
import { AccessibilityText } from "../renderers/accessibilityText";
import { Currency } from "../renderers/currency";
import { CondensedDateRange } from "../renderers/date";
import { Percentage } from "../renderers/percentage";
import { createTypedTable } from "../table";

export interface ForecastData {
  project: ProjectDto;
  partner: PartnerDto;
  claim: ClaimDto | null;
  claims: ClaimDto[];
  IARDueOnClaimPeriods?: string[];
  claimDetails: ClaimDetailsSummaryDto[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: GOLCostDto[];
  costCategories: CostCategoryDto[];
}

export interface ForecastDataForTableLayout {
  project: Pick<ProjectDto, "periodId" | "numberOfPeriods" | "competitionType">;
  partner: Pick<PartnerDto, "name" | "organisationType" | "partnerStatus" | "overheadRate">;
  claim: Pick<ClaimDto, "periodId"> | null;
  claims: Pick<ClaimDto, "isApproved" | "periodId">[];
  IARDueOnClaimPeriods?: string[];
  claimDetails: Pick<ClaimDetailsSummaryDto, "costCategoryId" | "periodId" | "value" | "periodEnd" | "periodStart">[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: Pick<GOLCostDto, "costCategoryId" | "value">[];
  costCategories: Pick<
    CostCategoryDto,
    "id" | "competitionType" | "name" | "isCalculated" | "organisationType" | "type"
  >[];
}

interface TableRow {
  categoryId: string;
  categoryName: string;
  claims: { [k: string]: number };
  forecasts: { [k: string]: number };
  golCosts: number;
  total: number;
  difference: number;
  validators: IForecastDetailsDtoValidator[];
}

interface Index {
  column: number;
  row: number;
}

interface Props {
  hideValidation?: boolean;
  data: ForecastDataForTableLayout;
  editor?: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator>;
  onChange?: (data: ForecastDetailsDTO[]) => void;
  isSubmitting?: boolean;
  allowRetroactiveForecastEdit?: boolean;
}

const Table = createTypedTable<TableRow>();

export class ForecastTable extends React.Component<Props> {
  animationFrame?: number;

  // Keep track of how many times we have animated after an event.
  animationFrameCount = 0;

  constructor(props: Props) {
    super(props);
    this.requestAnimate = this.requestAnimate.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    // Resize the table when the page loads or when the user clicks/resizes the page.
    this.requestAnimate();
    window.addEventListener("click", this.requestAnimate);
    window.addEventListener("resize", this.requestAnimate);
  }

  componentDidUpdate(): void {
    this.requestAnimate();
  }

  componentWillUnmount() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("click", this.requestAnimate);
    window.removeEventListener("resize", this.requestAnimate);
  }

  requestAnimate() {
    this.animationFrameCount = 0;
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  animate() {
    const table = document.querySelector(".acc-sticky-table") as HTMLTableElement | null;
    const scrollPane = document.querySelector(".acc-sticky-table-scrollable") as HTMLDivElement | null;
    const classNames = [
      {
        selector: ".sticky-col-left-1",
        side: "left",
      },
      {
        selector: ".sticky-col-right-1",
        side: "right",
      },
      {
        selector: ".sticky-col-right-2",
        side: "right",
      },
      {
        selector: ".sticky-col-right-3",
        side: "right",
      },
    ] as const;

    if (table && scrollPane) {
      table.style.whiteSpace = "normal";

      const accumulator = {
        left: 0,
        right: 0,
      };

      const rowElements = [...scrollPane.querySelectorAll("tr")];

      for (const { selector, side } of classNames) {
        const columnElements = [...scrollPane.querySelectorAll(selector)] as HTMLTableCellElement[];
        for (const col of columnElements) {
          col.classList.add("disable-sticky-col-width");
        }

        let maxWidth = 0;

        for (const col of columnElements) {
          const { width } = col.getBoundingClientRect();
          if (width > maxWidth) maxWidth = width;
        }

        for (const col of columnElements) {
          col.classList.remove("disable-sticky-col-width");
          col.style[side] = `${accumulator[side]}px`;
          col.style.width = `${maxWidth}px`;
        }

        accumulator[side] += maxWidth;
      }

      for (const row of rowElements) {
        const cells = [...row.querySelectorAll("th, td")] as HTMLTableCellElement[];

        for (const cell of cells) {
          cell.style.height = `unset`;
        }

        let maxHeight = 0;

        for (const cell of cells) {
          const { height } = cell.getBoundingClientRect();
          if (height > maxHeight) maxHeight = height;
        }

        for (const cell of cells) {
          cell.style.height = `${maxHeight}px`;
        }
      }

      scrollPane.style.marginLeft = `${accumulator.left}px`;
      scrollPane.style.marginRight = `${accumulator.right}px`;
    }

    // If we have animated less than 30 times after an event, such as a resize/click event,
    // draw the next frame too, just in case.
    this.animationFrameCount++;
    if (this.animationFrameCount < 30) {
      this.animationFrame = requestAnimationFrame(this.animate);
    }
  }

  private getPeriodId(
    project: Pick<ProjectDto, "periodId">,
    claims: Pick<ClaimDto, "periodId" | "isApproved">[],
    draftClaim: Pick<ClaimDto, "periodId"> | null,
  ) {
    // If there is a draft claim in progress then return the smallest of the claim period and the project period
    if (draftClaim) return Math.min(project.periodId, draftClaim.periodId);
    // Sort a copy of the claims array so the original array is not affected
    const approvedClaims = [...claims]
      .filter(x => x.isApproved)
      .sort((a, b) => numberComparator(b.periodId, a.periodId));
    // If there are no approved claims then we must be in period 1 ie, claim period 0
    if (approvedClaims.length === 0) return 0;
    // If there are previously approved claims then return most recent
    return approvedClaims[0].periodId;
  }

  public render() {
    const { data, hideValidation, isSubmitting, editor } = this.props;

    const periodId = this.getPeriodId(data.project, data.claims, data.claim);
    const intervals = this.calculateClaimPeriods(data);
    const tableRows = this.parseClaimData(data, editor, periodId, data.project.numberOfPeriods);
    const isEditing = !!editor;

    if (!tableRows.length) {
      throw new Error("Unable to display the spend profile table, has the project been correctly set up?");
    }

    const firstRow = tableRows[0];

    const claims = Object.keys(firstRow.claims);
    const forecasts = Object.keys(firstRow.forecasts);
    const periods = claims.concat(forecasts);

    const isDivider = (i: number) => {
      // always show a divider on the right hand side of the last claim
      if (i === claims.length - 1) {
        return true;
      }
      // only show a divider on the right hand side of the second to last claim if the last claim is in "currently claiming"
      return !!data.claim && i === claims.length - 2;
    };

    return (
      <div className="acc-sticky-table-container">
        <div className="acc-sticky-table-scrollable">
          <Table.Table
            data={tableRows}
            qa="forecast-table"
            headers={this.renderTableHeaders(periods, periodId, data.claim, data.IARDueOnClaimPeriods ?? [])}
            footers={this.renderTableFooters(
              periods,
              periodId,
              tableRows,
              hideValidation !== true && editor ? editor.validator : undefined,
            )}
            headerRowClass="govuk-body-s govuk-table__header--light"
            bodyRowClass={x =>
              classNames("govuk-body-s", {
                "table__row--warning": !hideValidation && x.total > x.golCosts,
                "table__row--error": !hideValidation && x.validators.some(v => !v.isValid),
              })
            }
            className="acc-sticky-table"
            validationResult={!hideValidation ? editor && editor.validator.costCategoryForecasts.results : undefined}
          >
            <Table.String
              header="Month"
              value={x => x.categoryName}
              colClassName={() => "sticky-col sticky-col-left-1"}
              qa="category-name"
              cellClassName={() =>
                cx({
                  "sticky-data-editor": isEditing,
                })
              }
            />

            {claims.map((p, i) => (
              <Table.Currency
                key={p}
                header={intervals[p]}
                value={x => x.claims[p]}
                qa={!!data.claim && i === claims.length - 1 ? "current-claim" : "category-claim" + i}
                isDivider={isDivider(i) ? "normal" : undefined}
                cellClassName={() =>
                  cx({
                    "sticky-data-editor": isEditing,
                  })
                }
              />
            ))}

            {forecasts.map((p, i) => (
              <Table.Custom
                key={p}
                header={intervals[p]}
                value={(x, index) =>
                  this.renderForecastCell(
                    x,
                    parseInt(p, 10),
                    index,
                    data,
                    editor,
                    isSubmitting || false,
                    this.props.allowRetroactiveForecastEdit ?? false,
                  )
                }
                cellClassName={() =>
                  cx("govuk-table__cell--numeric", {
                    "sticky-data-editor": isEditing,
                  })
                }
                classSuffix="numeric"
                qa={"category-forecast" + i}
                // isDivider={i === forecasts.length - 1 ? "bold" : undefined}
              />
            ))}

            <Table.Currency
              colClassName={() => "sticky-col sticky-col-right-3"}
              header="No data"
              hideHeader
              value={x => x.total}
              qa="category-total"
              isDivider="normal"
              cellClassName={() =>
                cx({
                  "sticky-data-editor": isEditing,
                })
              }
            />
            <Table.Currency
              colClassName={() => "sticky-col sticky-col-right-2"}
              header="No data"
              hideHeader
              value={x => x.golCosts}
              qa="category-gol-costs"
              isDivider="normal"
              cellClassName={() =>
                cx({
                  "sticky-data-editor": isEditing,
                })
              }
            />
            <Table.Percentage
              colClassName={() => "sticky-col sticky-col-right-1"}
              header="No data"
              hideHeader
              value={x => x.difference}
              qa="category-difference"
              cellClassName={() =>
                cx({
                  "sticky-data-editor": isEditing,
                })
              }
            />
          </Table.Table>
        </div>
      </div>
    );
  }

  private parseClaimData(
    data: ForecastDataForTableLayout,
    editor: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator> | undefined,
    periodId: number,
    numberOfPeriods: number | null,
  ) {
    const tableRows: TableRow[] = [];
    const forecasts = editor ? editor.data : data.forecastDetails;
    const costCategories = data.costCategories.filter(
      x => x.competitionType === data.project.competitionType && x.organisationType === data.partner.organisationType,
    );

    costCategories.forEach(category => {
      const validators =
        editor &&
        editor.validator.items.results
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
        validators: validators || [],
      };

      let currentPeriodId = 1;

      while (currentPeriodId <= periodId) {
        this.addClaimDetailInfoToRow(currentPeriodId, category, data.claimDetails, row);
        currentPeriodId++;
      }

      if (numberOfPeriods) {
        while (currentPeriodId <= numberOfPeriods) {
          this.addForecastInfoToRow(currentPeriodId, category, forecasts, row);
          currentPeriodId++;
        }
      }

      const gol = data.golCosts.find(x => x.costCategoryId === category.id);
      row.golCosts = gol ? gol.value : 0;
      row.difference = diffAsPercentage(row.golCosts, row.total);

      tableRows.push(row);
    });

    return tableRows;
  }

  private addClaimDetailInfoToRow(
    periodId: number,
    costCategory: Pick<CostCategoryDto, "id">,
    claimDetails: Pick<ClaimDetailsSummaryDto, "costCategoryId" | "periodId" | "value">[],
    row: TableRow,
  ) {
    const detail = claimDetails.find(x => x.costCategoryId === costCategory.id && x.periodId === periodId);
    if (detail) {
      row.claims[periodId] = detail.value;
      row.total = roundCurrency(row.total + detail.value);
    } else {
      row.claims[periodId] = 0;
    }
  }

  private addForecastInfoToRow(
    periodId: number,
    costCategory: Pick<CostCategoryDto, "id">,
    forecasts: Pick<ForecastDetailsDTO, "value" | "costCategoryId" | "periodId">[],
    row: TableRow,
  ) {
    const forecast = forecasts.find(x => x.costCategoryId === costCategory.id && x.periodId === periodId);
    if (forecast) {
      row.forecasts[periodId] = forecast.value;
      row.total = roundCurrency(row.total + forecast.value);
    } else {
      row.forecasts[periodId] = 0;
    }
  }

  private calculateClaimPeriods(data: ForecastDataForTableLayout) {
    const periods: { [k: string]: React.ReactElement<typeof CondensedDateRange> } = {};
    data.claimDetails.forEach(x => (periods[x.periodId] = this.renderDateRange(x)));
    data.forecastDetails.forEach(x => (periods[x.periodId] = this.renderDateRange(x)));
    return periods;
  }

  private renderDateRange(details: Pick<ClaimDetailsSummaryDto | ForecastDetailsDTO, "periodEnd" | "periodStart">) {
    return <CondensedDateRange start={details.periodStart} end={details.periodEnd} />;
  }

  private renderForecastCell(
    forecastRow: TableRow,
    periodId: number,
    index: Index,
    data: ForecastDataForTableLayout,
    editor: IEditorStore<ForecastDetailsDTO[], IForecastDetailsDtosValidator> | undefined,
    isSubmitting: boolean,
    allowRetroactiveForecastEdit?: boolean,
  ) {
    const value = roundCurrencyDown(forecastRow.forecasts[periodId]);
    const costCategory = data.costCategories.find(x => x.id === forecastRow.categoryId);
    const validator = forecastRow.validators.find(x => x.model.periodId === periodId);
    const error = validator && validator.value;
    const isPending = data.partner.partnerStatus === PartnerStatus.Pending;

    if (
      (costCategory && costCategory.isCalculated) ||
      !editor ||
      (periodId < data.project.periodId && !isPending && !allowRetroactiveForecastEdit) ||
      (periodId === data.project.periodId && !isPending && !isSubmitting && !allowRetroactiveForecastEdit)
    ) {
      return <Currency value={value} />;
    }

    return (
      <span>
        <NumberInput
          invalid={!!error && !error?.isValid}
          name={`value_${periodId}_${forecastRow.categoryId}`}
          value={value}
          ariaLabel={`${forecastRow.categoryName} Period ${periodId}`}
          onChange={val =>
            this.updateItem(editor.data, forecastRow.categoryId, periodId, dto => (dto.value = val as number))
          }
          className="govuk-!-font-size-16"
          disabled={editor.status === EditorStatus.Saving}
          enforceValidInput
        />
      </span>
    );
  }

  private updateItem(
    data: ForecastDetailsDTO[],
    categoryId: string,
    periodId: number,
    update: (item: ForecastDetailsDTO) => void,
  ) {
    const cell = data.find(x => x.costCategoryId === categoryId && x.periodId === periodId);

    if (cell) {
      const { partner, project, costCategories } = this.props.data;

      update(cell);

      const overheadRates = getOverheadRate(partner, project, costCategories, cell, data);

      if (overheadRates && overheadRates.overheadsData && overheadRates.labourCategory && partner.overheadRate) {
        const updatedValue = roundCurrencyDown(
          calculateOverheadCell(
            partner.overheadRate,
            overheadRates.labourCategory.id,
            overheadRates.overheadsData.value,
            cell,
          ),
        );

        overheadRates.overheadsData.value = updatedValue;
      }
    }

    if (this.props.onChange) {
      this.props.onChange(data);
    }
  }

  private renderTableHeaders(
    periods: string[],
    claimPeriod: number,
    claim: Pick<ClaimDto, "periodId"> | null,
    periodsWithIARDue: string[],
  ) {
    // If there is a draft claim then show "Costs you are claiming"
    // If there isn't a draft claim then don't show "Costs you are claiming" and "Costs claimed" applies to all claims
    const previous = claim ? claimPeriod - 1 : claimPeriod;
    const forecasts = periods.length > claimPeriod;
    const costsClaimedText = <Content value={x => x.components.forecastTable.costsClaimedHeader} />;
    const costsClaimingText = <Content value={x => x.components.forecastTable.costsClaimingHeader} />;
    const forecastText = <Content value={x => x.components.forecastTable.forecastHeader} />;
    const totalText = <Content value={x => x.components.forecastTable.totalHeader} />;
    const totalEligibleCostsText = <Content value={x => x.components.forecastTable.totalEligibleCostsHeader} />;
    const differenceText = <Content value={x => x.components.forecastTable.differenceHeader} />;
    const periodText = <Content value={x => x.components.forecastTable.periodHeader} />;
    const iarDueText = <Content value={x => x.components.forecastTable.iarDueHeader} />;
    const noDataText = <Content value={x => x.components.table.noDataText} />;
    const costCategoriesText = <Content value={x => x.components.forecastTable.costCategoriesHeader} />;

    return [
      <tr key="cHeader1" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-left-1">
          <AccessibilityText>{costCategoriesText}</AccessibilityText>
        </th>
        {previous > 0 ? (
          <th
            className="govuk-table__header govuk-table__header--numeric acc-table__cell-right-border"
            data-qa="costs-claimed"
            colSpan={previous}
          >
            {costsClaimedText}
          </th>
        ) : null}
        {!!claim && claimPeriod > 0 ? (
          <th
            className="govuk-table__header govuk-table__header--numeric acc-table__cell-right-border"
            data-qa="costs-claiming"
          >
            {costsClaimingText}
          </th>
        ) : null}
        {forecasts ? (
          <th
            className="govuk-table__header govuk-table__header--numeric"
            data-qa="forecast-header"
            colSpan={periods.length - claimPeriod}
          >
            {forecastText}
          </th>
        ) : null}
        <th
          className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-right-3 acc-table__cell-right-border"
          data-qa="total-header"
        >
          {totalText}
        </th>
        <th
          className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-right-2 acc-table__cell-right-border"
          data-qa="total-eligible-cost"
        >
          {totalEligibleCostsText}
        </th>
        <th className="govuk-table__header govuk-table__header--numeric sticky-col sticky-col-right-1">
          {differenceText}
        </th>
      </tr>,
      <tr key="cHeader2" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header sticky-col sticky-col-left-1">{periodText}</th>
        {periods.map((p, i) => (
          <th
            key={i}
            className={cx("govuk-table__header", {
              "acc-table__cell-right-border": i === claimPeriod - 2 || i === claimPeriod - 1,
            })}
            style={{ textAlign: "right" }}
          >
            {p}
          </th>
        ))}
        <th className="govuk-table__header sticky-col sticky-col-right-3 acc-table__cell-right-border">
          <AccessibilityText>{noDataText}</AccessibilityText>
        </th>
        <th className="govuk-table__header sticky-col sticky-col-right-2 acc-table__cell-right-border">
          <AccessibilityText>{noDataText}</AccessibilityText>
        </th>
        <th className="govuk-table__header sticky-col sticky-col-right-1">
          <AccessibilityText>{noDataText}</AccessibilityText>
        </th>
      </tr>,
      <tr key="cHeader3" className="govuk-table__row govuk-body-s">
        <th className="govuk-table__header sticky-col sticky-col-left-1">{iarDueText}</th>
        {periods.map((p, i) => (
          <th
            key={i}
            className={cx("govuk-table__header", {
              "acc-table__cell-right-border": i === claimPeriod - 2 || i === claimPeriod - 1,
            })}
            style={{ textAlign: "right" }}
          >
            {periodsWithIARDue?.includes(p) ? "Yes" : "No"}
          </th>
        ))}
        <th className="govuk-table__header sticky-col sticky-col-right-3 acc-table__cell-right-border">
          <AccessibilityText>{noDataText}</AccessibilityText>
        </th>
        <th className="govuk-table__header sticky-col sticky-col-right-2 acc-table__cell-right-border">
          <AccessibilityText>{noDataText}</AccessibilityText>
        </th>
        <th className="govuk-table__header sticky-col sticky-col-right-1">
          <AccessibilityText>{noDataText}</AccessibilityText>
        </th>
      </tr>,
    ];
  }

  private renderTableFooters(
    periods: string[],
    claimPeriod: number,
    parsed: TableRow[],
    validator: IForecastDetailsDtosValidator | undefined,
  ) {
    const cells = [];
    const costTotal = parsed.reduce((total, item) => total + item.total, 0);
    const golTotal = parsed.reduce((total, item) => total + item.golCosts, 0);
    const totals = periods.map(p =>
      parsed.reduce((total, item) => {
        const claim = item.claims[p];
        const value = (isNaN(claim) ? item.forecasts[p] : claim) || 0;
        return total + value;
      }, 0),
    );

    const warning = !!validator && validator.showValidationErrors && !validator.totalCosts.isValid;
    const warningId = !!validator && warning ? validator.totalCosts.key : "";

    cells.push(
      <th
        key="th"
        className="govuk-table__cell govuk-!-font-weight-bold acc-table__cell-top-border sticky-col sticky-col-left-1 acc-sticky-footer-cell"
      >
        Total
      </th>,
    );
    cells.push(totals.map((value, index) => this.renderTableFooterCell(value, index, claimPeriod)));
    cells.push(
      this.renderTableFooterCell(
        costTotal,
        totals.length + 1,
        claimPeriod,
        "sticky-col sticky-col-right-3 acc-sticky-footer-cell acc-table__cell-right-border",
        "qa-costs-remaining",
      ),
    );
    cells.push(
      this.renderTableFooterCell(
        golTotal,
        totals.length + 2,
        claimPeriod,
        "sticky-col sticky-col-right-2 acc-sticky-footer-cell acc-table__cell-right-border",
      ),
    );
    cells.push(
      <td
        key="total_diff"
        className="govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border govuk-!-font-weight-regular sticky-col sticky-col-right-1 acc-sticky-footer-cell"
      >
        <Percentage value={diffAsPercentage(golTotal, costTotal)} />
      </td>,
    );

    return [
      <tr
        id={warningId}
        key="footer1"
        className={classNames("govuk-table__row", "govuk-body-s", { "table__row--error": warning })}
      >
        {cells}
      </tr>,
    ];
  }

  private readonly renderTableFooterCell = (
    total: number,
    key: number,
    claimedPeriod: number,
    className = "",
    qa?: string,
  ) => (
    <td
      key={key}
      className={cx(
        `govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border govuk-!-font-weight-regular acc-sticky-footer-cell`,
        {
          "acc-table__cell-right-border": key === claimedPeriod - 1,
        },
        className,
      )}
    >
      <Currency data-qa={qa} value={total} />
    </td>
  );
}

/**
 * gets the overhead rate
 */
function getOverheadRate(
  partner: ForecastDataForTableLayout["partner"],
  project: ForecastDataForTableLayout["project"],
  costCategories: ForecastDataForTableLayout["costCategories"],
  cell: ForecastDetailsDTO,
  data: ForecastDetailsDTO[],
) {
  const { overheadRate, organisationType } = partner;

  if (!overheadRate) return null;

  const filteredCostCategories = costCategories.filter(
    x => x.competitionType === project.competitionType && x.organisationType === organisationType,
  );

  const overheadsCategory = filteredCostCategories.find(x => x.type === CostCategoryType.Overheads);

  if (!overheadsCategory) return null;

  const labourCategory = filteredCostCategories.find(x => x.type === CostCategoryType.Labour);

  const overheadsData = data.find(x => x.costCategoryId === overheadsCategory.id && x.periodId === cell.periodId);

  return {
    labourCategory,
    overheadsData,
  };
}

/**
 * calculates overhead value
 */
export function calculateOverheadCell(
  overheadRate: number,
  labourCategoryId: string,
  currentValue: number,
  cell: ForecastDetailsDTO,
): number {
  const editingLabourCategory = cell.costCategoryId === labourCategoryId;

  const recalculatedValue = cell.value * (overheadRate / 100);

  return editingLabourCategory ? recalculatedValue : currentValue;
}

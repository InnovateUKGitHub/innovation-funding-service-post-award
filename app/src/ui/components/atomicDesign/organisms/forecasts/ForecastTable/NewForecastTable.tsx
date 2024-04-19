import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { CondensedDateRange } from "@ui/components/atomicDesign/atoms/Date";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";
import { Table, TBody, TFoot, THead, TH, TD, TR } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { ForecastTableSchemaType } from "@ui/zod/forecastTableValidation.zod";
import classNames from "classnames";
import { useEffect } from "react";
import { Control, FieldValues, UseFormGetFieldState, UseFormTrigger } from "react-hook-form";
import { z } from "zod";
import { ForecastTableCurrencyInput } from "./ForecastTableCurrencyInput";
import { forecastTableResize } from "./forecastTableResize";
import { getForecastHeaderContent } from "./getForecastHeaderContent";
import { ForecastTableDto } from "./NewForecastTable.logic";

export interface NewForecastTableProps {
  control?: Control<z.output<ForecastTableSchemaType>>;
  trigger?: UseFormTrigger<z.output<ForecastTableSchemaType>>;
  getFieldState?: UseFormGetFieldState<FieldValues>;
  tableData: ForecastTableDto;
  disabled?: boolean;
  isProjectSetup: boolean;
}

const NewForecastTable = (props: NewForecastTableProps) => {
  const { control, getFieldState, disabled, tableData, trigger } = props;
  const { getContent } = useContent();

  // Resize the forecast table when the contents of the data changes
  useEffect(forecastTableResize, [props.tableData]);

  // Create the className required for standard columns
  const colClassName = (x: boolean | undefined = true, className?: string) =>
    classNames({ "ifspa-forecast-table-border-right": x }, className);

  // Create the className required for sticky columns
  const stickyColClassName = (pos: "left" | "right", i: number) =>
    classNames(
      "ifspa-forecast-table-sticky-col",

      // Invert left/right
      `ifspa-forecast-table-border-${pos === "left" ? "right" : "left"}`,
      `ifspa-forecast-table-${pos}-col-${i}`,
    );

  return (
    <div className="ifspa-forecast-wrapper">
      <Table id="ifspa-forecast-table" className="ifspa-forecast-table">
        <THead>
          <TR>
            <TH className={stickyColClassName("left", 1)}>
              <AccessibilityText>{getContent(x => x.components.forecastTable.costCategoriesHeader)}</AccessibilityText>
            </TH>
            {tableData.statusRow.map(({ colSpan, group, rhc }, index) => (
              <TH colSpan={colSpan} key={index} className={colClassName(rhc)}>
                {getContent(getForecastHeaderContent(group))}
              </TH>
            ))}
            <TH className={stickyColClassName("right", 3)}>
              {getContent(x => x.components.forecastTable.totalHeader)}
            </TH>
            <TH className={stickyColClassName("right", 2)}>
              {getContent(x => x.components.forecastTable.totalEligibleCostsHeader)}
            </TH>
            <TH className={stickyColClassName("right", 1)}>
              {getContent(x => x.components.forecastTable.differenceHeader)}
            </TH>
          </TR>
          <TR>
            <TH className={stickyColClassName("left", 1)}>
              {getContent(x => x.components.forecastTable.periodHeader)}
            </TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={colClassName(profile.rhc)}>
                <AccessibilityText>{getContent(x => x.components.forecastTable.periodHeader)}</AccessibilityText>{" "}
                {profile.periodId}
              </TH>
            ))}
            <TH className={stickyColClassName("right", 3)}>
              <TableEmptyCell />
            </TH>
            <TH className={stickyColClassName("right", 2)}>
              <TableEmptyCell />
            </TH>
            <TH className={stickyColClassName("right", 1)}>
              <TableEmptyCell />
            </TH>
          </TR>
          <TR>
            <TH className={stickyColClassName("left", 1)}>
              {getContent(x => x.components.forecastTable.iarDueHeader)}
            </TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={colClassName(profile.rhc)}>
                {getContent(
                  profile.iarDue ? x => x.components.forecastTable.iarDue : x => x.components.forecastTable.iarNotDue,
                )}
              </TH>
            ))}
            <TH className={stickyColClassName("right", 3)}>
              <TableEmptyCell />
            </TH>
            <TH className={stickyColClassName("right", 2)}>
              <TableEmptyCell />
            </TH>
            <TH className={stickyColClassName("right", 1)}>
              <TableEmptyCell />
            </TH>
          </TR>
          <TR>
            <TH className={stickyColClassName("left", 1)}>{getContent(x => x.components.forecastTable.month)}</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={colClassName(profile.rhc, "ifspa-forecast-table-date")}>
                <CondensedDateRange
                  className="ifspa-forecast-wrap"
                  start={profile.periodStart}
                  end={profile.periodEnd}
                />
              </TH>
            ))}
            <TH className={stickyColClassName("right", 3)}>
              <TableEmptyCell />
            </TH>
            <TH className={stickyColClassName("right", 2)}>
              <TableEmptyCell />
            </TH>
            <TH className={stickyColClassName("right", 1)}>
              <TableEmptyCell />
            </TH>
          </TR>
        </THead>
        <TBody>
          {tableData.costCategories.map(costCategory => (
            <TR
              data-qa={`forecast-${costCategory.costCategoryId}-row`}
              key={costCategory.costCategoryId}
              hasWarning={costCategory.greaterThanAllocatedCosts}
              id={`costCategory_${costCategory.costCategoryId}`}
              hasError={getFieldState?.(`costCategory.${costCategory.costCategoryId}`).invalid}
            >
              <TD className={stickyColClassName("left", 1)}>{costCategory.costCategoryName}</TD>
              {costCategory.profiles.map(profile => {
                const ariaLabel = getContent(x =>
                  x.components.forecastTable.inputLabel({
                    period: profile.periodId,
                    costCategoryName: costCategory.costCategoryName,
                  }),
                );

                return (
                  <TD
                    data-qa={`forecast-${costCategory.costCategoryId}-${profile.periodId}-cell`}
                    key={profile.periodId}
                    className={colClassName(profile.rhc)}
                  >
                    {control && trigger && profile.forecastMode && !profile.calculatedField ? (
                      <ForecastTableCurrencyInput
                        costCategoryId={costCategory.costCategoryId}
                        periodId={profile.periodId}
                        profileId={profile.profileId}
                        defaultValue={String(profile.value)}
                        control={control}
                        trigger={trigger}
                        disabled={disabled}
                        aria-label={ariaLabel}
                      />
                    ) : (
                      <Currency value={profile.value} aria-label={ariaLabel} />
                    )}
                  </TD>
                );
              })}
              <TD className={stickyColClassName("right", 3)}>
                <Currency value={costCategory.total} />
              </TD>
              <TD className={stickyColClassName("right", 2)}>
                <Currency value={costCategory.golCost} />
              </TD>
              <TD className={stickyColClassName("right", 1)}>
                <Percentage value={costCategory.difference} />
              </TD>
            </TR>
          ))}
        </TBody>
        <TFoot>
          <TR data-qa="forecast-total-row" id="total" hasError={getFieldState?.("total").invalid}>
            <TH className={stickyColClassName("left", 1)}>{getContent(x => x.components.forecastTable.totalHeader)}</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TD
                data-qa={`forecast-total-${profile.periodId}-cell`}
                key={profile.periodId}
                className={colClassName(profile.rhc)}
              >
                <Currency value={profile.value} />
              </TD>
            ))}
            <TD className={stickyColClassName("right", 3)}>
              <Currency value={tableData.totalRow.total} />
            </TD>
            <TD className={stickyColClassName("right", 2)}>
              <Currency value={tableData.totalRow.golCost} />
            </TD>
            <TD className={stickyColClassName("right", 1)}>
              <Percentage value={tableData.totalRow.difference} />
            </TD>
          </TR>
        </TFoot>
      </Table>
    </div>
  );
};

export { NewForecastTable };

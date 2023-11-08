import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { ShortMonthYear } from "@ui/components/atomicDesign/atoms/Date";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";
import { Table, TBody, TFoot, THead, TH, TD, TR } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { useContent } from "@ui/hooks/content.hook";
import { ForecastTableSchemaType } from "@ui/zod/forecastTableValidation.zod";
import classNames from "classnames";
import { useEffect } from "react";
import { Control, FieldValues, UseFormGetFieldState } from "react-hook-form";
import { z } from "zod";
import { ForecastTableCurrencyInput } from "./ForecastTableCurrencyInput";
import { forecastTableResize } from "./forecastTableResize";
import { getForecastHeaderContent } from "./getForecastHeaderContent";
import { ForecastTableDto } from "./useMapToForecastTableDto";

export interface ForecastTableProps {
  control?: Control<z.output<ForecastTableSchemaType>>;
  getFieldState?: UseFormGetFieldState<FieldValues>;
  tableData: ForecastTableDto;
  disabled?: boolean;
}

const ForecastTable = (props: ForecastTableProps) => {
  const { control, getFieldState, disabled, tableData } = props;
  const { getContent } = useContent();

  useEffect(forecastTableResize, [props.tableData]);

  const mkcol = (x: boolean | undefined = true, className?: string) =>
    classNames({ "ifspa-forecast-table-border-right": x }, className);
  const mkstickcol = (pos: "left" | "right", i: number) =>
    classNames(
      "ifspa-forecast-table-sticky-col",
      `ifspa-forecast-table-border-${pos === "left" ? "right" : "left"}`,
      `ifspa-forecast-table-${pos}-col-${i}`,
    );

  return (
    <div className="ifspa-forecast-wrapper">
      <Table id="ifspa-forecast-table" className="ifspa-forecast-table">
        <THead>
          <TR>
            <TH className={mkstickcol("left", 1)}>
              <AccessibilityText>{getContent(x => x.components.forecastTable.costCategoriesHeader)}</AccessibilityText>
            </TH>
            {tableData.statusRow.map(({ colSpan, group, rhc }, index) => (
              <TH colSpan={colSpan} key={index} className={mkcol(rhc)}>
                {getContent(getForecastHeaderContent(group))}
              </TH>
            ))}
            <TH className={mkstickcol("right", 3)}>{getContent(x => x.components.forecastTable.totalHeader)}</TH>
            <TH className={mkstickcol("right", 2)}>
              {getContent(x => x.components.forecastTable.totalEligibleCostsHeader)}
            </TH>
            <TH className={mkstickcol("right", 1)}>{getContent(x => x.components.forecastTable.differenceHeader)}</TH>
          </TR>
          <TR>
            <TH className={mkstickcol("left", 1)}>{getContent(x => x.components.forecastTable.periodHeader)}</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={mkcol(profile.rhc)}>
                <AccessibilityText>{getContent(x => x.components.forecastTable.periodHeader)}</AccessibilityText>{" "}
                {profile.periodId}
              </TH>
            ))}
            <TH className={mkstickcol("right", 3)}>
              <TableEmptyCell />
            </TH>
            <TH className={mkstickcol("right", 2)}>
              <TableEmptyCell />
            </TH>
            <TH className={mkstickcol("right", 1)}>
              <TableEmptyCell />
            </TH>
          </TR>
          <TR>
            <TH className={mkstickcol("left", 1)}>{getContent(x => x.components.forecastTable.iarDueHeader)}</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={mkcol(profile.rhc)}>
                {getContent(
                  profile.iarDue ? x => x.components.forecastTable.iarDue : x => x.components.forecastTable.iarNotDue,
                )}
              </TH>
            ))}
            <TH className={mkstickcol("right", 3)}>
              <TableEmptyCell />
            </TH>
            <TH className={mkstickcol("right", 2)}>
              <TableEmptyCell />
            </TH>
            <TH className={mkstickcol("right", 1)}>
              <TableEmptyCell />
            </TH>
          </TR>
          <TR>
            <TH className={mkstickcol("left", 1)}>{getContent(x => x.components.forecastTable.month)}</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={mkcol(profile.rhc, "ifspa-forecast-nowrap")}>
                <ShortMonthYear value={profile.month} />
              </TH>
            ))}
            <TH className={mkstickcol("right", 3)}>
              <TableEmptyCell />
            </TH>
            <TH className={mkstickcol("right", 2)}>
              <TableEmptyCell />
            </TH>
            <TH className={mkstickcol("right", 1)}>
              <TableEmptyCell />
            </TH>
          </TR>
        </THead>
        <TBody>
          {tableData.costCategories.map(costCategory => (
            <TR
              data-qa={`forecast-${costCategory.costCategoryId}-row`}
              key={costCategory.costCategoryId}
              hasWarning={costCategory.difference > 0}
            >
              <TD className={mkstickcol("left", 1)}>{costCategory.costCategoryName}</TD>
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
                    className={mkcol(profile.rhc)}
                  >
                    {control && profile.forecastMode && !profile.calculatedField ? (
                      <ForecastTableCurrencyInput
                        costCategoryId={costCategory.costCategoryId}
                        periodId={profile.periodId}
                        profileId={profile.profileId}
                        defaultValue={String(profile.value)}
                        control={control}
                        disabled={disabled}
                        aria-label={ariaLabel}
                      />
                    ) : (
                      <Currency value={profile.value} aria-label={ariaLabel} />
                    )}
                  </TD>
                );
              })}
              <TD className={mkstickcol("right", 3)}>
                <Currency value={costCategory.total} />
              </TD>
              <TD className={mkstickcol("right", 2)}>
                <Currency value={costCategory.golCost} />
              </TD>
              <TD className={mkstickcol("right", 1)}>
                <Percentage value={costCategory.difference} />
              </TD>
            </TR>
          ))}
        </TBody>
        <TFoot>
          <TR data-qa="forecast-total-row" hasError={getFieldState?.("total").invalid}>
            <TH className={mkstickcol("left", 1)}>{getContent(x => x.components.forecastTable.totalHeader)}</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TD
                data-qa={`forecast-total-${profile.periodId}-cell`}
                key={profile.periodId}
                className={mkcol(profile.rhc)}
              >
                <Currency value={profile.value} />
              </TD>
            ))}
            <TD className={mkstickcol("right", 3)}>
              <Currency value={tableData.totalRow.total} />
            </TD>
            <TD className={mkstickcol("right", 2)}>
              <Currency value={tableData.totalRow.golCost} />
            </TD>
            <TD className={mkstickcol("right", 1)}>
              <Percentage value={tableData.totalRow.difference} />
            </TD>
          </TR>
        </TFoot>
      </Table>
    </div>
  );
};

export { ForecastTable };

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

  const mkcol = (x: boolean | undefined = true) => classNames({ "ifspa-forecast-table-border-right": x });
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
              <AccessibilityText>Cost Category</AccessibilityText>
            </TH>
            {tableData.statusRow.map(({ colSpan, group, rhc }, index) => (
              <TH colSpan={colSpan} key={index} className={mkcol(rhc)}>
                {getContent(getForecastHeaderContent(group))}
              </TH>
            ))}
            <TH className={mkstickcol("right", 3)}>Total</TH>
            <TH className={mkstickcol("right", 2)}>Total eligible costs</TH>
            <TH className={mkstickcol("right", 1)}>Difference</TH>
          </TR>
          <TR>
            <TH className={mkstickcol("left", 1)}>Period</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={mkcol(profile.rhc)}>
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
            <TH className={mkstickcol("left", 1)}>IAR Due</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={mkcol(profile.rhc)}>
                {profile.iarDue ? "Yes" : "No"}
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
            <TH className={mkstickcol("left", 1)}>Month</TH>
            {tableData.totalRow.profiles.map(profile => (
              <TH key={profile.periodId} className={mkcol(profile.rhc)}>
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
              {costCategory.profiles.map(profile => (
                <TD
                  data-qa={`forecast-${costCategory.costCategoryId}-${profile.periodId}-cell`}
                  key={profile.periodId}
                  className={mkcol(profile.rhc)}
                >
                  {control && profile.forecast ? (
                    <ForecastTableCurrencyInput
                      costCategoryId={costCategory.costCategoryId}
                      periodId={profile.periodId}
                      profileId={profile.profileId}
                      defaultValue={String(profile.value)}
                      control={control}
                      disabled={disabled}
                    />
                  ) : (
                    <Currency value={profile.value} />
                  )}
                </TD>
              ))}
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
            <TH className={mkstickcol("left", 1)}>Total</TH>
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

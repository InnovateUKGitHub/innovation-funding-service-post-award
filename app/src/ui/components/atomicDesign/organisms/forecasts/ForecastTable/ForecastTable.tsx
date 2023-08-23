import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { ShortMonthYear } from "@ui/components/atomicDesign/atoms/Date";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";
import {
  Table,
  TableBody,
  TableData,
  TableFoot,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/atomicDesign/atoms/table/tableComponents";
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
        <TableHead>
          <TableRow>
            <TableHeader className={mkstickcol("left", 1)}>
              <AccessibilityText>Cost Category</AccessibilityText>
            </TableHeader>
            {tableData.statusRow.map(({ colSpan, group, rhc }, index) => (
              <TableHeader colSpan={colSpan} key={index} className={mkcol(rhc)}>
                {getContent(getForecastHeaderContent(group))}
              </TableHeader>
            ))}
            <TableHeader className={mkstickcol("right", 3)}>Total</TableHeader>
            <TableHeader className={mkstickcol("right", 2)}>Total eligible costs</TableHeader>
            <TableHeader className={mkstickcol("right", 1)}>Difference</TableHeader>
          </TableRow>
          <TableRow>
            <TableHeader className={mkstickcol("left", 1)}>Period</TableHeader>
            {tableData.totalRow.profiles.map(profile => (
              <TableHeader key={profile.periodId} className={mkcol(profile.rhc)}>
                {profile.periodId}
              </TableHeader>
            ))}
            <TableHeader className={mkstickcol("right", 3)}>
              <TableEmptyCell />
            </TableHeader>
            <TableHeader className={mkstickcol("right", 2)}>
              <TableEmptyCell />
            </TableHeader>
            <TableHeader className={mkstickcol("right", 1)}>
              <TableEmptyCell />
            </TableHeader>
          </TableRow>
          <TableRow>
            <TableHeader className={mkstickcol("left", 1)}>IAR Due</TableHeader>
            {tableData.totalRow.profiles.map(profile => (
              <TableHeader key={profile.periodId} className={mkcol(profile.rhc)}>
                {profile.iarDue ? "Yes" : "No"}
              </TableHeader>
            ))}
            <TableHeader className={mkstickcol("right", 3)}>
              <TableEmptyCell />
            </TableHeader>
            <TableHeader className={mkstickcol("right", 2)}>
              <TableEmptyCell />
            </TableHeader>
            <TableHeader className={mkstickcol("right", 1)}>
              <TableEmptyCell />
            </TableHeader>
          </TableRow>
          <TableRow>
            <TableHeader className={mkstickcol("left", 1)}>Month</TableHeader>
            {tableData.totalRow.profiles.map(profile => (
              <TableHeader key={profile.periodId} className={mkcol(profile.rhc)}>
                <ShortMonthYear value={profile.month} />
              </TableHeader>
            ))}
            <TableHeader className={mkstickcol("right", 3)}>
              <TableEmptyCell />
            </TableHeader>
            <TableHeader className={mkstickcol("right", 2)}>
              <TableEmptyCell />
            </TableHeader>
            <TableHeader className={mkstickcol("right", 1)}>
              <TableEmptyCell />
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.costCategories.map(costCategory => (
            <TableRow
              qa={`forecast-${costCategory.costCategoryId}-row`}
              key={costCategory.costCategoryId}
              hasWarning={costCategory.difference > 0}
            >
              <TableData className={mkstickcol("left", 1)}>{costCategory.costCategoryName}</TableData>
              {costCategory.profiles.map(profile => (
                <TableData
                  qa={`forecast-${costCategory.costCategoryId}-${profile.periodId}-cell`}
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
                </TableData>
              ))}
              <TableData className={mkstickcol("right", 3)}>
                <Currency value={costCategory.total} />
              </TableData>
              <TableData className={mkstickcol("right", 2)}>
                <Currency value={costCategory.golCost} />
              </TableData>
              <TableData className={mkstickcol("right", 1)}>
                <Percentage value={costCategory.difference} />
              </TableData>
            </TableRow>
          ))}
        </TableBody>
        <TableFoot>
          <TableRow qa="forecast-total-row" hasError={getFieldState?.("total").invalid}>
            <TableHeader className={mkstickcol("left", 1)}>Total</TableHeader>
            {tableData.totalRow.profiles.map(profile => (
              <TableData
                qa={`forecast-total-${profile.periodId}-cell`}
                key={profile.periodId}
                className={mkcol(profile.rhc)}
              >
                <Currency value={profile.value} />
              </TableData>
            ))}
            <TableData className={mkstickcol("right", 3)}>
              <Currency value={tableData.totalRow.total} />
            </TableData>
            <TableData className={mkstickcol("right", 2)}>
              <Currency value={tableData.totalRow.golCost} />
            </TableData>
            <TableData className={mkstickcol("right", 1)}>
              <Percentage value={tableData.totalRow.difference} />
            </TableData>
          </TableRow>
        </TableFoot>
      </Table>
    </div>
  );
};

export { ForecastTable };

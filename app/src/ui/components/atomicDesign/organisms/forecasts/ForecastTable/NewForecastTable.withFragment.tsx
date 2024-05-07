import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { NewForecastTableProps, NewForecastTable as NewForecastTableComponent } from "./NewForecastTable";
import { mapToForecastTableDto, useNewForecastTableData } from "./NewForecastTable.logic";
import { NewForecastTableFragment$key } from "./__generated__/NewForecastTableFragment.graphql";

export const NewForecastTableWithFragment = (props: Omit<NewForecastTableProps, "tableData">) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<NewForecastTableFragment$key>(fragmentRef, "NewForecastTableFragment")) {
    throw new Error("New Forecast Table is missing a NewForecastTableFragment reference");
  }

  const data = useNewForecastTableData({ fragmentRef, isProjectSetup: props.isProjectSetup });
  const tableData = mapToForecastTableDto(data);

  return <NewForecastTableComponent tableData={tableData} {...props} />;
};
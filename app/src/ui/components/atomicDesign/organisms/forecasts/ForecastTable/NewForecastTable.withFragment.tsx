import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { NewForecastTableProps, NewForecastTable as NewForecastTableComponent } from "./NewForecastTable";
import { mapToForecastTableDto, useNewForecastTableData } from "./NewForecastTable.logic";
import { NewForecastTableFragment$key } from "./__generated__/NewForecastTableFragment.graphql";

export const NewForecastTableWithFragment = (
  props: Omit<NewForecastTableProps, "tableData"> & {
    clientProfiles?: Record<string, string | null>;
    partnerId: PartnerId;
  },
) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<NewForecastTableFragment$key>(fragmentRef, "NewForecastTableFragment")) {
    throw new Error("New Forecast Table is missing a NewForecastTableFragment reference");
  }

  const data = useNewForecastTableData({
    fragmentRef,
    isProjectSetup: props.isProjectSetup,
    partnerId: props.partnerId,
  });
  const tableData = mapToForecastTableDto(
    props.clientProfiles ? { ...data, clientProfiles: props.clientProfiles } : data,
  );

  return <NewForecastTableComponent tableData={tableData} {...props} />;
};

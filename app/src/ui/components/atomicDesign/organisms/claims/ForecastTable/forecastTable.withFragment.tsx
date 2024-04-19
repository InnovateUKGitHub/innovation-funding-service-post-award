import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { useForecastTableFragment } from "./ForecastTable.logic";
import { ForecastTableFragment$key } from "./__generated__/ForecastTableFragment.graphql";
import { ForecastTable as ForecastTableComponent, Props as ForecastTableProps } from "./forecastTable";

export type ForecastTableWithFragmentProps =
  | { periodId: PeriodId; selectCurrentClaimByApprovedStatus?: false | undefined | null }
  | { periodId?: never; selectCurrentClaimByApprovedStatus: true };

export const ForecastTable = (props: ForecastTableWithFragmentProps & Omit<ForecastTableProps, "data">) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<ForecastTableFragment$key>(fragmentRef, "ForecastTableFragment")) {
    throw new Error("Forecast Table is missing a ForecastTableFragment reference");
  }

  const forecastData = useForecastTableFragment({ fragmentRef, ...props });

  return <ForecastTableComponent data={forecastData} {...props} />;
};

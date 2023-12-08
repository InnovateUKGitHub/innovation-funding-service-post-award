import { ForecastTableProps, ForecastTable as ForecastTableWithoutFragment } from "./ForecastTable";
import { useForecastTableFragmentFromContext } from "./useForecastTableFragment";
import { useMapToForecastTableDto } from "./useMapToForecastTableDto";

export const ForecastTable = ({
  clientProfiles,
  ...props
}: Omit<ForecastTableProps, "tableData"> & { clientProfiles?: Record<string, string> }) => {
  const data = useForecastTableFragmentFromContext();
  const tableData = useMapToForecastTableDto({ ...data, clientProfiles });
  return <ForecastTableWithoutFragment tableData={tableData} {...props} />;
};

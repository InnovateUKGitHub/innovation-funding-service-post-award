import { ForecastTableProps, ForecastTable as ForecastTableWithoutFragment } from "./ForecastTable";
import { useForecastTableFragmentFromContext } from "./useForecastTableFragment";
import { useMapToForecastTableDto } from "./useMapToForecastTableDto";

export const ForecastTable = ({
  clientProfiles,
  isProjectSetup,
  ...props
}: Omit<ForecastTableProps, "tableData"> & { isProjectSetup?: boolean; clientProfiles?: Record<string, string> }) => {
  const data = useForecastTableFragmentFromContext({ isProjectSetup });
  const tableData = useMapToForecastTableDto({ ...data, clientProfiles });
  return <ForecastTableWithoutFragment tableData={tableData} {...props} />;
};

import { FragmentContextProvider } from "@gql/utils/fragmentContextHook";
import {
  ForecastTable as ForecastTableWithFragment,
  ForecastTableWithFragmentProps,
} from "./forecastTable.withFragment";
import { QueryOptions } from "@gql/hooks/useRefreshQuery";
import { useLazyLoadQuery } from "react-relay";
import { ForecastTableQuery } from "./__generated__/ForecastTableQuery.graphql";
import { forecastTableQuery } from "./ForecastTable.query";
import { Props as ForecastTableProps } from "./forecastTable";

interface ForecastTableStandaloneProps {
  queryOptions?: QueryOptions;
  partnerId: PartnerId;
  projectId: ProjectId;
}

const useForecastTableData = ({ projectId, partnerId, queryOptions }: ForecastTableStandaloneProps) => {
  const data = useLazyLoadQuery<ForecastTableQuery>(
    forecastTableQuery,
    { projectId, projectIdStr: projectId, partnerId },
    queryOptions,
  );

  return {
    fragmentRef: data?.salesforce?.uiapi,
  };
};

const ForecastTable = ({
  projectId,
  partnerId,
  queryOptions = { fetchPolicy: "network-only" },
  ...rest
}: ForecastTableStandaloneProps & ForecastTableWithFragmentProps & Omit<ForecastTableProps, "data">) => {
  const { fragmentRef } = useForecastTableData({ projectId, partnerId, queryOptions });
  return (
    <FragmentContextProvider fragment={fragmentRef}>
      <ForecastTableWithFragment {...rest} />
    </FragmentContextProvider>
  );
};

export { ForecastTable };

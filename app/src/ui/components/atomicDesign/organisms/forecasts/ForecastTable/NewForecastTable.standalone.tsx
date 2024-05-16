import { QueryOptions } from "@gql/hooks/useRefreshQuery";
import { FragmentContextProvider } from "@gql/utils/fragmentContextHook";
import { memo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { newForecastTableQuery } from "./NewForecastTable.query";
import { NewForecastTableProps } from "./NewForecastTable";
import { NewForecastTableWithFragment } from "./NewForecastTable.withFragment";
import { NewForecastTableQuery } from "./__generated__/NewForecastTableQuery.graphql";

interface ForecastTableStandaloneProps {
  queryOptions?: QueryOptions;
  projectId: ProjectId;
  partnerId: PartnerId;
}

const useNewForecastTableData = ({ projectId, partnerId, queryOptions }: ForecastTableStandaloneProps) => {
  const data = useLazyLoadQuery<NewForecastTableQuery>(newForecastTableQuery, { projectId, partnerId }, queryOptions);

  return {
    fragmentRef: data?.salesforce?.uiapi,
  };
};

const NewForecastTableWithStandalone = ({
  projectId,
  partnerId,
  queryOptions = { fetchPolicy: "network-only" },
  ...rest
}: ForecastTableStandaloneProps & Omit<NewForecastTableProps, "tableData">) => {
  const { fragmentRef } = useNewForecastTableData({ projectId, partnerId, queryOptions });
  return (
    <FragmentContextProvider fragment={fragmentRef}>
      <NewForecastTableWithFragment {...rest} partnerId={partnerId} />
    </FragmentContextProvider>
  );
};

const NewForecastTableWithStandaloneMemo = memo(NewForecastTableWithStandalone);

export { NewForecastTableWithStandalone, NewForecastTableWithStandaloneMemo };

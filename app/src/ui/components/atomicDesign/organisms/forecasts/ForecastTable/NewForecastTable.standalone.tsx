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
  projectParticipantId: PartnerId;
}

const useNewForecastTableData = ({ projectId, projectParticipantId, queryOptions }: ForecastTableStandaloneProps) => {
  const data = useLazyLoadQuery<NewForecastTableQuery>(
    newForecastTableQuery,
    { projectId, projectParticipantId },
    queryOptions,
  );

  return {
    fragmentRef: data?.salesforce?.uiapi,
  };
};

const NewForecastTableWithStandalone = ({
  projectId,
  projectParticipantId,
  queryOptions = { fetchPolicy: "network-only" },
  ...rest
}: ForecastTableStandaloneProps & Omit<NewForecastTableProps, "tableData">) => {
  const { fragmentRef } = useNewForecastTableData({ projectId, projectParticipantId, queryOptions });
  return (
    <FragmentContextProvider fragment={fragmentRef}>
      <NewForecastTableWithFragment {...rest} />
    </FragmentContextProvider>
  );
};

const NewForecastTableWithStandaloneMemo = memo(NewForecastTableWithStandalone);

export { NewForecastTableWithStandalone, NewForecastTableWithStandaloneMemo };

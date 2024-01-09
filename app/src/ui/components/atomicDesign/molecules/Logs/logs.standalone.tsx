import { FragmentContextProvider } from "@gql/utils/fragmentContextHook";
import { Logs as LogsWithFragment } from "./logs.withFragment";
import { QueryOptions } from "@gql/hooks/useRefreshQuery";
import { useLazyLoadQuery } from "react-relay";
import { StatusChangeLogsQuery } from "./__generated__/StatusChangeLogsQuery.graphql";
import { statusChangesLogsQuery } from "./StatusChangeLogs.query";

interface BaseLogsStandaloneProps {
  queryOptions?: QueryOptions;
  partnerId: PartnerId;
  projectId: ProjectId;
  periodId: PeriodId;
}

interface LogsStandaloneProps extends BaseLogsStandaloneProps {
  qa: string;
}

const useLogsData = ({ projectId, partnerId, periodId, queryOptions }: BaseLogsStandaloneProps) => {
  const data = useLazyLoadQuery<StatusChangeLogsQuery>(
    statusChangesLogsQuery,
    { projectId, partnerId, periodId },
    queryOptions,
  );

  return {
    fragmentRef: data?.salesforce?.uiapi,
  };
};

const Logs = ({ qa, projectId, partnerId, periodId, queryOptions }: LogsStandaloneProps) => {
  const { fragmentRef } = useLogsData({ projectId, partnerId, periodId, queryOptions });
  return (
    <FragmentContextProvider fragment={fragmentRef}>
      <LogsWithFragment qa={qa} />;
    </FragmentContextProvider>
  );
};

export { Logs };

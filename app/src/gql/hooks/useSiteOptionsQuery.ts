import { LogLevel } from "@framework/constants";
import { clientConfigQueryQuery } from "@gql/query/clientConfigQuery";
import { siteOptionsQuery } from "@gql/query/__generated__/siteOptionsQuery.graphql";
import { useServerSideLoadedQuery } from "./useServerSideLoadedQuery";

const useSiteOptionsQuery = () => useServerSideLoadedQuery<siteOptionsQuery>(clientConfigQueryQuery);

/**
 * @deprecated Ensure that consumers of this component use string based enums.
 */
const useLegacySiteOptionsObjectQuery = () => {
  const result = useSiteOptionsQuery();

  let logLevel: LogLevel;

  switch (result.data.clientConfig.logLevel) {
    case "DEBUG":
      logLevel = LogLevel.DEBUG;
      break;
    case "ERROR":
      logLevel = LogLevel.ERROR;
      break;
    case "INFO":
      logLevel = LogLevel.INFO;
      break;
    case "VERBOSE":
      logLevel = LogLevel.VERBOSE;
      break;
    case "WARN":
      logLevel = LogLevel.WARN;
      break;
    default:
      logLevel = LogLevel.WARN;
  }

  return {
    ...result,
    data: {
      ...result.data,
      clientConfig: {
        ...result.data.clientConfig,
        logLevel,
      },
    },
  } as const;
};

export { useSiteOptionsQuery, useLegacySiteOptionsObjectQuery };

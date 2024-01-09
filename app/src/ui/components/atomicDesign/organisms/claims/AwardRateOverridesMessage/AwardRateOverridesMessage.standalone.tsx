import { FragmentContextProvider } from "@gql/utils/fragmentContextHook";
import {
  AwardRateOverridesMessage as AwardRateOverridesMessageWithFragment,
  AwardRateOverridesMessageFragmentProps,
} from "./AwardRateOverridesMessage.withFragment";
import { QueryOptions } from "@gql/hooks/useRefreshQuery";
import { useLazyLoadQuery } from "react-relay";
import { AwardRateOverridesMessageQuery } from "./__generated__/AwardRateOverridesMessageQuery.graphql";
import { awardRateOverridesMessageQuery } from "./AwardRateOverridesMessage.query";
import { AwardRateOverrideMessageProps } from "./AwardRateOverridesMessage";

interface AwardRateOverrideStandaloneProps {
  queryOptions?: QueryOptions;
  partnerId: PartnerId;
  projectId: ProjectId;
}

const useForecastTableData = ({ projectId, partnerId, queryOptions }: AwardRateOverrideStandaloneProps) => {
  const data = useLazyLoadQuery<AwardRateOverridesMessageQuery>(
    awardRateOverridesMessageQuery,
    { projectId, partnerId },
    queryOptions,
  );

  return {
    fragmentRef: data?.salesforce?.uiapi,
  };
};

const AwardRateOverridesMessage = ({
  projectId,
  partnerId,
  queryOptions,
  ...rest
}: AwardRateOverrideStandaloneProps &
  AwardRateOverridesMessageFragmentProps &
  Omit<AwardRateOverrideMessageProps, "claimOverrides" | "isNonFec">) => {
  const { fragmentRef } = useForecastTableData({ projectId, partnerId, queryOptions });
  return (
    <FragmentContextProvider fragment={fragmentRef}>
      <AwardRateOverridesMessageWithFragment {...rest} />
    </FragmentContextProvider>
  );
};

export { AwardRateOverridesMessage };

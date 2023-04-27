import { useLazyLoadQuery } from "react-relay";
import { broadcastDetailsQuery } from "./BroadcastDetails.query";
import { BroadcastDetailsQuery } from "./__generated__/BroadcastDetailsQuery.graphql";
import { mapToBroadcastDto } from "@gql/dtoMapper/mapBroadcastDto";
import { BroadcastDto } from "@framework/dtos";

type BroadcastQueryResponse =
  | {
      broadcast: Pick<BroadcastDto, "id" | "title" | "endDate" | "startDate" | "content">;
      rejected: false;
    }
  | { broadcast: EmptyObject; rejected: true };

export const useBroadcastDetailsQuery = (broadcastId: BroadcastId): BroadcastQueryResponse => {
  const data = useLazyLoadQuery<BroadcastDetailsQuery>(broadcastDetailsQuery, { broadcastId });

  const edges = data?.salesforce?.uiapi?.query?.Acc_BroadcastMessage__c?.edges ?? [];

  const broadcastNode = edges.length === 1 ? edges[0] : undefined;

  if (broadcastNode) {
    const broadcast = mapToBroadcastDto(broadcastNode.node, ["id", "title", "content", "endDate", "startDate"]);
    return { broadcast, rejected: false };
  }

  return { broadcast: {}, rejected: true };
};

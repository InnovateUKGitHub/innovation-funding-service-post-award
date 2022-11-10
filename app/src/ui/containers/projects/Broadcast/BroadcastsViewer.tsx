import { useStores } from "@ui/redux";
import { getPending } from "@ui/helpers/get-pending";

import { useContent } from "@ui/hooks";
import * as ACC from "@ui/components";

import { BroadcastView } from "./BroadcastView";

/**
 * ### BroadcastsViewer
 *
 * React component displays broadcasts
 */
export function BroadcastsViewer() {
  const { getContent } = useContent();
  const stores = useStores();
  const broadcastsPending = stores.broadcasts.getAll();

  const { isLoading, isRejected, payload } = getPending(broadcastsPending);

  return (
    <>
      <ACC.H2>{getContent(x => x.components.broadcastContent.broadcastsTitle)}</ACC.H2>

      <div className="broadcasts govuk-!-margin-bottom-8">
        {isLoading && (
          <ACC.Renderers.SimpleString>
            {getContent(x => x.components.broadcastContent.loadingBroadcasts)}
          </ACC.Renderers.SimpleString>
        )}

        {isRejected && (
          <ACC.Renderers.SimpleString>
            {getContent(x => x.components.broadcastContent.errorBroadcasts)}
          </ACC.Renderers.SimpleString>
        )}

        {payload &&
          (payload.length ? (
            payload.map(broadcast => <BroadcastView key={broadcast.id} {...broadcast} />)
          ) : (
            <ACC.Renderers.SimpleString>
              {getContent(x => x.components.broadcastContent.emptyBroadcasts)}
            </ACC.Renderers.SimpleString>
          ))}
      </div>
    </>
  );
}

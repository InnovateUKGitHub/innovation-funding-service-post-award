import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { getPending } from "@ui/helpers/get-pending";
import { useContent } from "@ui/hooks";

import { BroadcastDetail } from "./BroadcastDetail";

interface BroadcastPageParams {
  broadcastId: string;
}

interface BroadcastItemProps extends BaseProps, BroadcastPageParams {}

function BroadcastPage(props: BroadcastItemProps) {
  const stores = useStores();
  const { getContent } = useContent();

  const broadcastQuery = stores.broadcasts.get(props.broadcastId);
  const { isLoading, isRejected, payload } = getPending(broadcastQuery);

  const pageTitle = (!isRejected && payload?.title) || getContent(x => x.broadcastPage.emptyBroadcast);

  const titleElement = (
    <ACC.PageTitle
      caption={getContent(x => x.broadcastPage.broadcastTitle)}
      title={isLoading ? getContent(x => x.broadcastPage.loadingBroadcast) : pageTitle}
    />
  );

  const backLinkElement = (
    <ACC.BackLink route={props.routes.projectDashboard.getLink({})}>
      {getContent(x => x.projectOverview.backToProjects)}
    </ACC.BackLink>
  );

  return (
    <ACC.Page pageTitle={titleElement} backLink={backLinkElement}>
      {isLoading && (
        <ACC.Renderers.SimpleString>{getContent(x => x.broadcastPage.loadingBroadcast)}</ACC.Renderers.SimpleString>
      )}

      {isRejected && (
        <ACC.Renderers.SimpleString>{getContent(x => x.broadcastPage.errorBroadcast)}</ACC.Renderers.SimpleString>
      )}

      {payload && <BroadcastDetail {...payload} />}
    </ACC.Page>
  );
}

export const BroadcastPageRoute = defineRoute<BroadcastPageParams>({
  routeName: "broadcastPage",
  routePath: "/broadcasts/:broadcastId",
  container: BroadcastPage,
  getParams: r => ({
    broadcastId: r.params.broadcastId,
  }),
  getTitle: ({ content }) => content.broadcastPage.title(),
});

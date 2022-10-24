import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";
import { PageTitle } from "@ui/features/page-title";

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

  const pageTitle = (!isRejected && payload?.title) || getContent(x => x.components.broadcastContent.emptyBroadcast);

  const titleElement = (
    <PageTitle
      title={isLoading ? getContent(x => x.components.broadcastContent.loadingBroadcast) : pageTitle}
      caption={getContent(x => x.components.broadcastContent.broadcastTitle)}
    />
  );

  const backLinkElement = (
    <ACC.BackLink route={props.routes.projectDashboard.getLink({})}>
      {getContent(x => x.pages.projectOverview.backToProjects)}
    </ACC.BackLink>
  );

  return (
    <ACC.Page pageTitle={titleElement} backLink={backLinkElement}>
      {isLoading && (
        <ACC.Renderers.SimpleString>
          {getContent(x => x.components.broadcastContent.loadingBroadcast)}
        </ACC.Renderers.SimpleString>
      )}

      {isRejected && (
        <ACC.Renderers.SimpleString>
          {getContent(x => x.components.broadcastContent.errorBroadcast)}
        </ACC.Renderers.SimpleString>
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
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.broadcastPage.title),
});

import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { PageTitle } from "@ui/features/page-title";

import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";

import { BroadcastDetail } from "./BroadcastDetail";
import { useBroadcastDetailsQuery } from "./broadcastDetails.logic";
import { Page } from "@ui/components/bjss/Page/page";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";

interface BroadcastPageParams {
  broadcastId: BroadcastId;
}

interface BroadcastItemProps extends BaseProps, BroadcastPageParams {}

const BroadcastPage = (props: BroadcastItemProps) => {
  const { getContent } = useContent();

  const { broadcast, rejected } = useBroadcastDetailsQuery(props.broadcastId);

  const pageTitle = (!rejected && broadcast?.title) || getContent(x => x.components.broadcastContent.emptyBroadcast);

  const titleElement = (
    <PageTitle title={pageTitle} caption={getContent(x => x.components.broadcastContent.broadcastTitle)} />
  );

  const backLinkElement = (
    <BackLink route={props.routes.projectDashboard.getLink({})}>
      {getContent(x => x.pages.projectOverview.backToProjects)}
    </BackLink>
  );

  return (
    <Page pageTitle={titleElement} backLink={backLinkElement} isActive={true}>
      {rejected && <SimpleString>{getContent(x => x.components.broadcastContent.errorBroadcast)}</SimpleString>}

      {!rejected && <BroadcastDetail {...broadcast} />}
    </Page>
  );
};

export const BroadcastPageRoute = defineRoute<BroadcastPageParams>({
  routeName: "broadcastPage",
  routePath: "/broadcasts/:broadcastId",
  container: BroadcastPage,
  getParams: r => ({
    broadcastId: r.params.broadcastId as BroadcastId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.broadcastPage.title),
});

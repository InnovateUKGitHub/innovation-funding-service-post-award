import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Page } from "@ui/components/molecules/Page/Page";
import { Section } from "@ui/components/molecules/Section/section";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { useContent } from "@ui/hooks/content.hook";
import { PageTitle } from "@ui/hooks/page-title";
import { defineRoute } from "./containerBase";

const SessionTimeoutContainer = () => {
  const { getContent } = useContent();
  const config = useClientConfig();

  return (
    <Page isActive qa="not-found" pageTitle={<PageTitle />}>
      <Section>
        <P>{getContent(x => x.pages.sessionTimeout.message({ timeout: config.timeouts.clientside }))}</P>
        <div className="govuk-button-group">
          <a className="govuk-button" href={config.ifsRoot}>
            {getContent(x => x.pages.sessionTimeout.signIn)}
          </a>
        </div>
      </Section>
    </Page>
  );
};

export const SessionTimeoutPage = defineRoute({
  allowUnauthenticatedAccess: true,
  allowRouteInActiveAccess: true,
  routeName: "sessionTimeoutPage",
  routePath: "/timeout",
  container: SessionTimeoutContainer,
  getParams: () => ({}),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.sessionTimeout.title),
});

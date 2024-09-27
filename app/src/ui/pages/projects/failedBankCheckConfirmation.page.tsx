import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { useContent } from "@ui/hooks/content.hook";
import { BaseProps, defineRoute } from "../../app/containerBase";
import { useFailedBankCheckConfirmationData } from "./failedBankCheckConfirmation.logic";

export interface FailedBankCheckConfirmationParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

/**
 * ### FailedBankCheckConfirmation
 *
 * React Component Page when bank check confirmation failed
 */
function FailedBankCheckConfirmation({ projectId, partnerId, routes }: BaseProps & FailedBankCheckConfirmationParams) {
  const { getContent } = useContent();

  const { fragmentRef } = useFailedBankCheckConfirmationData(projectId);

  const projectSetupRoute = routes.projectSetup.getLink({ projectId, partnerId });

  const failedConfirmationBackLink = getContent(x => x.pages.failedBankCheckConfirmation.backLink);

  return (
    <Page
      backLink={<BackLink route={projectSetupRoute}>{failedConfirmationBackLink}</BackLink>}
      fragmentRef={fragmentRef}
      partnerId={partnerId}
    >
      <Section qa="guidance">
        <Content markdown value={x => x.pages.failedBankCheckConfirmation.guidance} />
      </Section>

      <Section qa="return-to-setup-button">
        <Link styling="PrimaryButton" route={projectSetupRoute}>
          {getContent(x => x.pages.failedBankCheckConfirmation.returnToSetup)}
        </Link>
      </Section>
    </Page>
  );
}

export const FailedBankCheckConfirmationRoute = defineRoute<FailedBankCheckConfirmationParams>({
  routeName: "failedBankCheckConfirmation",
  routePath: "/projects/:projectId/setup/:partnerId/further-information-required",
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    partnerId: r.params.partnerId as PartnerId,
  }),
  container: FailedBankCheckConfirmation,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.FinancialContact),
  getTitle: x => x.content.getTitleCopy(x => x.pages.failedBankCheckConfirmation.title),
});

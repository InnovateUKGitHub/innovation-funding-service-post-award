import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Logs } from "@ui/components/atomicDesign/molecules/Logs/logs.withFragment";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.withFragment";
import { ClaimPeriodDate } from "@ui/components/atomicDesign/organisms/claims/ClaimPeriodDate/claimPeriodDate";
import { ClaimTable } from "@ui/components/atomicDesign/organisms/claims/ClaimTable/claimTable";
import { Page } from "@ui/components/bjss/Page/page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useClaimPreparePageData } from "./claimPrepare.logic";
import { ClaimDrawdownTable } from "./components/ClaimDrawdownTable";
import { getClaimDetailsStatusType } from "@ui/components/atomicDesign/organisms/claims/ClaimDetailsLink/claimDetailsLink";
import { useContent } from "@ui/hooks/content.hook";
import { ClaimRetentionMessage } from "@ui/components/atomicDesign/organisms/claims/ClaimRetentionMessage/ClaimRetentionMessage";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";

export interface PrepareClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

const PrepareComponent = (props: BaseProps & PrepareClaimParams) => {
  const data = useClaimPreparePageData(props.projectId, props.partnerId, props.periodId);

  const isNonEditable =
    getClaimDetailsStatusType({ project: data.project, partner: data.partner, claim: data.claim }) !== "edit";

  const { getContent } = useContent();

  const { isPm } = getAuthRoles(data.project.roles);

  const backLink = isPm
    ? props.routes.allClaimsDashboard.getLink({ projectId: props.projectId })
    : props.routes.claimsDashboard.getLink({ projectId: props.projectId, partnerId: props.partnerId });

  return (
    <Page
      backLink={
        <BackLink route={backLink}>
          <Content value={x => x.pages.claimPrepare.backLink} />
        </BackLink>
      }
      pageTitle={<Title />}
      fragmentRef={data?.fragmentRef}
    >
      <ClaimRetentionMessage claimDetails={data.claimDetails} partner={data.partner} />
      {isNonEditable && (
        <ValidationMessage message={getContent(x => x.pages.claimPrepare.readonlyMessage)} messageType="info" />
      )}
      <AwardRateOverridesMessage currentPeriod={props.periodId} />
      {data.claim.isFinalClaim && <ValidationMessage messageType="info" message={x => x.claimsMessages.finalClaim} />}

      <Section title={<ClaimPeriodDate claim={data.claim} />}>
        <ClaimTable
          disabled={isNonEditable}
          {...data}
          getLink={costCategoryId =>
            props.routes.prepareClaimLineItems.getLink({
              partnerId: props.partnerId,
              projectId: props.projectId,
              periodId: props.periodId,
              costCategoryId,
            })
          }
        />

        <ClaimDrawdownTable {...data.project} requiredPeriod={props.periodId} />

        <Accordion>
          <AccordionItem title={x => x.claimsLabels.accordionTitleClaimLog} qa="status-and-comments-log">
            <Logs qa="claim-status-change-table" />
          </AccordionItem>
        </Accordion>

        <Form>
          <Fieldset data-qa="save-and-continue">
            <Link
              route={props.routes.claimDocuments.getLink({
                projectId: props.projectId,
                partnerId: props.partnerId,
                periodId: props.periodId,
              })}
              styling="PrimaryButton"
              disabled={isNonEditable}
            >
              <Content value={x => x.pages.claimPrepare.buttonSaveAndContinue} />
            </Link>

            <Link route={backLink} styling="SecondaryButton">
              <Content value={x => x.pages.claimPrepare.buttonSaveAndReturn} />
            </Link>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

export const PrepareClaimRoute = defineRoute({
  routeName: "prepareClaim",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
  container: PrepareComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimPrepare.title),
});

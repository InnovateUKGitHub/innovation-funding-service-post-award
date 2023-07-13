import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { ClaimDrawdownTable } from "./components/ClaimDrawdownTable";
import { useClaimPreparePageData } from "./claimPrepare.logic";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { Accordion } from "@ui/components/accordion/Accordion";
import { AccordionItem } from "@ui/components/accordion/AccordionItem";
import { AwardRateOverridesMessage } from "@ui/components/claims/AwardRateOverridesMessage";
import { Content } from "@ui/components/content";
import { Page } from "@ui/components/layout/page";
import { Title } from "@ui/components/projects/title";
import { ClaimTable } from "@ui/components/claims/claimTable";
import { ClaimPeriodDate } from "@ui/components/claims/claimPeriodDate";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { Logs } from "@ui/components/logs";
import { Fieldset } from "@ui/rhf-components/Fieldset";
import { Button } from "@ui/rhf-components/Button";
import { ValidationMessage } from "@ui/components/validationMessage";
import { ClaimRetentionMessage } from "@ui/components/claims/ClaimRetentionMessage";
import { getClaimDetailsStatusType } from "@ui/components/claims/claimDetailsLink";
import { useContent } from "@ui/hooks/content.hook";

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

  const navigate = useNavigate();

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
      pageTitle={<Title projectNumber={data.project.projectNumber} title={data.project.title} />}
    >
      <ClaimRetentionMessage claimDetails={data.claimDetails} partner={data.partner} />
      {isNonEditable && (
        <ValidationMessage message={getContent(x => x.pages.claimPrepare.readonlyMessage)} messageType="info" />
      )}
      <AwardRateOverridesMessage claimOverrides={data.claimOverrides} isNonFec={data.project.isNonFec} />
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
            <Logs qa="claim-status-change-table" data={data.statusChanges} />
          </AccordionItem>
        </Accordion>

        <Fieldset data-qa="save-and-continue">
          <Button
            name="button_default"
            onClick={() =>
              navigate(
                props.routes.claimDocuments.getLink({
                  projectId: props.projectId,
                  partnerId: props.partnerId,
                  periodId: props.periodId,
                }).path,
              )
            }
            disabled={isNonEditable}
          >
            <Content value={x => x.pages.claimPrepare.buttonSaveAndContinue} />
          </Button>
          <Button
            secondary
            name="button_save"
            onClick={() => {
              navigate(backLink.path);
            }}
          >
            <Content value={x => x.pages.claimPrepare.buttonSaveAndReturn} />
          </Button>
        </Fieldset>
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

import { useNavigate } from "react-router-dom";

import { useStores } from "@ui/redux";
import {
  createTypedForm,
  Page,
  PageLoader,
  Content,
  BackLink,
  Projects,
  ValidationMessage,
  Section,
  Claims,
  Accordion,
  AccordionItem,
  Logs,
} from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { ClaimDtoValidator } from "@ui/validators/claimDtoValidator";
import { Pending } from "@shared/pending";
import {
  ClaimDto,
  ClaimOverrideRateDto,
  ClaimStatusChangeDto,
  CostsSummaryForPeriodDto,
  getAuthRoles,
  ILinkInfo,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ClaimDrawdownTable } from "./components/ClaimDrawdownTable";
import { AwardRateOverridesMessage } from "@ui/components/claims";
import { useClaimPreparePageData } from "./claimPrepare.logic";

export interface PrepareClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

interface Data {
  project: Pick<ProjectDto, "roles" | "id" | "projectNumber" | "title" | "isNonFec" | "competitionType">;
  partner: Pick<PartnerDto, "id" | "organisationType">;
  costCategories: Pick<CostCategoryDto, "id" | "name" | "competitionType" | "organisationType">[];
  claim: Pick<ClaimDto, "isFinalClaim" | "periodId" | "periodEndDate" | "periodStartDate">;
  claimOverrides: ClaimOverrideRateDto;
  claimDetails: Pick<
    CostsSummaryForPeriodDto,
    | "costCategoryId"
    | "remainingOfferCosts"
    | "forecastThisPeriod"
    | "costsClaimedThisPeriod"
    | "costsClaimedToDate"
    | "offerTotal"
  >[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
  statusChanges: Pick<ClaimStatusChangeDto, "newStatusLabel" | "createdBy" | "createdDate" | "comments">[];
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ClaimDto, link?: ILinkInfo) => void;
}

const Form = createTypedForm<ClaimDto>();

const PrepareComponent = (props: BaseProps & Callbacks & Data & PrepareClaimParams) => {
  const { isPm } = getAuthRoles(props.project.roles);

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
      error={props.editor.error}
      validator={props.editor.validator}
      pageTitle={<Projects.Title projectNumber={props.project.projectNumber} title={props.project.title} />}
    >
      <AwardRateOverridesMessage claimOverrides={props.claimOverrides} isNonFec={props.project.isNonFec} />
      {props.claim.isFinalClaim && <ValidationMessage messageType="info" message={x => x.claimsMessages.finalClaim} />}

      <Section title={<Claims.ClaimPeriodDate claim={props.claim} />}>
        <Claims.ClaimTable
          {...props}
          validation={props.editor.validator.totalCosts}
          getLink={costCategoryId =>
            props.routes.prepareClaimLineItems.getLink({
              partnerId: props.partnerId,
              projectId: props.projectId,
              periodId: props.periodId,
              costCategoryId,
            })
          }
        />
        <Form.Form
          qa="prepareClaimForm"
          editor={props.editor}
          onChange={dto => props.onUpdate(false, dto)}
          onSubmit={() =>
            props.onUpdate(
              true,
              props.editor.data,
              props.routes.claimDocuments.getLink({
                projectId: props.projectId,
                partnerId: props.partnerId,
                periodId: props.periodId,
              }),
            )
          }
        >
          <ClaimDrawdownTable {...props.project} requiredPeriod={props.periodId} />

          <Accordion>
            <AccordionItem title={x => x.claimsLabels.accordionTitleClaimLog} qa="status-and-comments-log">
              <Logs qa="claim-status-change-table" data={props.statusChanges} />
            </AccordionItem>
          </Accordion>

          <Form.Fieldset qa="save-and-continue">
            <Form.Submit>
              <Content value={x => x.pages.claimPrepare.buttonSaveAndContinue} />
            </Form.Submit>
            <Form.Button name="save" onClick={() => props.onUpdate(true, props.editor.data, backLink)}>
              <Content value={x => x.pages.claimPrepare.buttonSaveAndReturn} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </Section>
    </Page>
  );
};

const PrepareContainer = (props: PrepareClaimParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  const combined = Pending.combine({
    editor: stores.claims.getClaimEditor(false, props.projectId, props.partnerId, props.periodId),
  });

  const gqlData = useClaimPreparePageData(props.projectId, props.partnerId, props.periodId);

  const onUpdate = (saving: boolean, dto: Partial<ClaimDto>, link?: { path: string }) => {
    stores.claims.updateClaimEditor(
      false,
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      dto as ClaimDto,
      undefined,
      () => link && navigate(link.path),
    );
  };

  return (
    <PageLoader
      pending={combined}
      render={data => <PrepareComponent onUpdate={onUpdate} {...gqlData} {...data} {...props} />}
    />
  );
};

export const PrepareClaimRoute = defineRoute({
  routeName: "prepareClaim",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
  container: PrepareContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimPrepare.title),
});

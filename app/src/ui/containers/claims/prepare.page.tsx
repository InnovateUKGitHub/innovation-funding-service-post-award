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
  Loader,
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

export interface PrepareClaimParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

interface Data {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimOverrides: ClaimOverrideRateDto;
  claimDetails: CostsSummaryForPeriodDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ClaimDto, link?: ILinkInfo) => void;
}

const Form = createTypedForm<ClaimDto>();

const PrepareComponent = (props: BaseProps & Callbacks & Data & PrepareClaimParams) => {
  const data = props;
  return (
    <Page
      backLink={
        <BackLink route={getBackLink(data.project, data.partner, props.routes)}>
          <Content value={x => x.pages.claimPrepare.backLink} />
        </BackLink>
      }
      error={data.editor.error}
      validator={data.editor.validator}
      pageTitle={<Projects.Title {...data.project} />}
    >
      <AwardRateOverridesMessage claimOverrides={data.claimOverrides} isNonFec={data.project.isNonFec} />
      {data.claim.isFinalClaim && <ValidationMessage messageType="info" message={x => x.claimsMessages.finalClaim} />}
      {renderDetailsSection(props)}
    </Page>
  );
};

const renderDetailsSection = (props: Data & BaseProps & PrepareClaimParams & Callbacks) => {
  return (
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

        {renderLogsSection(props.statusChanges)}

        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>
            <Content value={x => x.pages.claimPrepare.buttonSaveAndContinue} />
          </Form.Submit>
          <Form.Button
            name="save"
            onClick={() =>
              props.onUpdate(true, props.editor.data, getBackLink(props.project, props.partner, props.routes))
            }
          >
            <Content value={x => x.pages.claimPrepare.buttonSaveAndReturn} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </Section>
  );
};

const getBackLink = (project: ProjectDto, partner: PartnerDto, routes: BaseProps["routes"]) => {
  const { isPm } = getAuthRoles(project.roles);

  return isPm
    ? routes.allClaimsDashboard.getLink({ projectId: project.id })
    : routes.claimsDashboard.getLink({ projectId: project.id, partnerId: partner.id });
};

const renderLogsSection = (pendingStatusChanges: Data["statusChanges"]) => {
  return (
    <Accordion>
      <AccordionItem title={x => x.claimsLabels.accordionTitleClaimLog} qa="status-and-comments-log">
        {/* Keeping logs inside loader because accordion defaults to closed*/}
        <Loader
          pending={pendingStatusChanges}
          render={statusChanges => <Logs qa="claim-status-change-table" data={statusChanges} />}
        />
      </AccordionItem>
    </Accordion>
  );
};

const PrepareContainer = (props: PrepareClaimParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partner: stores.partners.getById(props.partnerId),
    costCategories: stores.costCategories.getAllFiltered(props.partnerId),
    claim: stores.claims.get(props.partnerId, props.periodId),
    claimOverrides: stores.claimOverrides.getAllByPartner(props.partnerId),
    claimDetails: stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId),
    editor: stores.claims.getClaimEditor(false, props.projectId, props.partnerId, props.periodId),
  });

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

  const statusChanges = stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId);

  return (
    <PageLoader
      pending={combined}
      render={data => <PrepareComponent statusChanges={statusChanges} onUpdate={onUpdate} {...props} {...data} />}
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

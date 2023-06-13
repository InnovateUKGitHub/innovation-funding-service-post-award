import { useNavigate } from "react-router-dom";

import { useStores } from "@ui/redux";
import * as ACC from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
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
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claim: Pending<ClaimDto>;
  claimOverrides: Pending<ClaimOverrideRateDto>;
  costsSummaryForPeriod: Pending<CostsSummaryForPeriodDto[]>;
  editor: Pending<IEditorStore<ClaimDto, ClaimDtoValidator>>;
  statusChanges: Pending<ClaimStatusChangeDto[]>;
}

interface Callbacks {
  onUpdate: (saving: boolean, dto: ClaimDto, link?: ILinkInfo) => void;
}

interface CombinedData {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimOverrides: ClaimOverrideRateDto;
  claimDetails: CostsSummaryForPeriodDto[];
  editor: IEditorStore<ClaimDto, ClaimDtoValidator>;
}

const Form = ACC.createTypedForm<ClaimDto>();

class PrepareComponent extends ContainerBase<PrepareClaimParams, Data, Callbacks> {
  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      partner: this.props.partner,
      costCategories: this.props.costCategories,
      claim: this.props.claim,
      claimOverrides: this.props.claimOverrides,
      claimDetails: this.props.costsSummaryForPeriod,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents(data: CombinedData) {
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.getBackLink(data.project, data.partner)}>
            <ACC.Content value={x => x.pages.claimPrepare.backLink} />
          </ACC.BackLink>
        }
        error={data.editor.error}
        validator={data.editor.validator}
        pageTitle={<ACC.Projects.Title {...data.project} />}
      >
        <AwardRateOverridesMessage claimOverrides={data.claimOverrides} isNonFec={data.project.isNonFec} />
        {data.claim.isFinalClaim && (
          <ACC.ValidationMessage messageType="info" message={x => x.claimsMessages.finalClaim} />
        )}
        {this.renderDetailsSection(data)}
      </ACC.Page>
    );
  }

  private renderDetailsSection(data: CombinedData) {
    return (
      <ACC.Section title={<ACC.Claims.ClaimPeriodDate claim={data.claim} />}>
        <ACC.Claims.ClaimTable
          {...data}
          validation={data.editor.validator.totalCosts}
          getLink={costCategoryId =>
            this.props.routes.prepareClaimLineItems.getLink({
              partnerId: this.props.partnerId,
              projectId: this.props.projectId,
              periodId: this.props.periodId,
              costCategoryId,
            })
          }
        />
        <Form.Form
          qa="prepareClaimForm"
          editor={data.editor}
          onChange={dto => this.props.onUpdate(false, dto)}
          onSubmit={() =>
            this.props.onUpdate(
              true,
              data.editor.data,
              this.props.routes.claimDocuments.getLink({
                projectId: this.props.projectId,
                partnerId: this.props.partnerId,
                periodId: this.props.periodId,
              }),
            )
          }
        >
          <ClaimDrawdownTable {...data.project} requiredPeriod={this.props.periodId} />

          {this.renderLogsSection()}

          <Form.Fieldset qa="save-and-continue">
            <Form.Submit>
              <ACC.Content value={x => x.pages.claimPrepare.buttonSaveAndContinue} />
            </Form.Submit>
            <Form.Button
              name="save"
              onClick={() => this.props.onUpdate(true, data.editor.data, this.getBackLink(data.project, data.partner))}
            >
              <ACC.Content value={x => x.pages.claimPrepare.buttonSaveAndReturn} />
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Section>
    );
  }

  private getBackLink(project: ProjectDto, partner: PartnerDto) {
    const { isPm } = getAuthRoles(project.roles);

    return isPm
      ? this.props.routes.allClaimsDashboard.getLink({ projectId: project.id })
      : this.props.routes.claimsDashboard.getLink({ projectId: project.id, partnerId: partner.id });
  }

  private renderLogsSection() {
    return (
      <ACC.Accordion>
        <ACC.AccordionItem title={x => x.claimsLabels.accordionTitleClaimLog} qa="status-and-comments-log">
          {/* Keeping logs inside loader because accordion defaults to closed*/}
          <ACC.Loader
            pending={this.props.statusChanges}
            render={statusChanges => <ACC.Logs qa="claim-status-change-table" data={statusChanges} />}
          />
        </ACC.AccordionItem>
      </ACC.Accordion>
    );
  }
}

const PrepareContainer = (props: PrepareClaimParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  return (
    <PrepareComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      partner={stores.partners.getById(props.partnerId)}
      costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
      claim={stores.claims.get(props.partnerId, props.periodId)}
      claimOverrides={stores.claimOverrides.getAllByPartner(props.partnerId)}
      costsSummaryForPeriod={stores.costsSummaries.getForPeriod(props.projectId, props.partnerId, props.periodId)}
      statusChanges={stores.claims.getStatusChanges(props.projectId, props.partnerId, props.periodId)}
      editor={stores.claims.getClaimEditor(false, props.projectId, props.partnerId, props.periodId)}
      onUpdate={(saving, dto, link) =>
        stores.claims.updateClaimEditor(
          false,
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          dto,
          undefined,
          () => link && navigate(link.path),
        )
      }
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

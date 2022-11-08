import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { CostCategoryVirementDto, FinancialVirementDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { CostCategoryVirementDtoValidator, FinancialVirementDtoValidator } from "@ui/validators";
import { createDto } from "@framework/util/dtoHelpers";
import { roundCurrency } from "@framework/util";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks";
import { getAuthRoles } from "@framework/types";
import { EditorStatus } from "@ui/constants/enums";
import { PCRPrepareItemRoute } from "../pcrItemWorkflow";

export function useEditPageContent() {
  const { getContent } = useContent();

  return {
    summaryTitle: getContent(x => x.pages.financialVirementEdit.summaryTitle),
    saveButton: getContent(x => x.pages.financialVirementEdit.saveButton),

    introMessage: getContent(x => x.pages.financialVirementEdit.editPageMessage.intro),
    virementsMessage: getContent(x => x.pages.financialVirementEdit.editPageMessage.virements),
    requestsMessage: getContent(x => x.pages.financialVirementEdit.editPageMessage.requests),

    costCategoryName: getContent(x => x.financialVirementLabels.costCategoryName),
    costCategoryOriginalEligibleCosts: getContent(x => x.financialVirementLabels.costCategoryOriginalEligibleCosts),
    costCategoryCostsClaimed: getContent(x => x.financialVirementLabels.costCategoryCostsClaimed),
    costCategoryNewEligibleCosts: getContent(x => x.financialVirementLabels.costCategoryNewEligibleCosts),
    costCategoryDifferenceCosts: getContent(x => x.financialVirementLabels.costCategoryDifferenceCosts),
    partnerTotals: getContent(x => x.financialVirementLabels.partnerTotals),
    projectOriginalEligibleCosts: getContent(x => x.financialVirementLabels.projectOriginalEligibleCosts),
    projectNewEligibleCosts: getContent(x => x.financialVirementLabels.projectNewEligibleCosts),
    projectDifferenceCosts: getContent(x => x.financialVirementLabels.projectDifferenceCosts),
    projectOriginalRemainingGrant: getContent(x => x.financialVirementLabels.projectOriginalRemainingGrant),
    projectNewRemainingGrant: getContent(x => x.financialVirementLabels.projectNewRemainingGrant),
    projectDifferenceGrant: getContent(x => x.financialVirementLabels.projectDifferenceGrant),
    backToSummary: getContent(x => x.financialVirementLabels.backToSummary),
  };
}

export interface VirementCostsParams {
  projectId: string;
  partnerId: string;
  pcrId: string;
  itemId: string;
}

interface EditPageBaseProps extends VirementCostsParams {
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

interface EditPagePendingProps extends EditPageBaseProps {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
}

interface EditPageProps extends EditPageBaseProps {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  editor: IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>;
}

interface EditPageInputRowProps {
  costCategory: CostCategoryDto;
  virement: CostCategoryVirementDto;
  disabled: boolean;
  validation: CostCategoryVirementDtoValidator | null;
  updateValue: (costCategory: CostCategoryDto, value: number | null) => void;
}

/**
 * A loading page, which waits for essential data to be loaded first before displaying the edit page.
 *
 * @returns A loading screen for the edit page
 */
const EditPageLoader = ({ project, partner, costCategories, editor, ...props }: EditPagePendingProps) => {
  const combined = Pending.combine({
    project: project,
    partner: partner,
    costCategories: costCategories,
    editor: editor,
  });

  return <ACC.PageLoader pending={combined} render={data => <EditPage {...props} {...data} />} />;
};

const VirementForm = ACC.createTypedForm<FinancialVirementDto>();

/**
 * A page for editing Loans virements for a PCR.
 *
 * @returns The Edit Page
 */
const EditPage = ({
  editor,
  costCategories,
  partner,
  partnerId,
  project,
  pcrId,
  projectId,
  itemId,
  onChange,
}: EditPageProps) => {
  const content = useEditPageContent();
  const currentPartnerVirement = editor.data.partners.find(x => x.partnerId === partnerId);
  if (!currentPartnerVirement) throw new Error(`Cannot find current partner virement matching ${partnerId}`);
  const partnerVirementsValidator = editor.validator.partners.results.find(x => x.model.partnerId === partnerId);

  const costCategoriesWithVirement = costCategories.map(x => ({
    costCategory: x,
    virement:
      currentPartnerVirement.virements.find(y => y.costCategoryId === x.id) ||
      createDto<CostCategoryVirementDto>({
        costCategoryId: x.id,
        costCategoryName: x.name,
      }),
  }));
  const validation = costCategories.map(
    x => partnerVirementsValidator?.virements.results.find(y => y.model.costCategoryId === x.id) || null,
  );
  const VirementTable = ACC.TypedTable<typeof costCategoriesWithVirement[0]>();
  const SummaryTable = ACC.TypedTable<FinancialVirementDto>();

  const { isPm } = getAuthRoles(project.roles);
  const { isKTP } = checkProjectCompetition(project.competitionType);
  const displayIntroMessage: boolean = isKTP && isPm;

  const updateValue = (costCategory: CostCategoryDto, value: number | null) => {
    const projectCosts = editor.data;
    if (!projectCosts) throw new Error("Cannot find projectCosts");
    const currentPartner = projectCosts.partners.find(x => x.partnerId === partner.id);
    if (!currentPartner) throw new Error(`Cannot find current partner matching ${partner.id}`);
    const costCategoryVirements = currentPartner.virements.find(x => x.costCategoryId === costCategory.id);
    if (!costCategoryVirements) throw new Error(`Cannot find cost category virements matching ${costCategory.id}`);
    costCategoryVirements.newEligibleCosts = value ?? 0;

    if (partner.overheadRate) {
      const calculatedCostCategoryIds = costCategories.filter(y => y.isCalculated).map(y => y.id);
      const related = currentPartner.virements.find(v => calculatedCostCategoryIds.indexOf(v.costCategoryId) !== -1);
      if (related) {
        // prevent newEligibleCosts from being calculated by SF
        related.newEligibleCosts = roundCurrency(
          (costCategoryVirements.newEligibleCosts || 0) * (partner.overheadRate / 100),
        );
      }
    }

    currentPartner.newEligibleCosts = currentPartner.virements.reduce((total, x) => total + x.newEligibleCosts, 0);
    const newRemainingCosts = currentPartner.newEligibleCosts - currentPartner.costsClaimedToDate;
    const newFundingPercentage = currentPartner.newFundingLevel / 100;
    currentPartner.newRemainingGrant = roundCurrency(newRemainingCosts * newFundingPercentage);

    projectCosts.newEligibleCosts = projectCosts.partners
      .filter(x => !!x.newEligibleCosts)
      .reduce((total, x) => total + x.newEligibleCosts, 0);
    projectCosts.newRemainingGrant = roundCurrency(
      projectCosts.partners.reduce((total, p) => total + p.newRemainingGrant, 0),
    );
    onChange(false, projectCosts);
  };

  return (
    <ACC.Page
      backLink={
        <ACC.BackLink
          route={PCRPrepareItemRoute.getLink({
            projectId: projectId,
            pcrId: pcrId,
            itemId: itemId,
          })}
        >
          <ACC.Content value={x => x.financialVirementLabels.backToSummary} />
        </ACC.BackLink>
      }
      pageTitle={<ACC.Projects.Title {...project} />}
      error={editor.error}
      validator={partnerVirementsValidator}
    >
      {displayIntroMessage && (
        <>
          <ACC.Renderers.SimpleString>{content.introMessage}</ACC.Renderers.SimpleString>
          <ACC.Renderers.SimpleString>{content.virementsMessage}</ACC.Renderers.SimpleString>
          <ACC.Renderers.SimpleString>{content.requestsMessage}</ACC.Renderers.SimpleString>
        </>
      )}

      <ACC.Section title={partner.name}>
        <VirementForm.Form
          editor={editor}
          onChange={dto => onChange(false, dto)}
          onSubmit={() => onChange(true, editor.data)}
          qa="virementForm"
        >
          <VirementForm.Fieldset>
            <VirementTable.Table qa="partnerVirements" data={costCategoriesWithVirement} validationResult={validation}>
              <VirementTable.String
                qa="costCategory"
                header={content.costCategoryName}
                value={x => x.costCategory.name}
                footer={content.partnerTotals}
              />
              <VirementTable.Currency
                qa="originalEligibleCosts"
                header={content.costCategoryOriginalEligibleCosts}
                value={x => x.virement.originalEligibleCosts}
                footer={<ACC.Renderers.Currency value={currentPartnerVirement.originalEligibleCosts} />}
              />
              <VirementTable.Currency
                qa="originalCostsClaimed"
                header={content.costCategoryCostsClaimed}
                value={x => x.virement.costsClaimedToDate}
                footer={<ACC.Renderers.Currency value={currentPartnerVirement.costsClaimedToDate} />}
              />
              <VirementTable.Custom
                qa="newEligibleCosts"
                header={content.costCategoryNewEligibleCosts}
                value={(x, i) => (
                  <EditPageInput
                    key={i.row}
                    costCategory={x.costCategory}
                    virement={x.virement}
                    disabled={editor.status === EditorStatus.Saving}
                    validation={validation[i.row]}
                    updateValue={updateValue}
                  />
                )}
                footer={<ACC.Renderers.Currency value={currentPartnerVirement.newEligibleCosts} />}
                classSuffix={"numeric"}
              />
              <VirementTable.Currency
                qa="difference"
                header={content.costCategoryDifferenceCosts}
                value={x => roundCurrency(x.virement.newEligibleCosts - x.virement.originalEligibleCosts)}
              />
            </VirementTable.Table>
          </VirementForm.Fieldset>
          <VirementForm.Fieldset heading={content.summaryTitle}>
            <SummaryTable.Table qa="summary-table" data={[editor.data]}>
              <SummaryTable.Currency
                qa="originalEligibleCosts"
                header={content.projectOriginalEligibleCosts}
                value={x => x.originalEligibleCosts}
              />
              <SummaryTable.Currency
                qa="newEligibleCosts"
                header={content.projectNewEligibleCosts}
                value={x => x.newEligibleCosts}
              />
              <SummaryTable.Currency
                qa="differenceEligibleCosts"
                header={content.projectDifferenceCosts}
                value={x => roundCurrency(x.newEligibleCosts - x.originalEligibleCosts)}
              />
              <SummaryTable.Currency
                qa="originalRemainingGrant"
                header={content.projectOriginalRemainingGrant}
                value={x => x.originalRemainingGrant}
              />
              <SummaryTable.Currency
                qa="newRemainingGrant"
                header={content.projectNewRemainingGrant}
                value={x => x.newRemainingGrant}
              />
              <SummaryTable.Currency
                qa="differenceRemainingGrant"
                header={content.projectDifferenceGrant}
                value={x => roundCurrency(x.newRemainingGrant - x.originalRemainingGrant)}
              />
            </SummaryTable.Table>
          </VirementForm.Fieldset>
          <VirementForm.Fieldset>
            <VirementForm.Submit>{content.saveButton}</VirementForm.Submit>
          </VirementForm.Fieldset>
        </VirementForm.Form>
      </ACC.Section>
    </ACC.Page>
  );
};

/**
 * An input element of <EditPage />, which either displays an input field, or a rendered text value,
 * depending on whether the cost category is automatically calculated or not.
 *
 * @returns An input element of the <EditPage /> table.
 */
const EditPageInput = ({ costCategory, validation, virement, disabled, updateValue }: EditPageInputRowProps) => {
  return (
    <>
      <ACC.ValidationError
        overrideMessage={`Invalid cost for ${costCategory.name}`}
        error={validation && validation.newPartnerEligibleCosts}
      />
      {costCategory.isCalculated ? (
        <ACC.Renderers.Currency value={virement.newEligibleCosts} />
      ) : (
        <ACC.Inputs.NumberInput
          name={virement.costCategoryId}
          value={virement.newEligibleCosts}
          onChange={val => updateValue(costCategory, val)}
          width="full"
          ariaLabel={virement.costCategoryName}
          disabled={disabled}
        />
      )}
    </>
  );
};

/**
 * A financial virement editing page for Loans PCRs
 *
 * @returns A wrapper for <EditPage />
 */
const Container = (props: VirementCostsParams & BaseProps) => {
  const { projects, partners, costCategories, financialVirements } = useStores();
  const navigate = useNavigate();

  return (
    <EditPageLoader
      project={projects.getById(props.projectId)}
      partner={partners.getById(props.partnerId)}
      costCategories={costCategories.getAllForPartner(props.partnerId)}
      editor={financialVirements.getFinancialVirementEditor(
        props.projectId,
        props.pcrId,
        props.itemId,
        props.partnerId,
      )}
      onChange={(saving, dto) =>
        financialVirements.updateFinancialVirementEditor(
          saving,
          props.projectId,
          props.pcrId,
          props.itemId,
          dto,
          false,
          () =>
            navigate(
              props.routes.pcrPrepareItem.getLink({
                projectId: props.projectId,
                pcrId: props.pcrId,
                itemId: props.itemId,
              }).path,
            ),
          props.partnerId,
        )
      }
      {...props}
    />
  );
};

export const FinancialVirementEditRoute = defineRoute({
  // pm reallocates costs for participant at cost category level
  routeName: "financial-virement-edit",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/financial/:partnerId",
  container: Container,
  getParams: route => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
    partnerId: route.params.partnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.financialVirementEdit.title),
});

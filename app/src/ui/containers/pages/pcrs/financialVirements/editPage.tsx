import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryVirementDto, FinancialVirementDto } from "@framework/dtos/financialVirementDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { getAuthRoles } from "@framework/types/authorisation";
import { createDto } from "@framework/util/dtoHelpers";
import { roundCurrency, sumBy } from "@framework/util/numberHelper";
import { Pending } from "@shared/pending";
import { capitalizeFirstWord } from "@shared/string-helpers";
import {
  AwardRateOverrideLabel,
  AwardRateOverridesMessage,
} from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { NumberInput } from "@ui/components/bjss/inputs/numberInput";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ValidationError } from "@ui/components/atomicDesign/molecules/validation/ValidationError/validationError";
import { EditorStatus } from "@ui/redux/constants/enums";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import {
  CostCategoryVirementDtoValidator,
  FinancialVirementDtoValidator,
} from "@ui/validation/validators/financialVirementDtoValidator";
import { useNavigate } from "react-router-dom";
import { PCRPrepareItemRoute } from "../pcrItemWorkflowContainer";

/**
 * hook to return edit page content
 */
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
    costCategoryAwardRate: getContent(x => x.financialVirementLabels.costCategoryAwardRate),
    costCategoryNewRemainingGrant: getContent(x => x.financialVirementLabels.costCategoryNewRemainingGrant),
    costCategoryOriginalRemainingGrant: getContent(x => x.financialVirementLabels.costCategoryOriginalRemainingGrant),
  };
}

export interface VirementCostsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  pcrId: PcrId;
  itemId: PcrItemId;
}

interface EditPageBaseProps extends VirementCostsParams {
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

interface EditPagePendingProps extends EditPageBaseProps {
  project: Pending<ProjectDto>;
  partner: Pending<PartnerDto>;
  costCategories: Pending<CostCategoryDto[]>;
  claimOverrides: Pending<ClaimOverrideRateDto>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
}

interface EditPageProps extends EditPageBaseProps {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claimOverrides: ClaimOverrideRateDto;
  editor: IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>;
}

interface VirementData {
  costCategory: CostCategoryDto;
  virement: CostCategoryVirementDto;
  fundingLevel: number;
  originalRemainingGrant: number;
  newRemainingGrant: number;
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
 */
const EditPageLoader = ({
  project,
  partner,
  costCategories,
  editor,
  claimOverrides,
  ...props
}: EditPagePendingProps) => {
  const combined = Pending.combine({
    project: project,
    partner: partner,
    costCategories: costCategories,
    editor: editor,
    claimOverrides,
  });

  return <PageLoader pending={combined} render={data => <EditPage {...props} {...data} />} />;
};

const VirementForm = createTypedForm<FinancialVirementDto>();
const SummaryTable = createTypedTable<FinancialVirementDto>();
const VirementTable = createTypedTable<VirementData>();

/**
 * A page for editing Loans virements for a PCR.
 */
const EditPage = ({
  editor,
  costCategories,
  claimOverrides,
  partner,
  partnerId,
  project,
  pcrId,
  projectId,
  itemId,
  onChange,
}: EditPageProps) => {
  const content = useEditPageContent();

  /*
   * get the data for the currently selected partner
   * and get the matching validator
   */
  const currentPartnerVirement = editor.data.partners.find(x => x.partnerId === partnerId);
  if (!currentPartnerVirement) throw new Error(`Cannot find current partner virement matching ${partnerId}`);
  const partnerVirementsValidator = editor.validator.partners.results.find(x => x.model.partnerId === partnerId);

  /*
   * maps the costCategories to include the virement data
   * and also includes the new remaining grant
   */
  const costCategoriesWithVirement = costCategories.map(x => {
    const overrideFundingLevel =
      claimOverrides.type === AwardRateOverrideType.BY_COST_CATEGORY
        ? claimOverrides.overrides.find(y => y.costCategoryId === x.id)?.amount
        : undefined;
    const fundingLevel = overrideFundingLevel ?? currentPartnerVirement.originalFundingLevel;

    const virement =
      currentPartnerVirement.virements.find(y => y.costCategoryId === x.id) ||
      createDto<CostCategoryVirementDto>({
        costCategoryId: x.id,
        costCategoryName: x.name,
      });

    return {
      costCategory: x,
      virement,
      fundingLevel,
      originalRemainingGrant: roundCurrency((fundingLevel / 100) * virement.originalEligibleCosts),
      newRemainingGrant: roundCurrency((fundingLevel / 100) * virement.newEligibleCosts),
    };
  });

  const validation = costCategories.map(
    x => partnerVirementsValidator?.virements.results.find(y => y.model.costCategoryId === x.id) || null,
  );

  const { isPm } = getAuthRoles(project.roles);
  const { isKTP } = checkProjectCompetition(project.competitionType);
  const displayIntroMessage: boolean = isKTP && isPm;

  const updateValue = (costCategory: CostCategoryDto, value: number | null) => {
    /*
     * get the financial virements data for the project
     */
    const projectCosts = editor.data;
    if (!projectCosts) throw new Error("Cannot find projectCosts");

    /*
     * get the data for the currently selected partner
     */
    const currentPartner = projectCosts.partners.find(x => x.partnerId === partner.id);
    if (!currentPartner) throw new Error(`Cannot find current partner matching ${partner.id}`);

    /*
     * get the currently edited virement
     */
    const costCategoryVirements = currentPartner.virements.find(x => x.costCategoryId === costCategory.id);
    if (!costCategoryVirements) throw new Error(`Cannot find cost category virements matching ${costCategory.id}`);

    /*
     * evaluate the funding level
     */
    const overrideFundingLevel =
      claimOverrides.type === AwardRateOverrideType.BY_COST_CATEGORY
        ? claimOverrides.overrides.find(y => y.costCategoryId === costCategory.id)?.amount
        : undefined;
    const fundingLevel = overrideFundingLevel ?? currentPartnerVirement.originalFundingLevel;

    /**
     * mutate the selected costCategoryVirement data to include the newly updated remaining grant using the following business logic
     * `((new eligible costs - Costs claimed to date) x Award rate for Cost cat) - ((original eligible costs - cost claimed to date) x Award rate for cost cat)`
     */
    costCategoryVirements.newEligibleCosts = value ?? 0;
    costCategoryVirements.newRemainingCosts =
      costCategoryVirements.newEligibleCosts - costCategoryVirements.costsClaimedToDate;

    costCategoryVirements.newRemainingGrant = roundCurrency(
      costCategoryVirements.newRemainingCosts * (fundingLevel / 100),
    );

    /*
     * This section finds out the related newEligibleCosts if a partner has a separate overheadRate
     * and mutates the partner newEligibleCosts
     */
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

    /*
     * Total up the currentPartner total new eligible costs by summing the virements new Eligible costs
     * Total up the currentPartner total new remaining grant by summing virements new remaining grant
     */
    currentPartner.newEligibleCosts = currentPartner.virements.reduce((total, x) => total + x.newEligibleCosts, 0);
    currentPartner.newRemainingGrant = sumBy(currentPartner.virements, x => x.newRemainingGrant);

    /*
     * Total the projects new eligible costs by adding up the costs for all the partners
     */
    projectCosts.newEligibleCosts = projectCosts.partners
      .filter(x => !!x.newEligibleCosts)
      .reduce((total, x) => total + x.newEligibleCosts, 0);

    /**
     * Total the projects new total remaining grant by summing the total new remaining grants for all partners
     */
    projectCosts.newRemainingGrant = roundCurrency(
      projectCosts.partners.reduce((total, p) => total + p.newRemainingGrant, 0),
    );

    onChange(false, projectCosts);
  };

  return (
    <Page
      backLink={
        <BackLink
          route={PCRPrepareItemRoute.getLink({
            projectId: projectId,
            pcrId: pcrId,
            itemId: itemId,
          })}
        >
          <Content value={x => x.financialVirementLabels.backToSummary} />
        </BackLink>
      }
      pageTitle={<Title {...project} />}
      error={editor.error}
      validator={[partnerVirementsValidator, editor.validator]}
    >
      <AwardRateOverridesMessage
        claimOverrides={claimOverrides}
        isNonFec={project.isNonFec}
        overrideLabel={AwardRateOverrideLabel.PROJECT}
      />
      {displayIntroMessage && (
        <>
          <SimpleString>{content.introMessage}</SimpleString>
          <SimpleString>{content.virementsMessage}</SimpleString>
          <SimpleString>{content.requestsMessage}</SimpleString>
        </>
      )}

      <Section title={partner.name}>
        <VirementForm.Form
          editor={editor}
          onChange={dto => onChange(false, dto)}
          onSubmit={() => onChange(true, editor.data)}
          qa="virementForm"
        >
          <VirementForm.Fieldset>
            <VirementTable.Table qa="partnerVirements" data={costCategoriesWithVirement} validationResult={validation}>
              {[
                <VirementTable.String
                  key="costCategory"
                  qa="costCategory"
                  header={content.costCategoryName}
                  value={x => capitalizeFirstWord(x.costCategory.name)}
                  footer={content.partnerTotals}
                />,
                <VirementTable.Currency
                  key="originalEligibleCosts"
                  qa="originalEligibleCosts"
                  header={content.costCategoryOriginalEligibleCosts}
                  value={x => x.virement.originalEligibleCosts}
                  footer={<Currency value={currentPartnerVirement.originalEligibleCosts} />}
                />,
                <VirementTable.Currency
                  key="originalCostsClaimed"
                  qa="originalCostsClaimed"
                  header={content.costCategoryCostsClaimed}
                  value={x => x.virement.costsClaimedToDate}
                  footer={<Currency value={currentPartnerVirement.costsClaimedToDate} />}
                />,
                <VirementTable.Custom
                  key="newEligibleCosts"
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
                  footer={<Currency value={currentPartnerVirement.newEligibleCosts} />}
                  classSuffix={"numeric"}
                />,
                <VirementTable.Currency
                  key="difference"
                  qa="difference"
                  header={content.costCategoryDifferenceCosts}
                  value={x => roundCurrency(x.virement.newEligibleCosts - x.virement.originalEligibleCosts)}
                  footer={
                    <Currency
                      value={roundCurrency(
                        currentPartnerVirement.newEligibleCosts - currentPartnerVirement.originalEligibleCosts,
                      )}
                    />
                  }
                />,
                ...(project.isNonFec
                  ? [
                      <VirementTable.Currency
                        key="original-remaining-grant"
                        qa="original-remaining-grant"
                        header={content.costCategoryOriginalRemainingGrant}
                        value={x => x.originalRemainingGrant}
                        footer={<Currency value={currentPartnerVirement.originalRemainingGrant} />}
                      />,

                      <VirementTable.Percentage
                        key="award-grant"
                        qa="award-grant"
                        header={content.costCategoryAwardRate}
                        value={x => x.fundingLevel}
                      />,

                      <VirementTable.Currency
                        key="new-remaining-grant"
                        qa="new-remaining-grant"
                        header={content.costCategoryNewRemainingGrant}
                        value={x => x.newRemainingGrant}
                        footer={<Currency value={currentPartnerVirement.newRemainingGrant} />}
                      />,
                    ]
                  : []),
              ]}
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
      </Section>
    </Page>
  );
};

/**
 * An input element of <EditPage />, which either displays an input field, or a rendered text value,
 * depending on whether the cost category is automatically calculated or not.
 */
const EditPageInput = ({ costCategory, validation, virement, disabled, updateValue }: EditPageInputRowProps) => {
  return (
    <>
      <ValidationError
        overrideMessage={`Invalid cost for ${costCategory.name}`}
        error={validation && validation.newPartnerEligibleCosts}
      />
      {costCategory.isCalculated ? (
        <Currency value={virement.newEligibleCosts} />
      ) : (
        <NumberInput
          name={virement.costCategoryId}
          value={virement.newEligibleCosts}
          onChange={val => updateValue(costCategory, val)}
          width="full"
          ariaLabel={virement.costCategoryName}
          disabled={disabled}
          enforceValidInput
        />
      )}
    </>
  );
};

/**
 * A financial virement editing page for Loans PCRs
 */
const Container = (props: VirementCostsParams & BaseProps) => {
  const { projects, partners, costCategories, financialVirements, claimOverrides } = useStores();
  const navigate = useNavigate();

  return (
    <EditPageLoader
      project={projects.getById(props.projectId)}
      partner={partners.getById(props.partnerId)}
      costCategories={costCategories.getAllForPartner(props.partnerId)}
      claimOverrides={claimOverrides.getAllByPartner(props.partnerId)}
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
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.financialVirementEdit.title),
});

import { Pending } from "@shared/pending";
import { useContent } from "@ui/hooks/content.hook";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { useProjectParticipants } from "@ui/features/project-participants";
import { ProjectReallocationCosts } from "../components/PcrSummary/pcr-summary.interface";
import { PCRStepId, PCRItemType } from "@framework/constants/pcrConstants";
import { FinancialVirementDto, PartnerVirementsDto } from "@framework/dtos/financialVirementDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRItemForMultiplePartnerFinancialVirementDto, PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { roundCurrency } from "@framework/util/numberHelper";
import { Content } from "@ui/components/content";
import { EmailContent } from "@ui/components/emailContent";
import { FormBuilder } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { TextHint } from "@ui/components/layout/textHint";
import { getPartnerName } from "@ui/components/partners/partnerName";
import { Currency, getCurrency } from "@ui/components/renderers/currency";
import { Percentage } from "@ui/components/renderers/percentage";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { createTypedTable } from "@ui/components/table";
import { ValidationMessage } from "@ui/components/validationMessage";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MultiplePartnerFinancialVirementDtoValidator, PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { PcrSummaryConsumer } from "../components/PcrSummary/PcrSummary";
import { Link } from "@ui/components/links";
import { Loader } from "@ui/components/loading";

export interface FinancialVirementSummaryProps
  extends PcrSummaryProps<
    PCRItemForMultiplePartnerFinancialVirementDto,
    MultiplePartnerFinancialVirementDtoValidator,
    PCRStepId.none
  > {
  virement: Pending<FinancialVirementDto>;
}
const Table = createTypedTable<ProjectReallocationCosts>();

export const FinancialVirementSummaryComponent = ({ mode, ...props }: FinancialVirementSummaryProps) => {
  const { getContent } = useContent();
  const { isMultipleParticipants } = useProjectParticipants();
  const { isNonFec } = props.project;

  const getPartnerLink = (partnerVirement: PartnerVirementsDto, partner: PartnerDto) => {
    const params = {
      projectId: props.projectId,
      partnerId: partnerVirement.partnerId,
      pcrId: props.pcr.id,
      itemId: props.pcrItem.id,
    };

    const route =
      mode === "prepare"
        ? props.routes.pcrFinancialVirementEditCostCategoryLevel.getLink(params)
        : props.routes.pcrFinancialVirementDetails.getLink({ ...params, mode });

    return <Link route={route}>{getPartnerName(partner, true)}</Link>;
  };

  const getGrantMessage = (
    hasMatchingGrant: boolean,
    hasAvailableGrant: boolean,
    originalGrant: number,
    newGrantDifference: number,
  ): string | undefined => {
    // Note: bail out if there is no difference
    if (hasMatchingGrant) return undefined;

    const grantDifference = getCurrency(Math.abs(newGrantDifference));

    if (hasAvailableGrant) {
      return getContent(x => x.pages.financialVirementSummary.availableGrantMessage({ grantDifference }));
    }

    const totalOriginalGrant = getCurrency(Math.abs(originalGrant));

    return getContent(x =>
      x.pages.financialVirementSummary.unavailableGrantMessage({ grantDifference, totalOriginalGrant }),
    );
  };

  const renderContent = (virement: FinancialVirementDto) => (
    <PcrSummaryConsumer>
      {({ isSummaryValid, data }) => {
        if (!data) throw Error("There was an error fetching the partner costs.");

        const grantMessage = getGrantMessage(
          data.hasMatchingGrant,
          data.hasAvailableGrant,
          data.totalOriginalGrant,
          data.newGrantDifference,
        );

        const displayHighlight = !!grantMessage && (isSummaryValid ? "positive-hightlight" : "negative-hightlight");

        const projectCostsOfPartners = data.projectCostsOfPartners;

        return (
          <>
            {grantMessage && (
              <ValidationMessage
                markdown
                message={grantMessage}
                messageType={data.hasAvailableGrant ? "info" : "error"}
              />
            )}

            {mode === "prepare" ? (
              <>
                <Table.Table qa="partners" data={projectCostsOfPartners}>
                  <Table.Custom
                    qa="partner"
                    header={x => x.financialVirementLabels.partnerName}
                    value={x => getPartnerLink(x.partnerVirement, x.partner)}
                    footer={<Content value={x => x.financialVirementLabels.projectTotals} />}
                    isDivider="normal"
                  />
                  <Table.Currency
                    qa="originalEligibleCosts"
                    header={x => x.financialVirementLabels.partnerOriginalEligibleCosts}
                    value={x => x.partnerVirement.originalEligibleCosts}
                    footer={<Currency value={virement.originalEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="originalRemaining"
                    header={x => x.financialVirementLabels.partnerOriginalRemainingCosts}
                    value={x => x.partnerVirement.originalRemainingCosts}
                    footer={<Currency value={virement.originalRemainingCosts} />}
                  />
                  <Table.Currency
                    qa="originalRemainingGrant"
                    header={x => x.financialVirementLabels.partnerOriginalRemainingGrant}
                    value={x => x.partnerVirement.originalRemainingGrant}
                    footer={
                      <Currency
                        value={virement.originalRemainingGrant}
                        className={displayHighlight === "positive-hightlight" && "highlight--info"}
                      />
                    }
                    isDivider="normal"
                  />
                  <Table.Currency
                    qa="newEligibleCosts"
                    header={x => x.financialVirementLabels.partnerNewEligibleCosts}
                    value={x => x.partnerVirement.newEligibleCosts}
                    footer={<Currency value={virement.newEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="newRemainingCosts"
                    header={x => x.financialVirementLabels.partnerNewRemainingCosts}
                    value={x => x.partnerVirement.newRemainingCosts}
                    footer={<Currency value={virement.newRemainingCosts} />}
                  />
                  <Table.Currency
                    qa="newRemainingGrant"
                    header={x => x.financialVirementLabels.partnerNewRemainingGrant}
                    value={x => x.partnerVirement.newRemainingGrant}
                    footer={
                      <Currency
                        value={virement.newRemainingGrant}
                        className={displayHighlight === "negative-hightlight" && "highlight--error"}
                      />
                    }
                  />
                </Table.Table>

                {isMultipleParticipants && isNonFec ? (
                  <>
                    <SimpleString>
                      <Content
                        components={[
                          <EmailContent
                            key="email"
                            value={x => x.pages.financialVirementSummary.nonFecGrantAdviceChangeEmail}
                          />,
                        ]}
                        value={x => x.pages.financialVirementSummary.nonFecGrantAdvice}
                      />
                    </SimpleString>
                  </>
                ) : (
                  <>
                    <SimpleString>
                      <Content value={x => x.pages.financialVirementSummary.grantAdvice} />
                    </SimpleString>

                    <Section qa="edit-partner-level">
                      <Link
                        styling="SecondaryButton"
                        route={props.routes.pcrFinancialVirementEditPartnerLevel.getLink({
                          itemId: props.pcrItem.id,
                          pcrId: props.pcr.id,
                          projectId: props.projectId,
                        })}
                      >
                        <Content value={x => x.pages.financialVirementSummary.linkChangeGrant} />
                      </Link>
                    </Section>
                  </>
                )}
              </>
            ) : (
              <>
                <Table.Table
                  qa="partners"
                  data={projectCostsOfPartners}
                  headerRowClass="govuk-body-s"
                  bodyRowClass={() => "govuk-body-s"}
                  footerRowClass="govuk-body-s"
                >
                  <Table.Custom
                    qa="partner"
                    header={x => x.financialVirementLabels.partnerName}
                    value={x => getPartnerLink(x.partnerVirement, x.partner)}
                    footer={<Content value={x => x.financialVirementLabels.projectTotals} />}
                    isDivider="normal"
                  />
                  <Table.Currency
                    qa="originalEligibleCosts"
                    header={x => x.financialVirementLabels.partnerOriginalEligibleCosts}
                    value={x => x.partnerVirement.originalEligibleCosts}
                    footer={<Currency value={virement.originalEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="newEligibleCosts"
                    header={x => x.financialVirementLabels.partnerNewEligibleCosts}
                    value={x => x.partnerVirement.newEligibleCosts}
                    footer={<Currency value={virement.newEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="differenceEligibleCosts"
                    header={x => x.financialVirementLabels.partnerDifferenceCosts}
                    value={x =>
                      roundCurrency(x.partnerVirement.newEligibleCosts - x.partnerVirement.originalEligibleCosts)
                    }
                    footer={
                      <Currency value={roundCurrency(virement.newEligibleCosts - virement.originalEligibleCosts)} />
                    }
                    isDivider="normal"
                  />
                  <Table.Percentage
                    qa="originalFundingLevel"
                    header={x => x.financialVirementLabels.originalFundingLevel}
                    value={x => x.partnerVirement.originalFundingLevel}
                    footer={<Percentage value={virement.originalFundingLevel} defaultIfInfinite={0} />}
                    defaultIfInfinite={0}
                  />
                  <Table.Percentage
                    qa="newFundingLevel"
                    header={x => x.financialVirementLabels.newFundingLevel}
                    value={x => x.partnerVirement.newFundingLevel}
                    footer={<Percentage value={virement.newFundingLevel} defaultIfInfinite={0} />}
                    defaultIfInfinite={0}
                    isDivider="normal"
                  />
                  <Table.Currency
                    qa="originalRemainingGrant"
                    header={x => x.financialVirementLabels.partnerOriginalRemainingGrant}
                    value={x => x.partnerVirement.originalRemainingGrant}
                    footer={<Currency value={virement.originalRemainingGrant} />}
                  />
                  <Table.Currency
                    qa="newRemainingGrant"
                    header={x => x.financialVirementLabels.partnerNewRemainingGrant}
                    value={x => x.partnerVirement.newRemainingGrant}
                    footer={<Currency value={virement.newRemainingGrant} />}
                  />
                  <Table.Currency
                    qa="differenceRemainingGrant"
                    header={x => x.financialVirementLabels.partnerDifferenceGrant}
                    value={x =>
                      roundCurrency(x.partnerVirement.newRemainingGrant - x.partnerVirement.originalRemainingGrant)
                    }
                    footer={
                      <Currency value={roundCurrency(virement.newRemainingGrant - virement.originalRemainingGrant)} />
                    }
                  />
                </Table.Table>

                <Section>
                  <SummaryList qa="pcr_financial-virement">
                    <SummaryListItem
                      qa="grantValueYearEnd"
                      label={x => x.pages.financialVirementSummary.headingYearEndGrantValue}
                      content={<Currency value={props.pcrItem.grantMovingOverFinancialYear} />}
                    />
                  </SummaryList>
                </Section>
              </>
            )}
          </>
        );
      }}
    </PcrSummaryConsumer>
  );

  const pendingPayload = Pending.combine({ virement: props.virement });
  return <Loader pending={pendingPayload} render={x => renderContent(x.virement)} />;
};

interface GrantMovingOverFinancialYearFormProps {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  form: FormBuilder<PCRItemDto>;
}

export const GrantMovingOverFinancialYearForm = ({ form: Form, editor }: GrantMovingOverFinancialYearFormProps) => {
  const targetPcrType = PCRItemType.MultiplePartnerFinancialVirement;

  const itemPcr = editor.data.items.find(
    x => x.type === targetPcrType,
  ) as PCRItemForMultiplePartnerFinancialVirementDto;
  const itemValidator = editor.validator.items.results.find(
    x => x.model.type === targetPcrType,
  ) as MultiplePartnerFinancialVirementDtoValidator;

  return (
    <Form.Fieldset
      qa="fieldset-grantMovingOverFinancialYear"
      heading={x => x.financialVirementLabels.grantMovingOverYear}
    >
      <TextHint>The financial year ends on 31 March.</TextHint>

      <Form.Numeric
        name="grantMovingOverFinancialYear"
        width={10}
        value={() => itemPcr.grantMovingOverFinancialYear}
        update={(_m, val) => (itemPcr.grantMovingOverFinancialYear = val)}
        validation={itemValidator.grantMovingOverFinancialYear}
      />
    </Form.Fieldset>
  );
};

export type FinancialVirementSummaryContainerProps = PcrSummaryProps<
  PCRItemForMultiplePartnerFinancialVirementDto,
  MultiplePartnerFinancialVirementDtoValidator,
  PCRStepId.none
>;

export const FinancialVirementSummary = (props: FinancialVirementSummaryContainerProps) => {
  const { financialVirements } = useStores();

  return (
    <FinancialVirementSummaryComponent
      {...props}
      virement={financialVirements.get(props.projectId, props.pcr.id, props.pcrItem.id)}
    />
  );
};

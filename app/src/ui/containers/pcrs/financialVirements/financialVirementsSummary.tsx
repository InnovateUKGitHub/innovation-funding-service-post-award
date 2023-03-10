import {
  FinancialVirementDto,
  PartnerDto,
  PartnerVirementsDto,
  PCRDto,
  PCRItemDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
} from "@framework/dtos";

import { Pending } from "@shared/pending";
import { IEditorStore, useStores } from "@ui/redux";
import { useContent } from "@ui/hooks";
import { MultiplePartnerFinancialVirementDtoValidator, PCRDtoValidator } from "@ui/validators";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemType } from "@framework/types";
import { roundCurrency } from "@framework/util";
import { useProjectParticipants } from "@ui/features/project-participants";
import * as ACC from "@ui/components";

import { PcrSummaryConsumer } from "../components/PcrSummary";
import { EmailContent } from "@ui/components";

export interface FinancialVirementSummaryProps
  extends PcrSummaryProps<
    PCRItemForMultiplePartnerFinancialVirementDto,
    MultiplePartnerFinancialVirementDtoValidator,
    ""
  > {
  virement: Pending<FinancialVirementDto>;
}

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

    return <ACC.Link route={route}>{ACC.getPartnerName(partner, true)}</ACC.Link>;
  };

  const getGrantMessage = (
    hasMatchingGrant: boolean,
    hasAvailableGrant: boolean,
    originalGrant: number,
    newGrantDifference: number,
  ): string | undefined => {
    // Note: bail out if there is no difference
    if (hasMatchingGrant) return undefined;

    const grantDifference = ACC.Renderers.getCurrency(Math.abs(newGrantDifference));

    if (hasAvailableGrant) {
      return getContent(x => x.pages.financialVirementSummary.availableGrantMessage({ grantDifference }));
    }

    const totalOriginalGrant = ACC.Renderers.getCurrency(Math.abs(originalGrant));

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
        const Table = ACC.TypedTable<typeof projectCostsOfPartners[0]>();

        return (
          <>
            {grantMessage && (
              <ACC.ValidationMessage
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
                    footer={<ACC.Content value={x => x.financialVirementLabels.projectTotals} />}
                    isDivider="normal"
                  />
                  <Table.Currency
                    qa="originalEligibleCosts"
                    header={x => x.financialVirementLabels.partnerOriginalEligibleCosts}
                    value={x => x.partnerVirement.originalEligibleCosts}
                    footer={<ACC.Renderers.Currency value={virement.originalEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="originalRemaining"
                    header={x => x.financialVirementLabels.partnerOriginalRemainingCosts}
                    value={x => x.partnerVirement.originalRemainingCosts}
                    footer={<ACC.Renderers.Currency value={virement.originalRemainingCosts} />}
                  />
                  <Table.Currency
                    qa="originalRemainingGrant"
                    header={x => x.financialVirementLabels.partnerOriginalRemainingGrant}
                    value={x => x.partnerVirement.originalRemainingGrant}
                    footer={
                      <ACC.Renderers.Currency
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
                    footer={<ACC.Renderers.Currency value={virement.newEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="newRemainingCosts"
                    header={x => x.financialVirementLabels.partnerNewRemainingCosts}
                    value={x => x.partnerVirement.newRemainingCosts}
                    footer={<ACC.Renderers.Currency value={virement.newRemainingCosts} />}
                  />
                  <Table.Currency
                    qa="newRemainingGrant"
                    header={x => x.financialVirementLabels.partnerNewRemainingGrant}
                    value={x => x.partnerVirement.newRemainingGrant}
                    footer={
                      <ACC.Renderers.Currency
                        value={virement.newRemainingGrant}
                        className={displayHighlight === "negative-hightlight" && "highlight--error"}
                      />
                    }
                  />
                </Table.Table>

                {isMultipleParticipants && isNonFec ? (
                  <>
                    <ACC.Renderers.SimpleString>
                      <ACC.Content
                        components={[
                          <EmailContent
                            key="email"
                            value={x => x.pages.financialVirementSummary.nonFecGrantAdviceChangeEmail}
                          />,
                        ]}
                        value={x => x.pages.financialVirementSummary.nonFecGrantAdvice}
                      />
                    </ACC.Renderers.SimpleString>
                  </>
                ) : (
                  <>
                    <ACC.Renderers.SimpleString>
                      <ACC.Content value={x => x.pages.financialVirementSummary.grantAdvice} />
                    </ACC.Renderers.SimpleString>

                    <ACC.Section qa="edit-partner-level">
                      <ACC.Link
                        styling="SecondaryButton"
                        route={props.routes.pcrFinancialVirementEditPartnerLevel.getLink({
                          itemId: props.pcrItem.id,
                          pcrId: props.pcr.id,
                          projectId: props.projectId,
                        })}
                      >
                        <ACC.Content value={x => x.pages.financialVirementSummary.linkChangeGrant} />
                      </ACC.Link>
                    </ACC.Section>
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
                    footer={<ACC.Content value={x => x.financialVirementLabels.projectTotals} />}
                    isDivider="normal"
                  />
                  <Table.Currency
                    qa="originalEligibleCosts"
                    header={x => x.financialVirementLabels.partnerOriginalEligibleCosts}
                    value={x => x.partnerVirement.originalEligibleCosts}
                    footer={<ACC.Renderers.Currency value={virement.originalEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="newEligibleCosts"
                    header={x => x.financialVirementLabels.partnerNewEligibleCosts}
                    value={x => x.partnerVirement.newEligibleCosts}
                    footer={<ACC.Renderers.Currency value={virement.newEligibleCosts} />}
                  />
                  <Table.Currency
                    qa="differenceEligibleCosts"
                    header={x => x.financialVirementLabels.partnerDifferenceCosts}
                    value={x =>
                      roundCurrency(x.partnerVirement.newEligibleCosts - x.partnerVirement.originalEligibleCosts)
                    }
                    footer={
                      <ACC.Renderers.Currency
                        value={roundCurrency(virement.newEligibleCosts - virement.originalEligibleCosts)}
                      />
                    }
                    isDivider="normal"
                  />
                  <Table.Percentage
                    qa="originalFundingLevel"
                    header={x => x.financialVirementLabels.originalFundingLevel}
                    value={x => x.partnerVirement.originalFundingLevel}
                    footer={<ACC.Renderers.Percentage value={virement.originalFundingLevel} />}
                  />
                  <Table.Percentage
                    qa="newFundingLevel"
                    header={x => x.financialVirementLabels.newFundingLevel}
                    value={x => x.partnerVirement.newFundingLevel}
                    footer={<ACC.Renderers.Percentage value={virement.newFundingLevel} />}
                    isDivider="normal"
                  />
                  <Table.Currency
                    qa="originalRemainingGrant"
                    header={x => x.financialVirementLabels.partnerOriginalRemainingGrant}
                    value={x => x.partnerVirement.originalRemainingGrant}
                    footer={<ACC.Renderers.Currency value={virement.originalRemainingGrant} />}
                  />
                  <Table.Currency
                    qa="newRemainingGrant"
                    header={x => x.financialVirementLabels.partnerNewRemainingGrant}
                    value={x => x.partnerVirement.newRemainingGrant}
                    footer={<ACC.Renderers.Currency value={virement.newRemainingGrant} />}
                  />
                  <Table.Currency
                    qa="differenceRemainingGrant"
                    header={x => x.financialVirementLabels.partnerDifferenceGrant}
                    value={x =>
                      roundCurrency(x.partnerVirement.newRemainingGrant - x.partnerVirement.originalRemainingGrant)
                    }
                    footer={
                      <ACC.Renderers.Currency
                        value={roundCurrency(virement.newRemainingGrant - virement.originalRemainingGrant)}
                      />
                    }
                  />
                </Table.Table>

                <ACC.Section>
                  <ACC.SummaryList qa="pcr_financial-virement">
                    <ACC.SummaryListItem
                      qa="grantValueYearEnd"
                      label={x => x.pages.financialVirementSummary.headingYearEndGrantValue}
                      content={<ACC.Renderers.Currency value={props.pcrItem.grantMovingOverFinancialYear} />}
                    />
                  </ACC.SummaryList>
                </ACC.Section>
              </>
            )}
          </>
        );
      }}
    </PcrSummaryConsumer>
  );

  const pendingPayload = Pending.combine({ virement: props.virement });
  return <ACC.Loader pending={pendingPayload} render={x => renderContent(x.virement)} />;
};

interface GrantMovingOverFinancialYearFormProps {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  form: ACC.FormBuilder<PCRItemDto>;
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
      <ACC.TextHint>The financial year ends on 31 March.</ACC.TextHint>

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
  ""
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

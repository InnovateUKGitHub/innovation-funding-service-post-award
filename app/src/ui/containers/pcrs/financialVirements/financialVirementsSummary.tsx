import React from "react";

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
import * as ACC from "@ui/components";
import { PCRItemType } from "@framework/types";

import { PcrSummaryConsumer } from "../components/PcrSummary";

export interface FinancialVirementSummaryProps
  extends PcrSummaryProps<
    PCRItemForMultiplePartnerFinancialVirementDto,
    MultiplePartnerFinancialVirementDtoValidator,
    ""
  > {
  virement: Pending<FinancialVirementDto>;
}

export function FinancialVirementSummaryComponent({ mode, ...props }: FinancialVirementSummaryProps) {
  const { getContent } = useContent();

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

    return (
      <ACC.Link preserveData route={route}>
        {ACC.getPartnerName(partner, true)}
      </ACC.Link>
    );
  };

  const renderContent = (virement: FinancialVirementDto) => (
    <PcrSummaryConsumer>
      {({ isSummaryValid, data }) => {
        if (!data) throw Error("There was an error fetching the partner costs.");

        let grantMessage: string | undefined;

        if (!data.hasMatchingGrant && data.newGrantDifference) {
          const grantDifference = ACC.Renderers.getCurrency(Math.abs(data.newGrantDifference));
          const totalOriginalGrant = ACC.Renderers.getCurrency(Math.abs(data.totalOriginalGrant));

          grantMessage = getContent(x =>
            data.hasAvailableGrant
              ? x.financialVirementSummary.availableGrantMessage(grantDifference)
              : x.financialVirementSummary.unavailableGrantMessage({ grantDifference, totalOriginalGrant }),
          );
        }

        const displayPositiveHighlight = !!(grantMessage && isSummaryValid);
        const displayRemainingHighlight = !!(grantMessage && !isSummaryValid);

        const projectCostsOfPartners = data.projectCostsOfPartners;
        const Table = ACC.TypedTable<typeof projectCostsOfPartners[0]>();

        return (
          <>
            {grantMessage && (
              <ACC.ValidationMessage message={grantMessage} messageType={data.hasAvailableGrant ? "info" : "error"} />
            )}

            {mode === "prepare" ? (
              <>
                {/* prettier-ignore */}
                <Table.Table qa="partners" data={projectCostsOfPartners}>
                      <Table.Custom qa="partner" headerContent={x => x.financialVirementSummary.labels.partnerName} value={x => getPartnerLink(x.partnerVirement, x.partner)} footer={<ACC.Content value={x => x.financialVirementDetails.labels.projectTotals} />} isDivider="normal" />
                      <Table.Currency qa="originalEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerOriginalEligibleCosts} value={x => x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={virement.originalEligibleCosts} />} />
                      <Table.Currency qa="originalRemaining" headerContent={x => x.financialVirementSummary.labels.partnerOriginalRemainingCosts} value={x => x.partnerVirement.originalRemainingCosts} footer={<ACC.Renderers.Currency value={virement.originalRemainingCosts} />} />
                      <Table.Currency qa="originalRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerOriginalRemainingGrant} value={x => x.partnerVirement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={virement.originalRemainingGrant} className={displayPositiveHighlight && "highlight--info"} />} isDivider="normal" />
                      <Table.Currency qa="newEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerNewEligibleCosts} value={x => x.partnerVirement.newEligibleCosts} footer={<ACC.Renderers.Currency value={virement.newEligibleCosts} />} />
                      <Table.Currency qa="newRemainingCosts" headerContent={x => x.financialVirementSummary.labels.partnerNewRemainingCosts} value={x => x.partnerVirement.newRemainingCosts} footer={<ACC.Renderers.Currency value={virement.newRemainingCosts} />} />
                      <Table.Currency qa="newRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerNewRemainingGrant} value={x => x.partnerVirement.newRemainingGrant} footer={<ACC.Renderers.Currency value={virement.newRemainingGrant} className={displayRemainingHighlight && "highlight--error"} />} />
                    </Table.Table>

                <ACC.Section qa="edit-partner-level">
                  <ACC.Link
                    styling="SecondaryButton"
                    route={props.routes.pcrFinancialVirementEditPartnerLevel.getLink({
                      itemId: props.pcrItem.id,
                      pcrId: props.pcr.id,
                      projectId: props.projectId,
                    })}
                  >
                    <ACC.Content value={x => x.financialVirementSummary.changeGrantLink} />
                  </ACC.Link>
                </ACC.Section>
              </>
            ) : (
              <>
                {/* prettier-ignore */}
                <Table.Table qa="partners" data={projectCostsOfPartners} headerRowClass="govuk-body-s" bodyRowClass={() => "govuk-body-s"} footerRowClass="govuk-body-s">
                      <Table.Custom qa="partner" headerContent={x => x.financialVirementSummary.labels.partnerName} value={x => getPartnerLink(x.partnerVirement, x.partner)} footer={<ACC.Content value={x => x.financialVirementDetails.labels.projectTotals} />} isDivider="normal" />
                      <Table.Currency qa="originalEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerOriginalEligibleCosts} value={x => x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={virement.originalEligibleCosts} />} />
                      <Table.Currency qa="newEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerNewEligibleCosts} value={x => x.partnerVirement.newEligibleCosts} footer={<ACC.Renderers.Currency value={virement.newEligibleCosts} />} />
                      <Table.Currency qa="differenceEligibleCosts" headerContent={x => x.financialVirementSummary.labels.partnerDifferenceCosts} value={x => x.partnerVirement.newEligibleCosts - x.partnerVirement.originalEligibleCosts} footer={<ACC.Renderers.Currency value={virement.newEligibleCosts - virement.originalEligibleCosts} />} isDivider="normal" />
                      <Table.Percentage qa="originalFundingLevel" headerContent={x => x.financialVirementSummary.labels.originalFundingLevel} value={x => x.partnerVirement.originalFundingLevel} footer={<ACC.Renderers.Percentage value={virement.originalFundingLevel} />} />
                      <Table.Percentage qa="newFundingLevel" headerContent={x => x.financialVirementSummary.labels.newFundingLevel} value={x => x.partnerVirement.newFundingLevel} footer={<ACC.Renderers.Percentage value={virement.newFundingLevel} />} isDivider="normal" />
                      <Table.Currency qa="originalRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerOriginalRemainingGrant} value={x => x.partnerVirement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={virement.originalRemainingGrant} />} />
                      <Table.Currency qa="newRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerNewRemainingGrant} value={x => x.partnerVirement.newRemainingGrant} footer={<ACC.Renderers.Currency value={virement.newRemainingGrant} />} />
                      <Table.Currency qa="differenceRemainingGrant" headerContent={x => x.financialVirementSummary.labels.partnerDifferenceGrant} value={x => x.partnerVirement.newRemainingGrant - x.partnerVirement.originalRemainingGrant} footer={<ACC.Renderers.Currency value={virement.newRemainingGrant - virement.originalRemainingGrant} />} />
                    </Table.Table>

                <ACC.Section>
                  <ACC.SummaryList qa="pcr_financial-virement">
                    <ACC.SummaryListItem
                      qa="grantValueYearEnd"
                      labelContent={x => x.financialVirementSummary.grantValueMovingOverHeading}
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
}

interface GrantMovingOverFinancialYearFormProps {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  form: ACC.FormBuilder<PCRItemDto>;
}

export function GrantMovingOverFinancialYearForm({ form: Form, editor }: GrantMovingOverFinancialYearFormProps) {
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
      headingContent={x => x.financialVirementSummary.labels.grantMovingOverYear}
    >
      <ACC.TextHint>The financial year ends on 31 March.</ACC.TextHint>

      <Form.Numeric
        name="grantMovingOverFinancialYear"
        width={10}
        value={() => itemPcr.grantMovingOverFinancialYear}
        update={(_m, val) => (itemPcr.grantMovingOverFinancialYear = val!)}
        validation={itemValidator.grantMovingOverFinancialYear}
      />
    </Form.Fieldset>
  );
}

export const FinancialVirementSummary = (
  props: PcrSummaryProps<
    PCRItemForMultiplePartnerFinancialVirementDto,
    MultiplePartnerFinancialVirementDtoValidator,
    ""
  >,
) => {
  const stores = useStores();

  return (
    <FinancialVirementSummaryComponent
      {...props}
      virement={stores.financialVirements.get(props.projectId, props.pcr.id, props.pcrItem.id)}
    />
  );
};

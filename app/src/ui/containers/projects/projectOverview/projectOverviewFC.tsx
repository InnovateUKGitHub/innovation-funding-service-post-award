import { TypedDetails, getPartnerName, SectionPanel, Content, DualDetails } from "@ui/components";

import type { Partner } from "./projectOverview.logic";

const FCProjectOverviewDetails = ({ partner }: { partner: Partner }) => {
  const PartnerSummaryDetails = TypedDetails<Partner>();
  const partnerName = getPartnerName(partner);

  return (
    <SectionPanel
      qa="claims-totals"
      title={<Content value={x => x.pages.projectOverview.costsToDateMessage({ partnerName })} />}
    >
      <DualDetails>
        <PartnerSummaryDetails.Details qa="claims-totals-col-0" data={partner}>
          <PartnerSummaryDetails.Currency
            label={<Content value={x => x.projectLabels.totalEligibleCostsLabel} />}
            qa="gol-costs"
            value={x => x.totalParticipantGrant}
          />

          <PartnerSummaryDetails.Currency
            label={<Content value={x => x.projectLabels.totalEligibleCostsClaimedLabel} />}
            qa="claimed-costs"
            value={x => x.totalParticipantCostsClaimed || 0}
          />

          <PartnerSummaryDetails.Percentage
            label={<Content value={x => x.projectLabels.percentageEligibleCostsClaimedLabel} />}
            qa="percentage-costs"
            value={x => x.percentageParticipantCostsClaimed}
          />
        </PartnerSummaryDetails.Details>
      </DualDetails>
    </SectionPanel>
  );
};

export default FCProjectOverviewDetails;

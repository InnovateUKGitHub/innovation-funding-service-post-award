import { Content } from "@ui/components/molecules/Content/content";
import { TypedDetails, DualDetails } from "@ui/components/organisms/Details/details";
import { SectionPanel } from "@ui/components/molecules/SectionPanel/sectionPanel";
import type { Partner, Project } from "./projectOverview.logic";
import { getPartnerName } from "@ui/components/organisms/partners/utils/partnerName";

export const ProjectOverviewAllPartnersDetails = ({
  project,
  partner,
  isMultipleParticipants,
}: {
  partner: Partner;
  project: Project;
  isMultipleParticipants: boolean;
}) => {
  const ProjectSummaryDetails = TypedDetails<Project>();
  const PartnerSummaryDetails = TypedDetails<Partner>();
  return (
    <SectionPanel qa="claims-summary">
      <DualDetails>
        <ProjectSummaryDetails.Details
          title={<Content value={x => x.projectLabels.projectCostsLabel} />}
          data={project}
          qa="project-summary"
        >
          <ProjectSummaryDetails.Currency
            label={<Content value={x => x.projectLabels.totalEligibleCostsLabel} />}
            qa="gol-costs"
            value={x => x.grantOfferLetterCosts}
          />

          <ProjectSummaryDetails.Currency
            label={<Content value={x => x.projectLabels.totalEligibleCostsClaimedLabel} />}
            qa="claimed-costs"
            value={x => x.costsClaimedToDate || 0}
          />

          <ProjectSummaryDetails.Percentage
            label={<Content value={x => x.projectLabels.percentageEligibleCostsClaimedLabel} />}
            qa="claimed-percentage"
            value={x => x.claimedPercentage}
          />
        </ProjectSummaryDetails.Details>

        {isMultipleParticipants && (
          <PartnerSummaryDetails.Details
            data={partner}
            title={
              <Content
                value={x => x.pages.projectOverview.costsToDateMessage({ partnerName: getPartnerName(partner) })}
              />
            }
            qa="lead-partner-summary"
          >
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
              qa="claimed-percentage"
              value={x => x.percentageParticipantCostsClaimed}
            />
          </PartnerSummaryDetails.Details>
        )}
      </DualDetails>
    </SectionPanel>
  );
};

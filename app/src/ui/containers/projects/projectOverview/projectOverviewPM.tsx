import { TypedDetails, SectionPanel, Content, DualDetails, getPartnerName } from "@ui/components";
import { useProjectParticipants } from "@ui/features/project-participants";
import type { Partner, Project } from "./projectOverview.logic";

const PMProjectOverviewDetails = ({ project, partner }: { partner: Partner; project: Project }) => {
  const ProjectSummaryDetails = TypedDetails<Project>();
  const PartnerSummaryDetails = TypedDetails<Partner>();
  const state = useProjectParticipants();
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

        {state.isMultipleParticipants && (
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

export default PMProjectOverviewDetails;

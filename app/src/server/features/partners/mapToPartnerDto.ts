import { DateTime } from "luxon";
import { SyncCommandBase } from "../common/commandBase";
import { SalesforceProjectRole } from "../../repositories/partnersRepository";
import { PartnerClaimStatus, PartnerDto, PartnerStatus, ProjectRole } from "@framework/types";
import { Partner } from "@framework/entities";

export class MapToPartnerDtoCommand extends SyncCommandBase<PartnerDto> {
    constructor(
        private readonly item: Partner,
        private readonly partnerLevelRoles: ProjectRole,
        private readonly projectLevelRoles: ProjectRole
    ) {
        super();
    }

    calcPercentageClaimed(total: number, claimed: number) {
        return (total) ? 100 * (claimed || 0) / total : null;
    }

    Run(): PartnerDto {
        return {
            id: this.item.id,
            name: this.item.name,
            accountId: this.item.accountId,
            type: this.item.participantType,
            postcode: this.item.postcode,
            organisationType: this.item.organisationType,
            competitionType: this.item.competitionType,
            isLead: this.item.projectRole === SalesforceProjectRole.ProjectLead,
            projectRoleName: this.item.projectRoleName,
            projectId: this.item.projectId,
            totalParticipantGrant: this.valueIfPermission(this.item.totalParticipantCosts),
            totalParticipantCostsClaimed: this.valueIfPermission(this.item.totalApprovedCosts),
            percentageParticipantCostsClaimed: this.valueIfPermission(this.calcPercentageClaimed(this.item.totalParticipantCosts, this.item.totalApprovedCosts)),
            awardRate: this.valueIfPermission(this.item.awardRate),
            capLimit: this.valueIfPermission(this.item.capLimit),
            totalPaidCosts: this.valueIfPermission(this.item.totalPaidCosts),
            totalFutureForecastsForParticipants: this.valueIfPermission(this.item.totalFutureForecastsForParticipant),
            totalCostsSubmitted: this.valueIfPermission(this.item.totalCostsSubmitted),
            roles: this.partnerLevelRoles,
            forecastLastModifiedDate: this.item.forecastLastModifiedDate,
            claimsOverdue: this.valueIfPermission(this.item.claimsOverdue),
            claimsWithParticipant: this.valueIfPermission(this.item.claimsUnderQuery),
            claimStatus: this.getClaimStatus(this.item.trackingClaims),
            statusName: this.item.trackingClaims || "",
            overheadRate: this.valueIfPermission(this.item.overheadRate) || null,
            partnerStatus: this.getPartnerStatus(this.item.participantStatus),
            isWithdrawn: [PartnerStatus.VoluntaryWithdrawal, PartnerStatus.InvoluntaryWithdrawal].indexOf(this.getPartnerStatus(this.item.participantStatus)) >= 0,
            totalCostsAwarded: this.item.totalCostsAwarded,
            auditReportFrequencyName: this.item.auditReportFrequencyName,
            totalPrepayment: this.item.totalPrepayment,
            percentageParticipantCostsSubmitted: this.valueIfPermission(this.calcPercentageClaimed(this.item.totalParticipantCosts, this.item.totalCostsSubmitted)),
            totalFundingDueToReceive: this.valueIfPermission(this.item.totalParticipantCosts * (this.item.awardRate / 100))
        };
    }

    getClaimStatus(salesforceStatus: string): PartnerClaimStatus {
        switch (salesforceStatus) {
            case "No Claims Due":
                return PartnerClaimStatus.NoClaimsDue;
            case "Claim Due":
                return PartnerClaimStatus.ClaimDue;
            case "Claims Overdue":
                return PartnerClaimStatus.ClaimsOverdue;
            case "Claim Queried":
                return PartnerClaimStatus.ClaimQueried;
            case "Claim Submitted":
                return PartnerClaimStatus.ClaimSubmitted;
            case "Awaiting IAR":
                return PartnerClaimStatus.IARRequired;
            default:
                return PartnerClaimStatus.Unknown;
        }
    }

    getPartnerStatus(salesforceStatus: string): PartnerStatus {
        switch (salesforceStatus) {
            case "Active":
                return PartnerStatus.Active;
            case "On Hold":
                return PartnerStatus.OnHold;
            case "Involuntary Withdrawal":
                return PartnerStatus.InvoluntaryWithdrawal;
            case "Voluntary Withdrawal":
                return PartnerStatus.VoluntaryWithdrawal;
            default:
                return PartnerStatus.Unknown;
        }
    }

    private valueIfPermission(value: number | null) {
        if (this.projectLevelRoles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager) || this.partnerLevelRoles & ProjectRole.FinancialContact) {
            return value;
        }
        return null;
    }

}

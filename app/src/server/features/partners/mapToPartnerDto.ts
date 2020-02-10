import { DateTime } from "luxon";
import { SyncCommandBase } from "../common/commandBase";
import { ISalesforcePartner, SalesforceProjectRole } from "../../repositories/partnersRepository";
import { PartnerClaimStatus, PartnerDto, PartnerStatus, ProjectRole } from "@framework/types";

export class MapToPartnerDtoCommand extends SyncCommandBase<PartnerDto> {
    constructor(
        private readonly item: ISalesforcePartner,
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
            id: this.item.Id,
            name: this.item.Acc_AccountId__r.Name,
            accountId: this.item.Acc_AccountId__r.Id,
            type: this.item.Acc_ParticipantType__c,
            postcode: this.item.Acc_Postcode__c,
            organisationType: this.item.Acc_OrganisationType__c,
            competitionType: this.item.Acc_ProjectId__r.Acc_CompetitionType__c,
            isLead: this.item.Acc_ProjectRole__c === SalesforceProjectRole.ProjectLead,
            projectRoleName: this.item.ProjectRoleName,
            projectId: this.item.Acc_ProjectId__r.Id,
            totalParticipantGrant: this.valueIfPermission(this.item.Acc_TotalParticipantCosts__c),
            totalParticipantCostsClaimed: this.valueIfPermission(this.item.Acc_TotalApprovedCosts__c),
            percentageParticipantCostsClaimed: this.valueIfPermission(this.calcPercentageClaimed(this.item.Acc_TotalParticipantCosts__c, this.item.Acc_TotalApprovedCosts__c)),
            awardRate: this.valueIfPermission(this.item.Acc_Award_Rate__c),
            capLimit: this.valueIfPermission(this.item.Acc_Cap_Limit__c),
            totalPaidCosts: this.valueIfPermission(this.item.Acc_TotalPaidCosts__c),
            totalFutureForecastsForParticipants: this.valueIfPermission(this.item.Acc_TotalFutureForecastsForParticipant__c),
            totalCostsSubmitted: this.valueIfPermission(this.item.Acc_TotalCostsSubmitted__c),
            roles: this.partnerLevelRoles,
            forecastLastModifiedDate: this.item.Acc_ForecastLastModifiedDate__c ? DateTime.fromISO(this.item.Acc_ForecastLastModifiedDate__c).toJSDate() : null,
            claimsOverdue: this.valueIfPermission(this.item.Acc_ClaimsOverdue__c),
            claimsWithParticipant: this.valueIfPermission(this.item.Acc_ClaimsUnderQuery__c),
            claimStatus: this.getClaimStatus(this.item.Acc_TrackingClaims__c),
            statusName: this.item.Acc_TrackingClaims__c || "",
            overheadRate: this.valueIfPermission(this.item.Acc_OverheadRate__c) || null,
            partnerStatus: this.getPartnerStatus(this.item.Acc_ParticipantStatus__c),
            isWithdrawn: [PartnerStatus.VoluntaryWithdrawal, PartnerStatus.InvoluntaryWithdrawal].indexOf(this.getPartnerStatus(this.item.Acc_ParticipantStatus__c)) >= 0,
            totalCostsAwarded: this.item.Acc_TotalCostsAwarded__c,
            auditReportFrequencyName: this.item.AuditReportFrequencyName,
            totalPrepayment: this.item.Acc_TotalPrepayment__c,
            percentageParticipantCostsSubmitted: this.valueIfPermission(this.calcPercentageClaimed(this.item.Acc_TotalParticipantCosts__c, this.item.Acc_TotalCostsSubmitted__c)),
            totalFundingDueToReceive: this.valueIfPermission(this.item.Acc_TotalParticipantCosts__c * (this.item.Acc_Award_Rate__c / 100))
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

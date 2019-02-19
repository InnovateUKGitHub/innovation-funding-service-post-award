import { DateTime } from "luxon";
import { SyncCommandBase } from "../common/commandBase";
import { ISalesforcePartner, PROJECT_LEAD_IDENTIFIER } from "../../repositories/partnersRepository";
import { PartnerClaimStatus, PartnerDto, ProjectRole } from "../../../types";

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
            organisationType: this.item.Acc_OrganisationType__c,
            isLead: this.item.Acc_ProjectRole__c === PROJECT_LEAD_IDENTIFIER,
            projectId: this.item.Acc_ProjectId__c,
            totalParticipantGrant: this.valueIfPermission(this.item.Acc_TotalParticipantGrant__c),
            totalParticipantCostsClaimed: this.valueIfPermission(this.item.Acc_TotalParticipantCosts__c),
            percentageParticipantCostsClaimed: this.valueIfPermission(this.calcPercentageClaimed(this.item.Acc_TotalParticipantGrant__c, this.item.Acc_TotalParticipantCosts__c)),
            awardRate: this.valueIfPermission(this.item.Acc_Award_Rate__c),
            capLimit: this.valueIfPermission(this.item.Acc_Cap_Limit__c),
            totalFutureForecastsForParticipants: this.valueIfPermission(this.item.Acc_TotalFutureForecastsforParticipant__c),
            roles: this.partnerLevelRoles,
            forecastLastModifiedDate: this.item.Acc_ForecastLastModifiedDate__c ? DateTime.fromISO(this.item.Acc_ForecastLastModifiedDate__c).toJSDate() : null,
            claimsToReview: this.item.Acc_Claims_For_Review__c || 0,
            claimsOverdue: this.item.Claims_Overdue__c,
            claimsQuried: this.item.Acc_Claims_Under_Query__c,
            status: this.getClaimStatus(this.item.Acc_TrackingClaims__c),
            statusName: this.item.Acc_TrackingClaims__c,

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
            default:
                return PartnerClaimStatus.Unknown;
        }
    }

    private valueIfPermission(value: number | null) {
        if (this.projectLevelRoles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager) || this.partnerLevelRoles & ProjectRole.FinancialContact) {
            return value;
        }
        return null;
    }

}

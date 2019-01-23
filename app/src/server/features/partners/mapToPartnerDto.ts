import { CommandBase, IContext, SyncCommandBase } from "../common/context";
import { ISalesforcePartner, PROJECT_LEAD_IDENTIFIER } from "../../repositories/partnersRepository";
import { PartnerDto, ProjectRole } from "../../../types";
import { SALESFORCE_DATE_TIME_FORMAT } from "../common/clock";
import { DateTime } from "luxon";

export class MapToPartnerDtoCommand extends SyncCommandBase<PartnerDto> {
    constructor(readonly item: ISalesforcePartner, readonly partnerLevelRoles: ProjectRole, readonly projectLevelRoles: ProjectRole) {
        super();
     }

    calcPercentageClaimed(total: number, claimed: number) {
        return (total) ? 100 * (claimed || 0) / total  : null;
    }

    Run(context: IContext): PartnerDto {
        return {
            id: this.item.Id,
            name: this.item.Acc_AccountId__r.Name,
            accountId: this.item.Acc_AccountId__r.Id,
            type: this.item.Acc_ParticipantType__c,
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
        };
    }

    private valueIfPermission(value: number|null) {
        if(this.projectLevelRoles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager) || this.partnerLevelRoles & ProjectRole.FinancialContact) {
            return value;
        }
        return null;
    }

}

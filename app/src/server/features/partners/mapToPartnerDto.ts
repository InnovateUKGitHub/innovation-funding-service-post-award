import { SyncCommandBase } from "../common/commandBase";
import { SalesforceProjectRole } from "../../repositories/partnersRepository";
import {
    BankCheckStatus,
    BankDetailsTaskStatus,
    PartnerClaimStatus,
    PartnerDto,
    PartnerStatus,
    ProjectRole,
    SpendProfileStatus
} from "@framework/types";
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
        const partnerStatus = new PartnerStatusMapper().mapFromSalesforce(this.item.participantStatus);
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
            partnerStatus,
            isWithdrawn: [PartnerStatus.VoluntaryWithdrawal, PartnerStatus.InvoluntaryWithdrawal].indexOf(partnerStatus) >= 0,
            totalCostsAwarded: this.item.totalCostsAwarded,
            auditReportFrequencyName: this.item.auditReportFrequencyName,
            totalPrepayment: this.item.totalPrepayment,
            percentageParticipantCostsSubmitted: this.valueIfPermission(this.calcPercentageClaimed(this.item.totalParticipantCosts, this.item.totalCostsSubmitted)),
            totalFundingDueToReceive: this.valueIfPermission(this.item.totalParticipantCosts * (this.item.awardRate / 100)),
            newForecastNeeded: this.item.newForecastNeeded,
            // For active partners initialise these as complete as they may not have come through the acc ui and therefore not be set correctly
            spendProfileStatus: partnerStatus === PartnerStatus.Active ? SpendProfileStatus.Complete : new PartnerSpendProfileStatusMapper().mapFromSalesforcePcrSpendProfileOverheadRateOption(this.item.spendProfileStatus),
            bankCheckStatus: partnerStatus === PartnerStatus.Active ? BankCheckStatus.VerificationPassed : new BankCheckStatusMapper().mapFromSalesforce(this.item.bankCheckStatus),
            bankDetailsTaskStatus: partnerStatus === PartnerStatus.Active ? BankDetailsTaskStatus.Complete : new BankDetailsTaskStatusMapper().mapFromSalesforce(this.item.bankDetailsTaskStatus),
            spendProfileStatusLabel: this.item.spendProfileStatusLabel,
            bankDetailsTaskStatusLabel: this.item.bankDetailsTaskStatusLabel,
            companyNumber: this.item.companyNumber,
            accountNumber: this.item.accountNumber,
            sortCode: this.item.sortCode,
            firstName: this.item.firstName,
            lastName: this.item.lastName,
            accountPostcode: this.item.accountPostcode,
            accountStreet: this.item.accountStreet,
            accountBuilding: this.item.accountBuilding,
            accountLocality: this.item.accountLocality,
            accountTownOrCity: this.item.accountTownOrCity,
            validationCheckPassed: this.item.validationCheckPassed,
            iban: this.item.iban,
            validationConditionsSeverity: this.item.validationConditionsSeverity,
            validationConditionsCode: this.item.validationConditionsCode,
            validationConditionsDesc: this.item.validationConditionsDesc,
            personalDetailsScore: this.item.personalDetailsScore,
            companyNameScore: this.item.companyNameScore,
            addressScore: this.item.addressScore,
            regNumberIsValid: this.item.regNumberIsValid,
            bankCheckValidationAttempts: 0,
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

    private valueIfPermission(value: number | null) {
        if (this.projectLevelRoles & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager) || this.partnerLevelRoles & ProjectRole.FinancialContact) {
            return value;
        }
        return null;
    }

}

export class PartnerSpendProfileStatusMapper {
    private readonly options = {
        toDo: "To Do",
        incomplete: "In progress",
        complete: "Complete",
    };

    public mapFromSalesforcePcrSpendProfileOverheadRateOption = ((option: string | undefined): SpendProfileStatus => {
        switch (option) {
            case this.options.toDo: return SpendProfileStatus.ToDo;
            case this.options.incomplete: return SpendProfileStatus.Incomplete;
            case this.options.complete: return SpendProfileStatus.Complete;
            default: return SpendProfileStatus.Unknown;
        }
    });

    public mapToSalesforcePcrSpendProfileOverheadRateOption = ((option: SpendProfileStatus | undefined) => {
        switch (option) {
            case SpendProfileStatus.ToDo: return this.options.toDo;
            case SpendProfileStatus.Incomplete: return this.options.incomplete;
            case SpendProfileStatus.Complete: return this.options.complete;
            default: return undefined;
        }
    });
}

export class BankDetailsTaskStatusMapper {
    private readonly options = {
        toDo: "To Do",
        incomplete: "In progress",
        complete: "Complete",
    };

    public mapFromSalesforce = ((option: string | undefined): BankDetailsTaskStatus => {
        switch (option) {
            case this.options.toDo: return BankDetailsTaskStatus.ToDo;
            case this.options.incomplete: return BankDetailsTaskStatus.Incomplete;
            case this.options.complete: return BankDetailsTaskStatus.Complete;
            default: return BankDetailsTaskStatus.Unknown;
        }
    });

    public mapToSalesforce = ((option: BankDetailsTaskStatus | undefined) => {
        switch (option) {
            case BankDetailsTaskStatus.ToDo: return this.options.toDo;
            case BankDetailsTaskStatus.Incomplete: return this.options.incomplete;
            case BankDetailsTaskStatus.Complete: return this.options.complete;
            default: return undefined;
        }
    });
}

export class BankCheckStatusMapper {
    private readonly options = {
        notValidated: "Not validated",
        validationPassed: "Validation passed",
        validationFailed: "Validation failed",
        verificationPassed: "Verfication passed",
        verificationFailed: "Verification failed",
    };

    public mapFromSalesforce = ((option: string | undefined): BankCheckStatus => {
        switch (option) {
            case this.options.notValidated: return BankCheckStatus.NotValidated;
            case this.options.validationPassed: return BankCheckStatus.ValidationPassed;
            case this.options.validationFailed: return BankCheckStatus.ValidationFailed;
            case this.options.verificationPassed: return BankCheckStatus.VerificationPassed;
            case this.options.verificationFailed: return BankCheckStatus.VerificationPassed;
            default: return BankCheckStatus.Unknown;
        }
    });

    public mapToSalesforce = ((option: BankCheckStatus | undefined) => {
        switch (option) {
            case BankCheckStatus.NotValidated: return this.options.notValidated;
            case BankCheckStatus.ValidationPassed: return this.options.validationPassed;
            case BankCheckStatus.ValidationFailed: return this.options.validationFailed;
            case BankCheckStatus.VerificationPassed: return this.options.verificationPassed;
            case BankCheckStatus.VerificationFailed: return this.options.verificationFailed;
            default: return undefined;
        }
    });
}

export class PartnerStatusMapper {
    private readonly options = {
        active: "Active",
        onHold: "On Hold",
        involuntaryWithdrawal: "Involuntary Withdrawal",
        voluntaryWithdrawal: "Voluntary Withdrawal",
        pending: "Pending",
    };

    public mapFromSalesforce = ((status: string | undefined): PartnerStatus => {
        switch (status) {
            case this.options.active: return PartnerStatus.Active;
            case this.options.involuntaryWithdrawal: return PartnerStatus.InvoluntaryWithdrawal;
            case this.options.onHold: return PartnerStatus.OnHold;
            case this.options.pending: return PartnerStatus.Pending;
            case this.options.voluntaryWithdrawal: return PartnerStatus.VoluntaryWithdrawal;
            default: return PartnerStatus.Unknown;
        }
    });

    public mapToSalesforce = ((status: PartnerStatus | undefined) => {
        switch (status) {
            case PartnerStatus.Active: return this.options.active;
            case PartnerStatus.InvoluntaryWithdrawal: return this.options.involuntaryWithdrawal;
            case PartnerStatus.OnHold: return this.options.onHold;
            case PartnerStatus.Pending: return this.options.pending;
            case PartnerStatus.VoluntaryWithdrawal: return this.options.voluntaryWithdrawal;
            default: return undefined;
        }
    });
}

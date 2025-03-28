import { BankCheckStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { BankCheckStatus, BankDetailsTaskStatus } from "@framework/constants/partner";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { Logger } from "@innovateuk/logger";
import { ILogger } from "@innovateuk/logger";
import { projectSetupBankDetailsErrorMap } from "@ui/pages/projects/setup/projectSetupBankDetails.zod";
import { zodEmptySchema, ZodEmptySchema } from "@ui/zod/helperValidators/helperValidators.zod";
import { GetBankVerificationDetailsByIdQuery } from "./getBankVerificationDetailsByIdQuery";
import { parseNumber } from "@framework/util/numberHelper";
import { isNumber } from "lodash";
import { BankCheckCondition, MatchFlag } from "@framework/types/bankCheck";
import { BankDetailsTaskStatusMapper } from "@framework/mappers/bankTaskStatus";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ISalesforcePartner } from "@server/repositories/partnersRepository";

export class UpdatePartnerBankDetailsVerifyCommand extends ZodAuthorisedAsyncCommandBase<
  { bankCheckStatus: BankCheckStatus },
  ZodEmptySchema,
  null
> {
  protected readonly projectId: ProjectId;
  protected readonly partnerId: PartnerId;
  public readonly runnableName: string = "UpdatePartnerBankDetailsVerifyCommand";
  private readonly logger: ILogger = new Logger("UpdatePartnerBankDetailsVerifyCommand");
  protected dto = null;

  constructor(projectId: ProjectId, partnerId: PartnerId) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.projectId, this.partnerId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema() {
    return {
      schema: zodEmptySchema,
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected async mapToZod() {
    return {};
  }

  protected async runRepositoryCommands(context: IContext) {
    try {
      const unmaskedPartnerDto = await context
        .asBankDetailsValidationUser()
        .runQuery(new GetBankVerificationDetailsByIdQuery(this.partnerId));

      const verificationResult = await context.resources.bankCheckService.verify({
        companyName: unmaskedPartnerDto.companyName,
        registrationNumber: unmaskedPartnerDto.bankDetails.companyNumber ?? "",
        sortcode: unmaskedPartnerDto.bankDetails.sortCode ?? "",
        accountNumber: unmaskedPartnerDto.bankDetails.accountNumber ?? "",
        // As these are business accounts they do not have a named account holder associated,
        // however these values seem to be required by the Experian Verify API.
        // As such, we are hardcoding dummy values for them here.
        firstName: "NA",
        lastName: "NA",
        address: {
          organisation: "",
          buildingName: unmaskedPartnerDto.bankDetails.address?.accountBuilding ?? "",
          street: unmaskedPartnerDto.bankDetails.address?.accountStreet ?? "",
          locality: unmaskedPartnerDto.bankDetails.address?.accountLocality ?? "",
          town: unmaskedPartnerDto.bankDetails.address?.accountTownOrCity ?? "",
          postcode: unmaskedPartnerDto.bankDetails.address?.accountPostcode ?? "",
        },
      });

      const addressScore = parseNumber(verificationResult.addressScore);
      const companyNameScore = parseNumber(verificationResult.companyNameScore);
      const personalDetailsScore = parseNumber(verificationResult.personalDetailsScore);

      const isValidResult = this.validateVerifyResponse(
        addressScore,
        companyNameScore,
        verificationResult.regNumberScore,
        unmaskedPartnerDto.organisationType,
        context,
      );

      const updateData: Updatable<ISalesforcePartner> = {
        Id: this.partnerId,
        Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete),
        Acc_AddressScore__c: addressScore ?? undefined,
        Acc_CompanyNameScore__c: companyNameScore ?? undefined,
        Acc_PersonalDetailsScore__c: personalDetailsScore ?? undefined,
        Acc_RegNumberScore__c: verificationResult.regNumberScore ?? undefined,
      };

      if (verificationResult.conditions) {
        const { severity, code, description } = this.collapseConditions(verificationResult.conditions);
        updateData.Acc_VerificationConditionsSeverity__c = severity;
        updateData.Acc_VerificationConditionsCode__c = code;
        updateData.Acc_VerificationConditionsDesc__c = description;
      }

      if (isValidResult) {
        updateData.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(
          BankCheckStatus.VerificationPassed,
        );
        updateData.Acc_BankCheckCompleted__c = new BankDetailsTaskStatusMapper().mapToSalesforce(
          BankDetailsTaskStatus.Complete,
        );
      } else {
        updateData.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(
          BankCheckStatus.VerificationFailed,
        );
      }

      await context.repositories.partners.update(updateData);
      return {
        bankCheckStatus: isValidResult ? BankCheckStatus.VerificationPassed : BankCheckStatus.VerificationFailed,
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private validateVerifyResponse(
    addressScore: number | null,
    companyNameScore: number | null,
    regNumberScore: MatchFlag,
    organisationType: string,
    context: IContext,
  ) {
    // Only checking against address and company name scores as personal details score will always fail.
    if (
      !isNumber(addressScore) ||
      addressScore < context.config.options.bankCheckAddressScorePass ||
      !isNumber(companyNameScore) ||
      companyNameScore < context.config.options.bankCheckCompanyNameScorePass
    ) {
      return false;
    }
    if (organisationType === "Industrial") {
      return regNumberScore === "Match";
    }
    return true;
  }

  private collapseConditions(conditions: BankCheckCondition[]): Record<keyof BankCheckCondition, string> {
    const collapsedConditions: Record<keyof BankCheckCondition, string> = {
      code: JSON.stringify(conditions.map(x => x.code)),
      description: JSON.stringify(conditions.map(x => x.description)),
      severity: JSON.stringify(conditions.map(x => x.severity)),
    };

    for (const key of ["code", "description", "severity"] as const) {
      if (collapsedConditions[key].length > 255) {
        this.logger.warn(`Collapsed SIL conditions ${key} would be longer than Salesforce limit.`);
        collapsedConditions[key] = "null";
      }
    }

    return collapsedConditions;
  }
}

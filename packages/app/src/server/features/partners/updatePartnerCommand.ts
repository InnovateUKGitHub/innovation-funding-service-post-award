import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import {
  BankCheckStatusMapper,
  BankDetailsTaskStatusMapper,
  PartnerStatusMapper,
} from "@server/features/partners/mapToPartnerDto";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetPartnerDocumentsQuery } from "@server/features/documents/getPartnerDocumentsSummaryQuery";
import { BankCheckCondition, MatchFlag } from "@framework/types/bankCheck";
import { GetBankVerificationDetailsByIdQuery } from "./getBankVerificationDetailsByIdQuery";
import {
  PartnerStatus,
  BankCheckStatus,
  BankDetailsTaskStatus,
  PostcodeTaskStatus,
  SpendProfileStatus,
} from "@framework/constants/partner";
import { ProjectRolePermissionBits, ProjectSource } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforcePartner } from "@server/repositories/partnersRepository";
import { InActiveProjectError, BadRequestError, ValidationError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { isBoolean } from "@framework/util/booleanHelper";
import { isNumber, parseNumber } from "@framework/util/numberHelper";
import { merge } from "lodash";
import { Logger } from "@innovateuk/logger";
import { ILogger } from "@innovateuk/logger";
import {
  getProjectSetupBankDetailsSchema,
  projectSetupBankDetailsErrorMap,
  ProjectSetupBankDetailsSchemaType,
} from "@ui/pages/projects/setup/projectSetupBankDetails.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  postcodeErrorMap,
  postcodeSchema,
  PostcodeSchema,
} from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { PartnerDto } from "@framework/dtos/partnerDto";
import {
  projectSetupErrorMap,
  ProjectSetupSchema,
  projectSetupSchema,
} from "@ui/pages/projects/setup/projectSetup.zod";
import { z } from "zod";
import { BankStatementSchema, setupBankStatementSchema } from "@ui/pages/projects/setup/projectSetupBankStatement.zod";
import { UpdatePartnerFormType } from "@framework/types/updatePartnerFormTypes";
import { DocumentDescription } from "@framework/constants/documentDescription";

type PartnerUpdatable = Updatable<ISalesforcePartner>;
type UpdatePartnerDto = PickRequiredFromPartial<PartnerDto, "id" | "projectId">;

export class UpdatePartnerCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ProjectSetupBankDetailsSchemaType | PostcodeSchema | ProjectSetupSchema | BankStatementSchema,
  UpdatePartnerDto
> {
  public readonly runnableName: string = "UpdatePartnerCommand";
  private mergedPartner: PartnerDto | null = null;
  private readonly logger: ILogger = new Logger("UpdatePartnerCommand");
  private readonly form: UpdatePartnerFormType;

  private readonly check: {
    validateBankDetails?: boolean;
    verifyBankDetails?: boolean;
    projectSource?: ProjectSource;
  } = {};

  protected dto: UpdatePartnerDto;

  private savedPartner: PartnerDto | null = null;

  constructor(
    partner: UpdatePartnerDto,
    form: UpdatePartnerFormType,
    check: {
      validateBankDetails?: boolean;
      verifyBankDetails?: boolean;
      projectSource?: ProjectSource;
    } = {},
  ) {
    super();
    this.dto = partner;
    this.check = check;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.dto.projectId, this.dto.id)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema(context: IContext) {
    this.savedPartner = await context.runQuery(new GetByIdQuery(this.dto.id));
    switch (this.form) {
      case FormTypes.ProjectSetupPostcode:
      case FormTypes.PartnerDetailsEdit:
        return { schema: postcodeSchema, errorMap: postcodeErrorMap };
      case FormTypes.ProjectSetup:
        return { schema: projectSetupSchema, errorMap: projectSetupErrorMap };
      case FormTypes.ProjectSetupBankDetails:
      case FormTypes.ProjectSetupBankDetailsVerify:
        return {
          schema: getProjectSetupBankDetailsSchema(this.savedPartner.bankCheckStatus),
          errorMap: projectSetupBankDetailsErrorMap,
        };
      case FormTypes.ProjectSetupBankStatement:
        return {
          schema: setupBankStatementSchema,
          errorMap: projectSetupErrorMap,
        };
    }
  }

  protected async mapToZod(
    context: IContext,
  ): Promise<
    | z.input<ProjectSetupBankDetailsSchemaType>
    | z.input<PostcodeSchema>
    | z.input<ProjectSetupSchema>
    | z.input<BankStatementSchema>
  > {
    if (this.form === FormTypes.PartnerDetailsEdit || this.form === FormTypes.ProjectSetupPostcode) {
      return {
        form: this.form,
        postcodeStatus: this.dto.postcodeStatus ?? PostcodeTaskStatus.Unknown,
        partnerStatus: this.dto.partnerStatus ?? PartnerStatus.Unknown,
        isSetup: this.form === FormTypes.ProjectSetupPostcode,
        postcode: this.dto.postcode,
      };
    } else if (
      this.form === FormTypes.ProjectSetupBankDetails ||
      this.form === FormTypes.ProjectSetupBankDetailsVerify
    ) {
      return {
        projectId: this.dto.projectId,
        partnerId: this.dto.id,
        form: this.form,
        accountNumber: this.dto.bankDetails?.accountNumber ?? undefined,
        sortCode: this.dto.bankDetails?.sortCode ?? undefined,
        companyNumber: this.dto.bankDetails?.companyNumber,
        accountBuilding: this.dto.bankDetails?.address?.accountBuilding,
        accountStreet: this.dto.bankDetails?.address?.accountStreet,
        accountLocality: this.dto.bankDetails?.address?.accountLocality,
        accountTownOrCity: this.dto.bankDetails?.address?.accountTownOrCity,
        accountPostcode: this.dto.bankDetails?.address?.accountPostcode,
        bankCheckValidation: undefined,
      };
    } else if (this.form === FormTypes.ProjectSetupBankStatement) {
      const documents = await context.runQuery(new GetPartnerDocumentsQuery(this.dto.projectId, this.dto.id));
      const hasUploadedBankStatement = documents.some(doc => doc.description === DocumentDescription.BankStatement);
      return { form: this.form, hasUploadedBankStatement };
    } else {
      return {
        form: this.form,
        postcode: this.dto.postcode ?? "",
        bankDetailsTaskStatus: this.dto.bankDetailsTaskStatus ?? BankDetailsTaskStatus.Unknown,
        spendProfileStatus: this.dto.spendProfileStatus ?? SpendProfileStatus.Unknown,
      };
    }
  }

  protected async runRepositoryCommands(context: IContext) {
    try {
      const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.dto.projectId));

      if (!isProjectActive) {
        return Promise.reject(new InActiveProjectError());
      }

      if (!this.savedPartner) {
        this.savedPartner = await context.runQuery(new GetByIdQuery(this.dto.id));
      }

      const partnerDocuments = await context.runQuery(new GetPartnerDocumentsQuery(this.dto.projectId, this.dto.id));

      const mergedPartner: PartnerDto = merge(this.savedPartner, this.dto);
      this.mergedPartner = mergedPartner;

      const update: PartnerUpdatable = {
        Id: this.dto.id,
      };

      if (mergedPartner.partnerStatus === PartnerStatus.Pending) {
        if (mergedPartner.bankCheckStatus === BankCheckStatus.NotValidated && this.check?.validateBankDetails) {
          await this.bankCheckValidate(this.savedPartner, partnerDocuments, update, context);
        }

        if (mergedPartner.bankCheckStatus === BankCheckStatus.ValidationPassed && this.check?.validateBankDetails) {
          await this.updateBankDetails(update);
        }

        if (mergedPartner.bankCheckStatus === BankCheckStatus.ValidationPassed && this.check?.verifyBankDetails) {
          await this.bankCheckVerify(update, context);
        }
      }

      await context.repositories.partners.update({
        ...update,
        Acc_Postcode__c: mergedPartner.postcode ?? undefined,
        Acc_NewForecastNeeded__c: isBoolean(mergedPartner.newForecastNeeded)
          ? mergedPartner.newForecastNeeded
          : undefined,
        Acc_ParticipantStatus__c: new PartnerStatusMapper().mapToSalesforce(mergedPartner.partnerStatus),
        Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(
          this.form === FormTypes.ProjectSetupBankStatement
            ? BankDetailsTaskStatus.Complete
            : mergedPartner.bankDetailsTaskStatus,
        ),
      });
      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async updateBankDetails(update: PartnerUpdatable) {
    if (!this.mergedPartner) {
      return Promise.reject(new Error("attempting to update bank details without bank details present"));
    }
    const { bankDetails } = this.mergedPartner;
    update.Acc_RegistrationNumber__c = bankDetails.companyNumber ?? undefined;
    update.Acc_FirstName__c = bankDetails.firstName ?? undefined;
    update.Acc_LastName__c = bankDetails.lastName ?? undefined;
    update.Acc_AddressStreet__c = bankDetails.address.accountStreet ?? undefined;
    update.Acc_AddressTown__c = bankDetails.address.accountTownOrCity ?? undefined;
    update.Acc_AddressBuildingName__c = bankDetails.address.accountBuilding ?? undefined;
    update.Acc_AddressLocality__c = bankDetails.address.accountLocality ?? undefined;
    update.Acc_AddressPostcode__c = bankDetails.address.accountPostcode ?? undefined;
  }

  private async bankCheckValidate(
    originalDto: PartnerDto,
    partnerDocuments: DocumentSummaryDto[],
    update: PartnerUpdatable,
    context: IContext,
  ) {
    if (!this.mergedPartner) {
      return Promise.reject(new Error("attempting to validate bank details without bank details present"));
    }
    const { bankDetails } = this.mergedPartner;
    if (!bankDetails.sortCode || !bankDetails.accountNumber) {
      return Promise.reject(new BadRequestError("Sort code or account number not provided"));
    }

    const ValidationResult = await context.resources.bankCheckService.validate(
      bankDetails.sortCode,
      bankDetails.accountNumber,
    );

    if (!ValidationResult.checkPassed) {
      if (this.mergedPartner.bankCheckRetryAttempts < context.config.options.bankCheckValidationRetries) {
        return Promise.reject(
          new ValidationError(
            new PartnerDtoValidator(this.mergedPartner, originalDto, partnerDocuments, {
              showValidationErrors: true,
              validateBankDetails: true,
              failBankValidation: true,
            }),
          ),
        );
      }
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationFailed);
    } else {
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationPassed);
    }

    update.Acc_ValidationCheckPassed__c = ValidationResult.checkPassed;
    update.Acc_Iban__c = ValidationResult.iban ?? undefined;
    update.Acc_AccountNumber__c = bankDetails.accountNumber;
    update.Acc_SortCode__c = bankDetails.sortCode;

    if (ValidationResult.conditions) {
      const { severity, code, description } = this.collapseConditions(ValidationResult.conditions);
      update.Acc_ValidationConditionsSeverity__c = severity;
      update.Acc_ValidationConditionsCode__c = code;
      update.Acc_ValidationConditionsDesc__c = description;
    }

    this.updateBankDetails(update);
  }

  /**
   * Verify a project partner's bank account number/sort code and address.
   *
   * @param update The pass-by-reference object of items that we wish to update
   * @param context The user context to run upon.
   */
  private async bankCheckVerify(update: PartnerUpdatable, context: IContext) {
    // When a user wants to verify their bank details, they will be on a "confirmation screen".
    // This confirmation screen displays their account number and sort code with a mask.
    // (e.g. User will send in XX4749 and XXXX8818, so we can't verify on that!)
    //
    // To solve this, we grab the plaintext sort code/account number from Salesforce
    // using the Bank Details service user.
    const unmaskedPartnerDto = await context
      .asBankDetailsValidationUser()
      .runQuery(new GetBankVerificationDetailsByIdQuery(this.dto.id));

    if (!this.mergedPartner) {
      return Promise.reject(new Error("attempting to verify bank details without bank details present"));
    }

    // Grab the bank details from the unmasked partner.
    const { bankDetails } = unmaskedPartnerDto;

    // Run a verification against the bank details that we have re-obtained from Salesforce.
    const VerificationResult = await context.resources.bankCheckService.verify({
      companyName: this.mergedPartner.name,
      registrationNumber: bankDetails.companyNumber ?? "",
      sortcode: bankDetails.sortCode ?? "",
      accountNumber: bankDetails.accountNumber ?? "",
      // As these are business accounts they do not have a named account holder associated,
      // however these values seem to be required by the Experian Verify API.
      // As such, we are hardcoding dummy values for them here.
      firstName: "NA",
      lastName: "NA",
      address: {
        organisation: "",
        buildingName: bankDetails.address?.accountBuilding ?? "",
        street: bankDetails.address?.accountStreet ?? "",
        locality: bankDetails.address?.accountLocality ?? "",
        town: bankDetails.address?.accountTownOrCity ?? "",
        postcode: bankDetails.address?.accountPostcode ?? "",
      },
    });

    const addressScore = parseNumber(VerificationResult.addressScore);
    const companyNameScore = parseNumber(VerificationResult.companyNameScore);
    const personalDetailsScore = parseNumber(VerificationResult.personalDetailsScore);

    if (!this.validateVerifyResponse(addressScore, companyNameScore, VerificationResult.regNumberScore, context)) {
      // If we have failed the test, mark the verification as failed.
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationFailed);
    } else {
      // Otherwise, mark as passed and move the partner onto the "complete" stage.
      update.Acc_BankCheckState__c = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationPassed);
      update.Acc_BankCheckCompleted__c = new BankDetailsTaskStatusMapper().mapToSalesforce(
        BankDetailsTaskStatus.Complete,
      );
    }

    // Save the Experian verification score to Salesforce
    update.Acc_AddressScore__c = addressScore ?? undefined;
    update.Acc_CompanyNameScore__c = companyNameScore ?? undefined;
    update.Acc_PersonalDetailsScore__c = personalDetailsScore ?? undefined;
    update.Acc_RegNumberScore__c = VerificationResult.regNumberScore ?? undefined;

    // Save Experian errors and warnings to Salesforce
    if (VerificationResult.conditions) {
      const { severity, code, description } = this.collapseConditions(VerificationResult.conditions);
      update.Acc_VerificationConditionsSeverity__c = severity;
      update.Acc_VerificationConditionsCode__c = code;
      update.Acc_VerificationConditionsDesc__c = description;
    }
  }

  private validateVerifyResponse(
    addressScore: number | null,
    companyNameScore: number | null,
    regNumberScore: MatchFlag,
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
    if (this.dto.organisationType === "Industrial") {
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

import { BankCheckStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { PartnerStatus, BankCheckStatus, BankDetailsTaskStatus } from "@framework/constants/partner";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError, BankCheckError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import {
  getProjectSetupBankDetailsSchema,
  projectSetupBankDetailsErrorMap,
  ProjectSetupBankDetailsSchemaType,
  UnValidatedSchema,
} from "@ui/pages/projects/setup/projectSetupBankDetails.zod";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { z } from "zod";
import { UpdatePartnerBankDetailsDto } from "@server/apis/partners";
import { BankDetailsTaskStatusMapper } from "@framework/mappers/bankTaskStatus";

export class UpdatePartnerBankDetailsCommand extends ZodAuthorisedAsyncCommandBase<
  { bankCheckStatus: BankCheckStatus },
  ProjectSetupBankDetailsSchemaType,
  UpdatePartnerBankDetailsDto
> {
  protected readonly projectId: ProjectId;
  protected readonly partnerId: PartnerId;
  public readonly runnableName: string = "UpdatePartnerBankDetailsCommand";

  protected dto: UpdatePartnerBankDetailsDto;

  private savedPartner: PartnerDto | null = null;

  constructor(projectId: ProjectId, partnerId: PartnerId, partner: UpdatePartnerBankDetailsDto) {
    super();
    this.dto = partner;
    this.projectId = projectId;
    this.partnerId = partnerId;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.projectId, this.partnerId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema(context: IContext) {
    this.savedPartner = await context.runQuery(new GetByIdQuery(this.partnerId));

    return {
      schema: getProjectSetupBankDetailsSchema(this.savedPartner.bankCheckStatus),
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected dtoIsUnValidated(dto: UpdatePartnerBankDetailsDto): dto is z.output<UnValidatedSchema> {
    return dto.bankCheckStatus === BankCheckStatus.NotValidated;
  }

  protected async mapToZod() {
    if (this.dtoIsUnValidated(this.dto)) {
      return {
        form: this.dto.form,
        accountNumber: this.dto.accountNumber,
        sortCode: this.dto.sortCode,
        companyNumber: this.dto.companyNumber,
        accountBuilding: this.dto.accountBuilding,
        accountStreet: this.dto.accountStreet,
        accountLocality: this.dto.accountLocality,
        accountTownOrCity: this.dto.accountTownOrCity,
        accountPostcode: this.dto.accountPostcode,
        bankCheckStatus: this.dto.bankCheckStatus,
        bankCheckValidation: undefined,
      };
    } else {
      return {
        form: this.dto.form,
        companyNumber: this.dto.companyNumber,
        accountBuilding: this.dto.accountBuilding,
        accountStreet: this.dto.accountStreet,
        accountLocality: this.dto.accountLocality,
        accountTownOrCity: this.dto.accountTownOrCity,
        accountPostcode: this.dto.accountPostcode,
        bankCheckStatus: this.dto.bankCheckStatus,
        bankCheckValidation: undefined,
      };
    }
  }

  protected async runRepositoryCommands(context: IContext, validatedData: z.output<ProjectSetupBankDetailsSchemaType>) {
    try {
      if (!this.savedPartner) {
        this.savedPartner = await context.runQuery(new GetByIdQuery(this.partnerId));
      }

      let passedBankCheck = true;
      if (this.savedPartner.partnerStatus === PartnerStatus.Pending) {
        if (this.dtoIsUnValidated(validatedData)) {
          passedBankCheck = await this.validateBankDetails(
            context,
            validatedData.sortCode,
            validatedData.accountNumber,
            this.savedPartner.bankCheckRetryAttempts,
          );
        }
      }

      await context.repositories.partners.update({
        Id: this.partnerId,
        ...(this.dtoIsUnValidated(validatedData)
          ? { Acc_SortCode__c: validatedData.sortCode, Acc_AccountNumber__c: validatedData.accountNumber }
          : {}),
        Acc_RegistrationNumber__c: validatedData.companyNumber,
        Acc_AddressStreet__c: validatedData.accountStreet,
        Acc_AddressTown__c: validatedData.accountTownOrCity,
        Acc_AddressBuildingName__c: validatedData.accountBuilding,
        Acc_AddressLocality__c: validatedData.accountLocality,
        Acc_AddressPostcode__c: validatedData.accountPostcode,
        Acc_BankCheckState__c: new BankCheckStatusMapper().mapToSalesforce(
          passedBankCheck ? BankCheckStatus.ValidationPassed : BankCheckStatus.ValidationFailed,
        ),
        Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete),
      });
      return { bankCheckStatus: passedBankCheck ? BankCheckStatus.ValidationPassed : BankCheckStatus.ValidationFailed };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async validateBankDetails(
    context: IContext,
    sortCode: string,
    accountNumber: string,
    bankCheckRetryAttempts: number,
  ) {
    if (!sortCode || !accountNumber) {
      return Promise.reject(new BadRequestError("Sort code or account number not provided"));
    }

    const bankCheckValidationResult = await context.resources.bankCheckService.validate(sortCode, accountNumber);

    if (!bankCheckValidationResult.checkPassed) {
      if (bankCheckRetryAttempts < context.config.options.bankCheckValidationRetries) {
        await context.repositories.partners.update({
          Id: this.partnerId,
          Acc_BankCheckState__c: new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationFailed),
          Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(
            BankDetailsTaskStatus.Incomplete,
          ),
        });
        return Promise.reject(new BankCheckError());
      }
      return false;
    } else {
      return true;
    }
  }
}

import { BankCheckStatus, PartnerStatus } from "@framework/constants/partner";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { BankCheckStatusMapper } from "@framework/mappers/bankCheckStatus";
import { IContext } from "@framework/types/IContext";
import { UpdatePartnerBankDetailsDto } from "@server/apis/partners";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { BadRequestError } from "@shared/appError";
import {
  ProjectSetupBankDetailsParams,
  ProjectSetupBankDetailsRoute,
} from "@ui/pages/projects/setup/projectSetupBankDetails.page";
import {
  ProjectSetupBankDetailsSchemaType,
  UnValidatedSchema,
  getProjectSetupBankDetailsSchema,
  projectSetupBankDetailsErrorMap,
} from "@ui/pages/projects/setup/projectSetupBankDetails.zod";
import { ProjectSetupBankDetailsVerifyRoute } from "@ui/pages/projects/setup/projectSetupBankDetailsVerify.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export class ProjectSetupBankDetailsHandler extends ZodFormHandlerBase<
  ProjectSetupBankDetailsSchemaType,
  ProjectSetupBankDetailsParams
> {
  private savedPartner: PartnerDto | null = null;

  constructor() {
    super({
      routes: [ProjectSetupBankDetailsRoute],
      forms: [FormTypes.ProjectSetupBankDetails],
    });
  }

  public acceptFiles = false;

  protected async getZodSchema({ params, context }: { params: ProjectSetupBankDetailsParams; context: IContext }) {
    this.savedPartner = await context.runQuery(new GetByIdQuery(params.partnerId));

    return {
      schema: getProjectSetupBankDetailsSchema(this.savedPartner.bankCheckStatus),
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ProjectSetupBankDetailsSchemaType>> {
    return {
      form: FormTypes.ProjectSetupBankDetails,
      companyNumber: input.companyNumber,
      accountBuilding: input.accountBuilding,
      accountStreet: input.accountStreet,
      accountLocality: input.accountLocality,
      accountTownOrCity: input.accountTownOrCity,
      accountPostcode: input.accountPostcode,
      sortCode: input.sortCode,
      accountNumber: input.accountNumber,
      bankCheckStatus: input.bankCheckStatus,
    };
  }

  protected dtoIsUnValidated(
    dto: Omit<UpdatePartnerBankDetailsDto, "bankCheckRetryAttempts">,
  ): dto is z.output<UnValidatedSchema> {
    return (
      dto.bankCheckStatus === BankCheckStatus.NotValidated || dto.bankCheckStatus === BankCheckStatus.ValidationFailed
    );
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ProjectSetupBankDetailsSchemaType>;
    params: ProjectSetupBankDetailsParams;
    context: IContext;
  }): Promise<string> {
    if (!this.savedPartner) {
      this.savedPartner = await context.runQuery(new GetByIdQuery(params.partnerId));
    }

    let passedBankCheck = true;
    if (this.savedPartner.partnerStatus === PartnerStatus.Pending) {
      if (this.dtoIsUnValidated(input)) {
        passedBankCheck = await this.validateBankDetails(context, input.sortCode, input.accountNumber);
      }
    }

    await context.repositories.partners.update({
      Id: params.partnerId,
      Acc_RegistrationNumber__c: input.companyNumber,
      Acc_AddressStreet__c: input.accountStreet,
      Acc_AddressTown__c: input.accountTownOrCity,
      Acc_AddressBuildingName__c: input.accountBuilding,
      Acc_AddressLocality__c: input.accountLocality,
      Acc_AddressPostcode__c: input.accountPostcode,
      Acc_BankCheckState__c: new BankCheckStatusMapper().mapToSalesforce(
        passedBankCheck ? BankCheckStatus.ValidationPassed : BankCheckStatus.ValidationFailed,
      ),
      ...(this.dtoIsUnValidated(input) && passedBankCheck
        ? { Acc_SortCode__c: input.sortCode, Acc_AccountNumber__c: input.accountNumber }
        : {}),
    });

    return passedBankCheck
      ? ProjectSetupBankDetailsVerifyRoute.getLink(params).path
      : ProjectSetupBankDetailsRoute.getLink(params).path;
  }

  private async validateBankDetails(context: IContext, sortCode: string, accountNumber: string) {
    if (!sortCode || !accountNumber) {
      return Promise.reject(new BadRequestError("Sort code or account number not provided"));
    }

    const bankCheckValidationResult = await context.resources.bankCheckService.validate(sortCode, accountNumber);

    return !bankCheckValidationResult.checkPassed;
  }
}

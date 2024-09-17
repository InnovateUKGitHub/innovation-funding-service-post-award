import { BankCheckStatus } from "@framework/constants/partner";
import { BankCheckStatusMapper } from "@framework/mappers/bankCheckStatus";
import { IContext } from "@framework/types/IContext";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FailedBankCheckConfirmationRoute } from "@ui/containers/pages/projects/failedBankCheckConfirmation.page";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import {
  ProjectSetupBankDetailsParams,
  ProjectSetupBankDetailsRoute,
} from "@ui/containers/pages/projects/setup/projectSetupBankDetails.page";
import {
  getProjectSetupBankDetailsSchema,
  projectSetupBankDetailsErrorMap,
  ProjectSetupBankDetailsSchemaType,
} from "@ui/containers/pages/projects/setup/projectSetupBankDetails.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectSetupBankDetailsVerifyHandler extends ZodFormHandlerBase<
  ProjectSetupBankDetailsSchemaType,
  ProjectSetupBankDetailsParams
> {
  private bankStatusBeforeSubmit: BankCheckStatus | undefined;

  constructor() {
    super({
      routes: [ProjectSetupBankDetailsRoute],
      forms: [FormTypes.ProjectSetupBankDetails],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ context, params }: { params: ProjectSetupBankDetailsParams; context: IContext }) {
    const partnerDto = await context.repositories.partners.getById(params.partnerId);
    this.bankStatusBeforeSubmit = new BankCheckStatusMapper().mapFromSalesforce(partnerDto.bankCheckStatus);

    return {
      schema: getProjectSetupBankDetailsSchema(this.bankStatusBeforeSubmit),
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ProjectSetupBankDetailsParams;
  }): Promise<z.input<ProjectSetupBankDetailsSchemaType>> {
    return {
      form: input.form,
      projectId: params.projectId,
      partnerId: params.partnerId,
      companyNumber: input.companyNumber,
      accountBuilding: input.accountBuilding,
      accountStreet: input.accountStreet,
      accountLocality: input.accountLocality,
      accountTownOrCity: input.accountTownOrCity,
      accountPostcode: input.accountPostcode,
      bankCheckValidation: undefined,
      ...(this.bankStatusBeforeSubmit !== BankCheckStatus.ValidationPassed
        ? {
            sortCode: input.sortCode,
            accountNumber: input.accountNumber,
          }
        : {}),
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<ProjectSetupBankDetailsSchemaType>;
    params: ProjectSetupBankDetailsParams;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(
      new UpdatePartnerCommand(
        { id: params.partnerId, ...input },
        {
          verifyBankDetails: true,
        },
      ),
    );

    // Re-obtain the new results
    const partnerDto = await context.repositories.partners.getById(params.partnerId);
    const bankStatusAfterSubmit = new BankCheckStatusMapper().mapFromSalesforce(partnerDto.bankCheckStatus);

    if (bankStatusAfterSubmit === BankCheckStatus.VerificationPassed) {
      // We've passed - Go to the ProjectSetupRoute.
      return ProjectSetupRoute.getLink(params).path;
    } else if (bankStatusAfterSubmit === BankCheckStatus.VerificationFailed) {
      // We've failed - Go to fallback screen.
      return FailedBankCheckConfirmationRoute.getLink(params).path;
    } else {
      // Unknown state! Go back to the first page entirely.
      return ProjectSetupRoute.getLink(params).path;
    }
  }
}

export { ProjectSetupBankDetailsVerifyHandler };

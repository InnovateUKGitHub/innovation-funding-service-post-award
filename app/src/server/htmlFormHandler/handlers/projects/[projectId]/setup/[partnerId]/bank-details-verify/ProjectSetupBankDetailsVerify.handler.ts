import { BankCheckStatus } from "@framework/constants/partner";
import { Partner } from "@framework/entities/partner";
import { BankCheckStatusMapper } from "@framework/mappers/bankCheckStatus";
import { IContext } from "@framework/types/IContext";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FailedBankCheckConfirmationRoute } from "@ui/containers/pages/projects/failedBankCheckConfirmation.page";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import { ProjectSetupBankDetailsParams } from "@ui/containers/pages/projects/setup/projectSetupBankDetails.page";
import {
  getProjectSetupBankDetailsSchema,
  projectSetupBankDetailsErrorMap,
  ProjectSetupBankDetailsSchemaType,
} from "@ui/containers/pages/projects/setup/projectSetupBankDetails.zod";
import { ProjectSetupBankDetailsVerifyRoute } from "@ui/containers/pages/projects/setup/projectSetupBankDetailsVerify.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectSetupBankDetailsVerifyHandler extends ZodFormHandlerBase<
  ProjectSetupBankDetailsSchemaType,
  ProjectSetupBankDetailsParams
> {
  private partner: Partner | undefined;

  constructor() {
    super({
      routes: [ProjectSetupBankDetailsVerifyRoute],
      forms: [FormTypes.ProjectSetupBankDetailsVerify],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ context, params }: { params: ProjectSetupBankDetailsParams; context: IContext }) {
    this.partner = await context.repositories.partners.getById(params.partnerId);
    const bankStatusBeforeSubmit = new BankCheckStatusMapper().mapFromSalesforce(this.partner.bankCheckStatus);

    return {
      schema: getProjectSetupBankDetailsSchema(bankStatusBeforeSubmit),
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
    context,
  }: {
    input: AnyObject;
    params: ProjectSetupBankDetailsParams;
    context: IContext;
  }): Promise<z.input<ProjectSetupBankDetailsSchemaType>> {
    if (!this.partner) {
      this.partner = await context.repositories.partners.getById(params.partnerId);
    }

    return {
      form: input.form,
      projectId: params.projectId,
      partnerId: params.partnerId,
      companyNumber: this.partner.companyNumber,
      accountBuilding: this.partner.accountBuilding,
      accountStreet: this.partner.accountStreet,
      accountLocality: this.partner.accountLocality,
      accountTownOrCity: this.partner.accountTownOrCity,
      accountPostcode: this.partner.accountPostcode,
      bankCheckValidation: undefined,
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

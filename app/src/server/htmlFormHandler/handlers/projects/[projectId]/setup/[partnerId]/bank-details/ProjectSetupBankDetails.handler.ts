import { PartnerDto } from "@framework/dtos/partnerDto";
import { IContext } from "@framework/types/IContext";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PartnerDetailsParams } from "@ui/pages/projects/partnerDetails/partnerDetailsEdit.page";
import {
  ProjectSetupBankDetailsParams,
  ProjectSetupBankDetailsRoute,
} from "@ui/pages/projects/setup/projectSetupBankDetails.page";
import {
  ProjectSetupBankDetailsSchemaType,
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
  constructor() {
    super({
      routes: [ProjectSetupBankDetailsRoute],
      forms: [FormTypes.ProjectSetupBankDetails],
    });
  }

  public acceptFiles = false;

  protected async getZodSchema({ params, context }: { params: ProjectSetupBankDetailsParams; context: IContext }) {
    const partner = await context.runQuery(new GetByIdQuery(params.partnerId));

    return {
      schema: getProjectSetupBankDetailsSchema(partner.bankCheckStatus),
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: PartnerDetailsParams;
  }): Promise<z.input<ProjectSetupBankDetailsSchemaType>> {
    return {
      projectId: params.projectId,
      partnerId: params.partnerId,
      form: FormTypes.ProjectSetupBankDetails,
      companyNumber: input.companyNumber,
      accountBuilding: input.accountBuilding,
      accountStreet: input.accountStreet,
      accountLocality: input.accountLocality,
      accountTownOrCity: input.accountTownOrCity,
      accountPostcode: input.accountPostcode,
      sortCode: input.sortCode,
      accountNumber: input.accountNumber,
    };
  }

  private async getDto(
    context: IContext,
    params: PartnerDetailsParams,
    input: z.output<ProjectSetupBankDetailsSchemaType>,
  ): Promise<PartnerDto> {
    const dto = await context.runQuery(new GetByIdQuery(params.partnerId));

    dto.bankDetails.companyNumber = input.companyNumber ?? null;
    dto.bankDetails.address.accountBuilding = input.accountBuilding ?? null;
    dto.bankDetails.address.accountLocality = input.accountLocality ?? null;
    dto.bankDetails.address.accountPostcode = input.accountPostcode ?? null;
    dto.bankDetails.address.accountStreet = input.accountStreet ?? null;
    dto.bankDetails.address.accountTownOrCity = input.accountTownOrCity ?? null;

    if ("sortCode" in input) {
      dto.bankDetails.sortCode = input.sortCode;
      dto.bankDetails.accountNumber = input.accountNumber;
    }

    return dto;
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<ProjectSetupBankDetailsSchemaType>;
    context: IContext;
  }): Promise<string> {
    const params = { projectId: input.projectId, partnerId: input.partnerId };
    await context.runCommand(
      new UpdatePartnerCommand(await this.getDto(context, params, input), { validateBankDetails: true }),
    );
    return ProjectSetupBankDetailsVerifyRoute.getLink(params).path;
  }
}

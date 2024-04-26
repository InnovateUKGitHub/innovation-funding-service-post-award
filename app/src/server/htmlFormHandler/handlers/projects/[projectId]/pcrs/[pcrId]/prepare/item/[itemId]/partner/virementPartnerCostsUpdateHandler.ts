import { IContext } from "@framework/types/IContext";
import { parseCurrency } from "@framework/util/numberHelper";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { BadRequestError } from "@shared/appError";
import {
  FinancialVirementEditPartnerLevelRoute,
  FinancialVirementParams,
} from "@ui/containers/pages/pcrs/financialVirements/edit/partner/editPartnerLevel.page";
import {
  EditPartnerLevelSchemaType,
  editPartnerLevelSchema,
  errorMap,
} from "@ui/containers/pages/pcrs/financialVirements/edit/partner/editPartnerLevel.zod";
import { PCRPrepareItemRoute } from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { sumBy } from "lodash";
import { z } from "zod";

type PartnerData = {
  partnerId: PartnerId;
  newRemainingCosts: number;
  newRemainingGrant: string;
  originalRemainingCosts: number;
  originalRemainingGrant: number;
  originalFundingLevel: number;
};

export class VirementPartnerCostsUpdateHandler extends ZodFormHandlerBase<
  EditPartnerLevelSchemaType,
  FinancialVirementParams
> {
  constructor() {
    super({
      route: FinancialVirementEditPartnerLevelRoute,
      forms: [FormTypes.PcrFinancialVirementEditRemainingGrant],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: editPartnerLevelSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<EditPartnerLevelSchemaType>> {
    const partnerEntries = Object.entries(input).filter(([k]) => /partner/.test(k));

    const partners = partnerEntries.reduce((acc: PartnerData[], [k, v]) => {
      const [, indexStr, field] = k.split(".");
      const idx = Number(indexStr);
      if (!acc[idx]) {
        acc[idx] = {} as PartnerData;
      }
      if (field === "partnerId") acc[idx][field] = v as PartnerId;
      if (field === "newRemainingCosts") acc[idx][field] = parseCurrency(v ?? "0");
      if (field === "newRemainingGrant") acc[idx][field] = v || "0";
      if (field === "originalRemainingCosts") acc[idx][field] = parseCurrency(v ?? "0");
      if (field === "originalRemainingGrant") acc[idx][field] = parseCurrency(v ?? "0");
      if (field === "originalFundingLevel") acc[idx][field] = parseFloat(v ?? "0");
      return acc;
    }, []);

    return {
      form: input.form,
      partners,
      newRemainingGrant: sumBy(partners, x => parseCurrency(x.newRemainingGrant)),
      originalRemainingGrant: parseCurrency(input.originalRemainingGrant),
      newRemainingCosts: parseCurrency(input.newRemainingCosts),
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<EditPartnerLevelSchemaType>;
    params: FinancialVirementParams;
    context: IContext;
  }): Promise<string> {
    const { projectId, pcrId, itemId } = params;

    const virementDto = await context.runQuery(new GetFinancialVirementQuery(projectId, itemId));
    if (!virementDto) {
      throw new BadRequestError("Virement not found");
    }

    virementDto.partners.forEach(partner => {
      const matchingPartner = input.partners.find(x => x.partnerId === partner.partnerId);
      if (!matchingPartner) return;
      const val = parseFloat(matchingPartner.newRemainingGrant);
      partner.newRemainingGrant = val;
      partner.newFundingLevel = (100 * (val || 0)) / partner.newRemainingCosts;
    });

    virementDto.newRemainingGrant = virementDto.partners.reduce(
      (total, current) => total + (current.newRemainingGrant || 0),
      0,
    );
    virementDto.newFundingLevel = (100 * virementDto.newRemainingGrant) / virementDto.newRemainingCosts;

    await context.runCommand(new UpdateFinancialVirementCommand(projectId, pcrId, itemId, virementDto, true));

    return PCRPrepareItemRoute.getLink({ projectId, pcrId, itemId }).path;
  }
}

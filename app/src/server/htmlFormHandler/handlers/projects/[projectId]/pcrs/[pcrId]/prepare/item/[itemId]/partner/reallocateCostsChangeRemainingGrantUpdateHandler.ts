import { IContext } from "@framework/types/IContext";
import { parseCurrency } from "@framework/util/numberHelper";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { BadRequestError } from "@shared/appError";
import { getNewFundingLevel } from "@ui/containers/pages/pcrs/financialVirements/edit/partner/changeRemainingGrant.logic";
import {
  ChangeRemainingGrantRoute,
  FinancialVirementParams,
} from "@ui/containers/pages/pcrs/financialVirements/edit/partner/changeRemainingGrant.page";
import {
  ChangeRemainingGrantSchemaType,
  changeRemainingGrantSchema,
  errorMap,
} from "@ui/containers/pages/pcrs/financialVirements/edit/partner/changeRemainingGrant.zod";
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
  newFundingLevel: number;
};

export class ChangeRemainingGrantUpdateHandler extends ZodFormHandlerBase<
  ChangeRemainingGrantSchemaType,
  FinancialVirementParams
> {
  constructor() {
    super({
      routes: [ChangeRemainingGrantRoute],
      forms: [FormTypes.PcrReallocateCostsChangeRemainingGrant],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: changeRemainingGrantSchema,
      errorMap,
    };
  }

  protected async mapToZod({
    input,
  }: {
    input: Record<string, string>;
  }): Promise<z.input<ChangeRemainingGrantSchemaType>> {
    const MAX_NUMBER_ENTRIES = 800;
    const partnerEntries = Object.entries(input)
      .filter(([k]) => /partners/.test(k))
      .slice(0, MAX_NUMBER_ENTRIES);

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

    partnerEntries
      .filter(([k]) => /newFundingLevel/.test(k))
      .forEach(([k, v]) => {
        const [, indexStr] = k.split(".");
        const idx = Number(indexStr);
        const parsedNewFundingLevel = parseFloat(v ?? "0");
        const newFundingLevel = getNewFundingLevel(
          partners[idx]["newRemainingCosts"],
          parseCurrency(partners[idx]["newRemainingGrant"]),
          parsedNewFundingLevel,
        );

        partners[idx]["newFundingLevel"] = newFundingLevel;
      });

    return {
      form: input.form as FormTypes.PcrReallocateCostsChangeRemainingGrant,
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
    input: z.output<ChangeRemainingGrantSchemaType>;
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

      partner.newRemainingGrant = parseCurrency(matchingPartner.newRemainingGrant);
      partner.newFundingLevel = matchingPartner.newFundingLevel;
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

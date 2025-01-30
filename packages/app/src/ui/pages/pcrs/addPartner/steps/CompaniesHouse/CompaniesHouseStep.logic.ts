import { useMemo } from "react";
import { usePcrWorkflowContext } from "../../../pcrItemWorkflow";
import {
  pcrAddPartnerCompaniesHouseStepErrorMap,
  PcrAddPartnerCompaniesHouseStepSchemaType,
  pcrAddPartnerCompaniesHouseStepSearchSchema,
  pcrAddPartnerCompaniesHouseStepSearchSelectSchema,
} from "../schemas/companiesHouse.zod";
import { DeserialisedCompaniesHouseSearchData } from "./CompaniesHouseSearch";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { clientsideApiClient } from "@ui/apiClient";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { z } from "zod";

const useDefaultCompaniesHouseResult = (): DeserialisedCompaniesHouseSearchData | null => {
  const { companiesHouseResult } = usePcrWorkflowContext();

  return useMemo(() => {
    try {
      if (typeof companiesHouseResult !== "string") return null;
      const reg = JSON.parse(companiesHouseResult);
      const data = pcrAddPartnerCompaniesHouseStepSearchSelectSchema.parse(reg);
      return data;
    } catch {
      return null;
    }
  }, [companiesHouseResult]);
};

const useValidateInitialSearchQuery = (data: unknown) => {
  const results = pcrAddPartnerCompaniesHouseStepSearchSchema.safeParse(data, {
    errorMap: pcrAddPartnerCompaniesHouseStepErrorMap,
  });
  if (results.success) return;
  return results.error.errors;
};

export const useOnUpdateCompanyDetails = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<PcrAddPartnerCompaniesHouseStepSchemaType>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.addPartnerCompanyDetails({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<PcrAddPartnerCompaniesHouseStepSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};

export { useDefaultCompaniesHouseResult, useValidateInitialSearchQuery };

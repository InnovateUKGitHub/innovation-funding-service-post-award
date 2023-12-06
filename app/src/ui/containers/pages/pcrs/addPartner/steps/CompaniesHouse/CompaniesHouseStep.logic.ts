import { useMemo } from "react";
import { usePcrWorkflowContext } from "../../../pcrItemWorkflowMigrated";
import {
  pcrAddPartnerCompaniesHouseStepErrorMap,
  pcrAddPartnerCompaniesHouseStepSearchSchema,
  pcrAddPartnerCompaniesHouseStepSearchSelectSchema,
} from "../schemas/companiesHouse.zod";
import { DeserialisedCompaniesHouseSearchData } from "./CompaniesHouseSearch";

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

export { useDefaultCompaniesHouseResult, useValidateInitialSearchQuery };

import { removeSpaces } from "@shared/string-helpers";

const getKey = (...args: (string | number | boolean | "all")[]) => args.join("_");

const getLoansKey = (projectId: ProjectId) => getKey("loansKey", "loans", projectId);
const getLoanKey = (projectId: ProjectId, loanId: string) =>
  getKey("loanKey", "loan", "project", projectId, "loan", loanId);
const getLoanByPeriod = (projectId: ProjectId, periodId: number) =>
  getKey("loanKey", "loan", "project", projectId, "period", periodId);
const getAccountKey = () => getKey("accountKey", "account", "all");
const getBroadcastsKey = () => getKey("broadcastsKey", "broadcast", "all");
const getBroadcastKey = (broadcastId: string) => getKey("broadcastKey", "broadcast", broadcastId);
const getJesAccountKey = (searchString: string) => getKey("jesAccountKey", "account", searchString);
const getProjectKey = (projectId: ProjectId) => getKey("projectKey", "project", projectId);
const getProjectsKey = () => getKey("projectsKey", "project", "all");
const getProjectsKeyAsDeveloper = () => getKey("projectsKey", "project", "all", "developer");
const getProjectContactsKey = (projectId: ProjectId) => getKey("projectContactsKey", projectId);
const getProjectContactsKeyAsDeveloper = (projectId: ProjectId) => getKey("projectContactsKey", projectId, "developer");
const getValidProjectStatusKey = (projectId: ProjectId) => getKey("validProjectStatus", getProjectKey(projectId));
const getPartnerKey = (partnerId: PartnerId) => getKey("partnerKey", "partner", partnerId);
const getPartnersKey = () => getKey("partnersKey", "partner", "all");
const getCostCategoryKey = (partnerId: PartnerId) => getKey("costCategoryKey", "filtered", partnerId);
const getClaimKey = (partnerId: PartnerId, periodId: number) =>
  getKey("claimKey", "partner", partnerId, "period", periodId);
const getClaimOverrideKey = (partnerId: PartnerId) => getKey("claimOverrideKey", "partner", partnerId);
const getClaimTotalCostsKey = (partnerId: PartnerId, projectId: ProjectId, periodId: number) =>
  getKey("claimTotalCosts", "project", projectId, "partner", partnerId, "period", periodId);
const getClaimDetailKey = (partnerId: PartnerId, periodId: number, costCategoryId: string) =>
  getKey("claimDetailsKey", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getForecastDetailKey = (partnerId: PartnerId, periodId: number, costCategoryId: string) =>
  getKey("forecastDetailKey", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getMonitoringReportKey = (projectId: ProjectId, id?: string) =>
  getKey("monitoringReportKey", "project", projectId, "report", id || "new");
const getPcrKey = (projectId: ProjectId, id?: string) => getKey("pcrKey", "project", projectId, "request", id || "new");
const getFinancialLoanVirementKey = (projectId: ProjectId, pcrId: PcrId, itemId: string) =>
  getKey("financialLoanVirement", "project", projectId, "request", pcrId, "itemId", itemId);
const getFinancialVirementKey = (projectId: ProjectId, pcrId: PcrId, itemId: string, partnerId?: string) => {
  if (partnerId) {
    return getKey(
      "financialVirementKey",
      "project",
      projectId,
      "request",
      pcrId,
      "itemId",
      itemId,
      "partnerId",
      partnerId,
    );
  }

  return getKey("financialVirementKey", "project", projectId, "request", pcrId, "itemId", itemId);
};
const getPcrTypesKey = () => getKey("pcrTypesKey", "all");
const pcrAvailableTypesKey = (projectId: ProjectId) => getKey("pcrAvailableTypesKey", "project", projectId);
const pcrTimeExtensionOptionsKey = (projectId: ProjectId) => getKey("pcrTimeExtensionOptionsKey", "project", projectId);
const getPcrProjectRolesKey = () => getKey("pcrProjectRolesKey", "all");
const getPcrPartnerTypesKey = () => getKey("pcrPartnerTypesTypesKey", "all");
const getPcrParticipantSizesKey = () => getKey("pcrParticipantSizesKey", "all");
const getPcrProjectLocationsKey = () => getKey("pcrProjectLocationsKey", "all");
const getPcrSpendProfileCapitalUsageTypesKey = () => getKey("pcrSpendProfileCapitalUsageTypesKey", "all");
const getPcrSpendProfileOverheadRateOptionsKey = () => getKey("pcrSpendProfileOverheadRateOptionsKey", "all");
const getCompaniesKey = (searchString: string, itemsPerPage?: number, startIndex?: number) =>
  getKey(
    "companiesKey",
    "search",
    removeSpaces(searchString, "-"),
    "items",
    itemsPerPage || "unspecified",
    "index",
    startIndex || "0",
  );

export const storeKeys = {
  getLoansKey,
  getLoanKey,
  getLoanByPeriod,
  getAccountKey,
  getBroadcastsKey,
  getBroadcastKey,
  getJesAccountKey,
  getProjectKey,
  getProjectsKey,
  getProjectsKeyAsDeveloper,
  getProjectContactsKey,
  getProjectContactsKeyAsDeveloper,
  getValidProjectStatusKey,
  getPartnerKey,
  getPartnersKey,
  getCostCategoryKey,
  getClaimKey,
  getClaimOverrideKey,
  getClaimTotalCostsKey,
  getClaimDetailKey,
  getForecastDetailKey,
  getMonitoringReportKey,
  getPcrKey,
  getFinancialVirementKey,
  getFinancialLoanVirementKey,
  getPcrTypesKey,
  pcrAvailableTypesKey,
  pcrTimeExtensionOptionsKey,
  getPcrProjectRolesKey,
  getPcrPartnerTypesKey,
  getPcrParticipantSizesKey,
  getPcrProjectLocationsKey,
  getPcrSpendProfileCapitalUsageTypesKey,
  getPcrSpendProfileOverheadRateOptionsKey,
  getCompaniesKey,
};

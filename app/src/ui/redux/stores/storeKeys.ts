import { removeSpaces } from "@shared/string-helpers";

const getKey = (...args: (string | number | boolean | "all")[]) => args.join("_");

const getLoansKey = (projectId: string) => getKey("loansKey", "loans", projectId);
const getLoanKey = (projectId: string, loanId: string) => getKey("loanKey", "loan", "project", projectId, "loan", loanId);
const getAccountKey = () => getKey("accountKey", "account", "all");
const getBroadcastsKey = () => getKey("broadcastsKey", "broadcast", "all");
const getBroadcastKey = (broadcastId: string) => getKey("broadcastKey", "broadcast", broadcastId);
const getJesAccountKey = (searchString: string) => getKey("jesAccountKey", "account", searchString);
const getProjectKey = (projectId: string) => getKey("projectKey", "project", projectId);
const getProjectsKey = () => getKey("projectsKey", "project", "all");
const getValidProjectStatusKey = (projectId: string) => getKey("validProjectStatus", getProjectKey(projectId));
const getPartnerKey = (partnerId: string) => getKey("validProjectStatus", "partner", partnerId);
const getPartnersKey = () => getKey("partnersKey", "partner", "all");
const getCostCategoryKey = (partnerId: string) => getKey("costCategoryKey", "filtered", partnerId);
const getClaimKey = (partnerId: string, periodId: number) => getKey("claimKey", "partner", partnerId, "period", periodId);
const getClaimTotalCostsKey = (partnerId: string, projectId: string, periodId: number) => getKey("claimTotalCosts", "project", projectId, "partner", partnerId, "period", periodId);
const getClaimDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("claimDetailsKey", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getForecastDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("forecastDetailKey", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getMonitoringReportKey = (projectId: string, id?: string) => getKey("monitoringReportKey", "project", projectId, "report", id || "new");
const getPcrKey = (projectId: string, id?: string) => getKey("pcrKey", "project", projectId, "request", id || "new");
const getFinancialVirementKey = (projectId: string, pcrId: string, itemId: string, partnerId?: string) => {
  if (partnerId) {
    return getKey("financialVirementKey", "project", projectId, "request", pcrId, "itemId", itemId, "partnerId", partnerId);
  }

  return getKey("financialVirementKey", "project", projectId, "request", pcrId, "itemId", itemId);
};
const getPcrTypesKey = () => getKey("pcrTypesKey", "all");
const pcrAvailableTypesKey = (projectId: string) => getKey("pcrAvailableTypesKey", "project", projectId);
const pcrTimeExtensionOptionsKey = (projectId: string) => getKey("pcrTimeExtensionOptionsKey", "project", projectId);
const getPcrProjectRolesKey = () => getKey("pcrProjectRolesKey", "all");
const getPcrPartnerTypesKey = () => getKey("pcrPartnerTypesTypesKey", "all");
const getPcrParticipantSizesKey = () => getKey("pcrParticipantSizesKey", "all");
const getPcrProjectLocationsKey = () => getKey("pcrProjectLocationsKey", "all");
const getPcrSpendProfileCapitalUsageTypesKey = () => getKey("pcrSpendProfileCapitalUsageTypesKey", "all");
const getPcrSpendProfileOverheadRateOptionsKey = () => getKey("pcrSpendProfileOverheadRateOptionsKey", "all");
const getCompaniesKey = (searchString: string, itemsPerPage?: number, startIndex?: number) => getKey("companiesKey", "search", removeSpaces(searchString, "-"), "items", itemsPerPage || "unspecified", "index", startIndex || "0");

export const storeKeys = {
  getLoansKey,
  getLoanKey,
  getAccountKey,
  getBroadcastsKey,
  getBroadcastKey,
  getJesAccountKey,
  getProjectKey,
  getProjectsKey,
  getValidProjectStatusKey,
  getPartnerKey,
  getPartnersKey,
  getCostCategoryKey,
  getClaimKey,
  getClaimTotalCostsKey,
  getClaimDetailKey,
  getForecastDetailKey,
  getMonitoringReportKey,
  getPcrKey,
  getFinancialVirementKey,
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

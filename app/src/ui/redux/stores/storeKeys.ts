const getKey = (...args: (string | number | boolean | "all")[]) => args.join("_");

const getProjectKey = (projectId: string) => getKey("projectKey", "project", projectId);
const getProjectsKey = () => getKey("projectsKey", "project", "all");
const getPartnerKey = (partnerId: string) => getKey("partnerKey", "partner", partnerId);
const getPartnersKey = () => getKey("partnersKey", "partner", "all");
const getClaimKey = (partnerId: string, periodId: number) => getKey("claimKey", "partner", partnerId, "period", periodId);
const getClaimDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("claimDetailsKey", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getForecastDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("forecastDetailKey", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getMonitoringReportKey = (projectId: string, id?: string) => getKey("monitoringReportKey", "project", projectId, "report", id || "new");
const getPcrKey = (projectId: string, id?: string) => getKey("pcrKey", "project", projectId, "request", id || "new");
const getFinancialVirementKey = (projectId: string, pcrId: string, itemId: string) => getKey("financialVirementKey", "project", projectId, "request", pcrId, "itemId", itemId);
const getPcrTypesKey = () => getKey("pcrTypesKey", "all");
const getPcrProjectRolesKey = () => getKey("pcrProjectRolesKey", "all");
const getPcrPartnerTypesKey = () => getKey("pcrPartnerTypesTypesKey", "all");
const getPcrParticipantSizesKey = () => getKey("pcrParticipantSizesKey", "all");
const getPcrProjectLocationsKey = () => getKey("pcrProjectLocationsKey", "all");
const getPcrSpendProfileCapitalUsageTypesKey = () => getKey("pcrSpendProfileCapitalUsageTypesKey", "all");
const getPcrSpendProfileOverheadRateOptionsKey = () => getKey("pcrSpendProfileOverheadRateOptionsKey", "all");
const getCompaniesKey = (searchString: string, itemsPerPage?: number, startIndex?: number) => getKey("companiesKey", "search", searchString, "items", itemsPerPage || "unspecified", "index", startIndex || "0");

export const storeKeys = {
  getProjectKey,
  getProjectsKey,
  getPartnerKey,
  getPartnersKey,
  getClaimKey,
  getClaimDetailKey,
  getForecastDetailKey,
  getMonitoringReportKey,
  getPcrKey,
  getFinancialVirementKey,
  getPcrTypesKey,
  getPcrProjectRolesKey,
  getPcrPartnerTypesKey,
  getPcrParticipantSizesKey,
  getPcrProjectLocationsKey,
  getPcrSpendProfileCapitalUsageTypesKey,
  getPcrSpendProfileOverheadRateOptionsKey,
  getCompaniesKey,
};

// TODO make "getKey" private
export const getKey = (...args: (string | number | boolean | "all")[]) => args.join("_");

const getProjectKey = (projectId: string) => getKey("project", projectId);
const getPartnerKey = (partnerId: string) => getKey("partner", partnerId);
const getClaimsForPartnerKey = (partnerId: string) => getKey("partner", partnerId);
const getClaimsForProjectKey = (projectId: string) => getKey("project", projectId);
const getClaimKey = (partnerId: string, periodId: number) => getKey("partner", partnerId, "period", periodId);
const getClaimDocumentsKey = (partnerId: string, periodId: number) => getKey("claimDocuments", "partner", partnerId, "period", periodId);
const getClaimDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getClaimDetailsForPartnerKey = (partnerId: string) => getKey("partner", partnerId);
const getClaimDetailDocumentsKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("claimDetailDocuments", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getForecastDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("partner", partnerId, "period", periodId, "costCategory", costCategoryId);
const getForecastDetailsForPartnerKey = (partnerId: string) => getKey("partner", partnerId);
const getMonitoringReportKey = (projectId: string, id?: string) => getKey("project", projectId, "report", id || "new");

export const storeKeys = {
  getProjectKey,
  getPartnerKey,
  getClaimsForPartnerKey,
  getClaimsForProjectKey,
  getClaimKey,
  getClaimDocumentsKey,
  getClaimDetailKey,
  getClaimDetailsForPartnerKey,
  getClaimDetailDocumentsKey,
  getForecastDetailKey,
  getForecastDetailsForPartnerKey,
  getMonitoringReportKey
};

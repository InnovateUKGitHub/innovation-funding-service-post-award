// TODO make object or class and keep "getKey" private
export const getKey = (...args: (string | number | boolean | "all")[]) => args.join("_");
export const getProjectKey = (projectId: string) => getKey("project", projectId);
export const getPartnerKey = (partnerId: string) => getKey("partner", partnerId);
export const getClaimsForPartnerKey = (partnerId: string) => getKey("partner", partnerId);
export const getClaimsForProjectKey = (projectId: string) => getKey("project", projectId);
export const getClaimKey = (partnerId: string, periodId: number) => getKey("partner", partnerId, "period", periodId);
export const getClaimDocumentsKey = (partnerId: string, periodId: number) => getKey("claimDocuments", "partner", partnerId, "period", periodId);
export const getClaimDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("partner", partnerId, "period", periodId, "costCategory", costCategoryId);
export const getClaimDetailsForPartnerKey = (partnerId: string) => getKey("partner", partnerId);
export const getClaimDetailDocumentsKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("claimDetailDocuments", "partner", partnerId, "period", periodId, "costCategory", costCategoryId);
export const getForecastDetailKey = (partnerId: string, periodId: number, costCategoryId: string) => getKey("partner", partnerId, "period", periodId, "costCategory", costCategoryId);
export const getForecastDetailsForPartnerKey = (partnerId: string) => getKey("partner", partnerId);

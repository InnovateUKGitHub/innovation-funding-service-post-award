import { getKey } from "../../../framework/util/key";

export const getProjectKey = (projectId: string) => getKey("project", projectId);
export const getPartnerKey = (partnerId: string) => getKey("partner", partnerId);
export const getClaimKey = (partnerId: string, periodId: number) => getKey("partner", partnerId, "period", periodId);

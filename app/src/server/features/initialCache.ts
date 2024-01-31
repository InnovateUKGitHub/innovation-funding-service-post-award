import { PermissionGroupIdentifier } from "@framework/constants/enums";
import { IContext } from "@framework/types/IContext";
import { GetClaimStatusesQuery } from "@server/features/claims/getClaimStatusesQuery";
import { GetAllRecordTypesQuery } from "@server/features/general/getAllRecordTypesQuery";
import { GetPermissionGroupQuery } from "@server/features/general/getPermissionGroupsQuery";
import { GetMonitoringReportStatusesQuery } from "@server/features/monitoringReports/getMonitoringReportStatusesQuery";
import { GetPcrParticipantSizesQuery } from "@server/features/pcrs/getPcrParticipantSizesQuery";
import { GetPcrPartnerTypesQuery } from "@server/features/pcrs/getPcrPartnerTypesQuery";
import { GetPcrProjectLocationsQuery } from "@server/features/pcrs/getPcrProjectLocationsQuery";
import { GetPcrProjectRolesQuery } from "@server/features/pcrs/getPcrProjectRolesQuery";
import { GetPcrSpendProfileCapitalUsageTypesQuery } from "@server/features/pcrs/getPcrSpendProfileCapitalUsageTypesQuery";
import { GetPcrSpendProfileOverheadRateOptionsQuery } from "@server/features/pcrs/getPcrSpendProfileOverheadRateOptionsQuery";
import { GetPcrStatusesQuery } from "@server/features/pcrs/getPcrStatusesQuery";
import { GetUnfilteredCostCategoriesQuery } from "./claims/getCostCategoriesQuery";
import { QueryBase } from "./common/queryBase";

type ICacheQuery = [string, QueryBase<unknown>];

/**
 * @description This describes the name of the cache and query it is caching, this will get executed on app starting.
 *
 * Queries must be non user specific! The idea here is to isolate all initial queries rather than clutter the server
 */
const initialCacheQueries: ICacheQuery[] = [
  ["Permission group cache", new GetPermissionGroupQuery(PermissionGroupIdentifier.ClaimsTeam)],
  ["Record type cache", new GetAllRecordTypesQuery()],
  ["Cost Categories cache", new GetUnfilteredCostCategoriesQuery()],
  ["Claim Statuses cache", new GetClaimStatusesQuery()],
  ["Monitoring Report Status cache", new GetMonitoringReportStatusesQuery()],
  ["PCR - Status cache", new GetPcrStatusesQuery()],
  ["PCR - Project Roles cache", new GetPcrProjectRolesQuery()],
  ["PCR - Partner Types cache", new GetPcrPartnerTypesQuery()],
  ["PCR - Participant Sizes cache", new GetPcrParticipantSizesQuery()],
  ["PCR - Project Locations cache", new GetPcrProjectLocationsQuery()],
  ["PCR - Spend Profile Capital Usage Types cache", new GetPcrSpendProfileCapitalUsageTypesQuery()],
  ["PCR - Spend Profile Overhead Rate Options cache", new GetPcrSpendProfileOverheadRateOptionsQuery()],
];

export const fetchCaches = async ({ config, logger, runQuery }: IContext) => {
  const isHTTPS = config.webserver.url.startsWith("https://");

  // Note: We only cache on PROD (when live), otherwise we have a slower dev experience
  if (!isHTTPS) return;

  await initialCacheQueries.forEach(async ([cacheKey, cacheQuery]) => {
    try {
      logger.info(`Priming cache '${cacheKey}'`);

      await runQuery(cacheQuery);

      logger.info(`Successfully primed cache '${cacheKey}'`);
    } catch (error) {
      logger.error(`Unable to prime cache '${cacheKey}'`, error);
    }
  });
};

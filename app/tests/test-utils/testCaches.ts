import { Cache } from "@server/features/common/cache";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { ICaches } from "@framework/types/IContext";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";
import { RecordType } from "@framework/entities/recordType";
import { Option } from "@framework/dtos/option";

export class TestCaches implements ICaches {
  readonly costCategories = new Cache<CostCategoryDto[]>(1);
  readonly optionsLookup = new TestOptionsCache();
  readonly permissionGroups = new Cache<PermissionGroup[]>(1);
  readonly projectRoles = new Cache<{ [key: string]: IRoleInfo }>(1);
  readonly recordTypes = new Cache<RecordType[]>(1);
  contentStoreLastUpdated: Date | null = null;
}

class TestOptionsCache extends Cache<Option<unknown>[]> {
  constructor() {
    super(1);
  }

  public get monitoringReports() {
    return super.fetch("MonitoringReports", () => []);
  }
  public addMonitoringReportItem(key: MonitoringReportStatus, label: string) {
    const cache = super.fetch("MonitoringReports", () => []);
    cache.push({
      active: true,
      defaultValue: false,
      label,
      value: key,
    });
    return this;
  }
}

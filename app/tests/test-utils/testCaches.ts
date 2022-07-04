import { Cache } from "@server/features/common/cache";
import { Option } from "@framework/dtos";
import { ICaches, MonitoringReportStatus } from "@framework/types";
import { PermissionGroup, RecordType } from "@framework/entities";
import { IRoleInfo } from "@server/features/projects";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export class TestCaches implements ICaches {
  readonly costCategories = new Cache<CostCategoryDto[]>(1);
  readonly optionsLookup = new TestOptionsCache();
  readonly permissionGroups = new Cache<PermissionGroup[]>(1);
  readonly projectRoles = new Cache<{ [key: string]: IRoleInfo }>(1);
  readonly recordTypes = new Cache<RecordType[]>(1);
  contentStoreLastUpdated: Date|null = null;
}

class TestOptionsCache extends Cache<Option<any>[]> {

  constructor() {
    super(1);
  }

  public get monitoringReports() {
    return super.fetch("MonitoringReports", () => []);
  }
  public addMonitoringReportItem(key: MonitoringReportStatus, label: any ) {
    const cache = super.fetch("MonitoringReports", () => []);
    cache.push({
      active: true,
      defaultValue: false,
      label,
      value: key
    });
    return this;
  }
}

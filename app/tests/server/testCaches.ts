import { Cache } from "@server/features/common/cache";
import { Option } from "@framework/dtos";
import { ICaches, MonitoringReportStatus } from "@framework/types";
import { PermissionGroup, RecordType } from "@framework/entities";
import { IRoleInfo } from "@server/features/projects";

export class TestCaches implements ICaches {
  readonly costCategories = new Cache<CostCategoryDto[]>(1);
  readonly optionsLookup = new TestOptionsCache();
  readonly permissionGroups = new Cache<PermissionGroup[]>(1);
  readonly projectRoles = new Cache<{ [key: string]: IRoleInfo }>(1);
  readonly recordTypes = new Cache<RecordType[]>(1);
}

class TestOptionsCache extends Cache<Map<any, Option>> {

  constructor() {
    super(1);
  }

  public get monitoringReports() {
    return new OptionsCacheMap<MonitoringReportStatus>(super.fetch("MonitoringReports", () => new Map()));
  }
}

class OptionsCacheMap<T> {
  constructor(private map: Map<T, Option>) {

  }

  addItem(enumValue: T, value: string, label: string) {
    this.map.set(enumValue, {
      active: true,
      defaultValue: false,
      label,
      value
    });

    return this;
  }
}

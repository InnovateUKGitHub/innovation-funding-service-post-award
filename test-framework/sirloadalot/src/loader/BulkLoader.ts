import * as csv from "csv/sync";
import { Connection } from "jsforce";
import { IngestJobV2SuccessfulResults } from "jsforce/lib/api/bulk";
import { ApiName } from "../enum/ApiName";
import { baseLogger } from "../helper/logger";
import { BaseFileData, LoadableValue } from "../schema";
import { BaseLoader } from "./BaseLoader";
import { LoadDate } from "./LoadDate";

const logger = baseLogger.child({ loc: "BulkLoader" });

export class BulkLoader<
  T extends BaseFileData[keyof BaseFileData][number] = BaseFileData[keyof BaseFileData][number],
> extends BaseLoader<T, IngestJobV2SuccessfulResults<any>> {
  async toCsv(conn: Connection<any>, payload: T[], override?: Map<string, any> | undefined): Promise<string> {
    let columns = new Set<string>();

    const data = payload.map(async x => {
      const { relationship, data, loadId } = x;
      const rel = relationship as Record<ApiName, string>;
      const newData: Record<string, any> = {};

      for (const [key, value] of Object.entries(data) as [string, LoadableValue][]) {
        let newValue = value;

        if (override && override.has(key)) {
          if (override.get(key) === undefined) break;
        }

        if (override && override.has(key)) {
          newValue = override.get(key);
        }

        if (typeof newValue === "string") {
          newValue = newValue.replace(/< *prefix *>/g, this.prefix).replace(/< *loadId *>/g, loadId ?? "");
        }

        if (typeof value === "object" && value !== null) {
          if ("offset" in value || "date" in value) {
            const loadDate = new LoadDate({ date: this.startDate });
            loadDate.setDate(value);
            newValue = loadDate.toSalesforceDate();
          }

          if ("lookup" in value) {
            const { type, ...rest } = value.lookup;
            newValue = await this.manager.lookups[type].find(conn, rest as any);
          }
        }

        columns.add(key);
        newData[key] = newValue;
      }

      for (const [from, to] of this.relationshipMap.entries()) {
        if (!rel?.[from]) continue;

        const success = this.manager.successMap.find(x => x.apiName === from && x.loadId === rel[from]);

        if (!success) throw new Error(`Could not find key ${from} in relationship`);

        columns.add(to);
        newData[to] = success.recordId;
      }

      return newData;
    });

    return csv.stringify(await Promise.all(data), {
      header: true,
      columns: [...columns],
    });
  }

  async load(conn: Connection<any>, payload: T[], override?: Map<string, any>) {
    logger.info(`About to ${this.operation} ${this.apiName}`);
    if (override && override.size > 0) logger.info(`Will be overriding the fields ${override}`);

    const csv = await this.toCsv(conn, payload, override);

    logger.debug(`Using input data`, payload);
    logger.debug(`Transformed as CSV`, csv);

    const results = await conn.bulk2.loadAndWaitForResults({
      object: this.apiName,
      operation: this.operation,
      externalIdFieldName: this.externalId,
      input: csv,
      pollInterval: 1000,
      pollTimeout: Infinity,
    });

    logger.info(`Completed ${this.operation} to ${this.apiName}`);
    logger.debug(results);

    if (results.failedResults.length > 0 || results.unprocessedRecords.length > 0) {
      logger.error(`Failed to ${this.operation} some records to ${this.apiName}`, results);
      throw new Error("Failed to insert some records!");
    }

    logger.info("Success information", results.successfulResults);

    return results.successfulResults;
  }
}

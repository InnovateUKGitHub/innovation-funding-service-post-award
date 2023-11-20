import { Connection } from "jsforce";
import { ApiName, BulkLoadableApiName, bulkLoadableApiName } from "./enum/ApiName";
import fs from "fs/promises";
import yaml from "yaml";
import { LoaderFactory } from "./loader/BulkLoaderFactory";
import { AttachmentLoader, FilePayload } from "./loader/AttachmentLoader";
import { BulkLoader } from "./loader/BulkLoader";
import { BaseFileData } from "./schema";
import { mapKeysToObject } from "./helper/mapKeysToObject";
import { CachedLookup } from "./lookup/CachedLookup";
import { sleep } from "./helper/sleep";
import { CostCategoryLookup } from "./schema/CostCategory.lookup";
import { RecordType } from "./enum/RecordType";
import { RecordTypeLookup } from "./schema/RecordType.lookup";
import { MonitoringQuestionLookup } from "./schema/MonitoringQuestion.lookup";

class LoaderManager {
  loaders: Record<BulkLoadableApiName, BulkLoader>;
  bulkPayloads: Pick<BaseFileData, BulkLoadableApiName>;
  lookups = {
    [ApiName.CostCategory]: new CachedLookup<CostCategoryLookup>({
      apiName: ApiName.CostCategory,
    }),
    [ApiName.RecordType]: new CachedLookup<RecordTypeLookup<RecordType, ApiName>>({
      apiName: ApiName.RecordType,
    }),
    [ApiName.MonitoringQuestion]: new CachedLookup<MonitoringQuestionLookup>({
      apiName: ApiName.MonitoringQuestion,
    }),
  };

  public successMap: {
    apiName: ApiName;
    recordId: string;
    loadId?: string;
    data: any;
  }[] = [];

  fileLoader: AttachmentLoader;
  filePayloads: FilePayload[];

  constructor({ prefix }: { prefix: string }) {
    const startDate = new Date();
    const loaderProps = { manager: this, prefix, startDate };
    const factory = new LoaderFactory(loaderProps);
    this.loaders = mapKeysToObject(bulkLoadableApiName, key => factory.getLoader(key));
    this.bulkPayloads = mapKeysToObject(bulkLoadableApiName, () => []);
    this.fileLoader = new AttachmentLoader(loaderProps);
    this.filePayloads = [];
  }

  private addPayload(payload: BaseFileData) {
    for (const apiName of bulkLoadableApiName) {
      const payloads = payload[apiName];

      for (const payload of payloads) {
        this.bulkPayloads[apiName].push(payload as any);

        // Collect files to upload to Salesforce
        if (payload.files) {
          for (const file of payload.files) {
            this.filePayloads.push({
              loadId: payload.loadId,
              ...file,
            });
          }
        }
      }
    }
  }

  async addPayloadFromFile(path: string) {
    // Grab our data as a string...
    const data = await fs.readFile(path, { encoding: "utf-8" });

    // Parse the data into our Object Name/Payload[] record
    const payload = yaml.parse(data) as BaseFileData;

    // Add the YAML file to our payload
    this.addPayload(payload);
  }

  private async loadBulkObject(
    conn: Connection,
    apiName: BulkLoadableApiName,
    payloads: BaseFileData[BulkLoadableApiName],
    override?: Map<string, any>,
  ) {
    const result = await this.loaders[apiName].load(conn, payloads, override);

    for (let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];
      const success = result[i];

      this.successMap.push({
        apiName: apiName as ApiName,
        loadId: payload.loadId,
        recordId: success.sf__Id,
        data: success,
      });
    }
  }

  async load(conn: Connection): Promise<void> {
    await this.loadBulkObject(conn, ApiName.Competition, this.bulkPayloads[ApiName.Competition]);
    await this.loadBulkObject(conn, ApiName.Account, this.bulkPayloads[ApiName.Account]);
    await this.loadBulkObject(conn, ApiName.Contact, this.bulkPayloads[ApiName.Contact]);
    await this.loadBulkObject(conn, ApiName.User, this.bulkPayloads[ApiName.User]);
    await this.loadBulkObject(
      conn,
      ApiName.Project,
      this.bulkPayloads[ApiName.Project],

      // Load all projects without a project status,
      // and ClaimFrequency set to null.
      new Map([
        ["Acc_ClaimFrequency__c", null],
        ["Acc_ProjectStatus__c", undefined],
      ]),
    );
    await this.loadBulkObject(conn, ApiName.ProjectParticipant, this.bulkPayloads[ApiName.ProjectParticipant]);
    await this.loadBulkObject(conn, ApiName.ProjectContactLink, this.bulkPayloads[ApiName.ProjectContactLink]);

    await this.loadBulkObject(
      conn,
      ApiName.Profile,
      this.bulkPayloads[ApiName.Profile].filter(
        x => x.data.RecordTypeId.lookup.DeveloperName === RecordType.Total_Cost_Category,
      ),
    );
    await this.loadBulkObject(
      conn,
      ApiName.Profile,
      this.bulkPayloads[ApiName.Profile].filter(
        x => x.data.RecordTypeId.lookup.DeveloperName !== RecordType.Total_Cost_Category,
      ),
    );

    await this.loadBulkObject(conn, ApiName.Claim, this.bulkPayloads[ApiName.Claim]);

    // Reload all projects with the project status and claim frequency
    await this.loadBulkObject(conn, ApiName.Project, this.bulkPayloads[ApiName.Project]);

    // Load request headers first!
    await this.loadBulkObject(
      conn,
      ApiName.ProjectChangeRequest,
      this.bulkPayloads[ApiName.ProjectChangeRequest].filter(
        x => x.data.RecordTypeId.lookup.DeveloperName === RecordType.Acc_RequestHeader,
      ),
    );
    await this.loadBulkObject(
      conn,
      ApiName.MonitoringAnswer,
      this.bulkPayloads[ApiName.MonitoringAnswer].filter(
        x => x.data.RecordTypeId.lookup.DeveloperName === RecordType.Acc_MonitoringHeader,
      ),
    );

    // Load data dependant on request headers
    await this.loadBulkObject(
      conn,
      ApiName.ProjectChangeRequest,
      this.bulkPayloads[ApiName.ProjectChangeRequest].filter(
        x => x.data.RecordTypeId.lookup.DeveloperName !== RecordType.Acc_RequestHeader,
      ),
    );
    await this.loadBulkObject(
      conn,
      ApiName.MonitoringAnswer,
      this.bulkPayloads[ApiName.MonitoringAnswer].filter(
        x => x.data.RecordTypeId.lookup.DeveloperName === RecordType.Acc_MonitoringAnswer,
      ),
    );

    // Wait for the Salesforce Users to actually be... ready
    await sleep(10000);

    // Run final batches
    await conn.tooling.executeAnonymous(
      [
        "Database.executeBatch(new Acc_ProjectPeriodProcessor_Batch(), 200);",
        "Database.executeBatch(new Acc_ClaimsCreateBatch(), 1);",
        "Database.executeBatch(new Acc_AsyncNonIFSProfCreationBatch(), 1);",
        "Database.executeBatch(new Acc_ProfilePopulateClaimLookupBatch(), 10);",
      ].join("\n"),
    );

    await this.fileLoader.load(conn, this.filePayloads);
  }
}

export { LoaderManager };

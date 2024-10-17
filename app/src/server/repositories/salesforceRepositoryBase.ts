import { DetailedErrorCode } from "@framework/constants/enums";
import { IAppDetailedError } from "@framework/types/IAppError";
import { IPicklistEntry } from "@framework/types/IPicklistEntry";
import { configuration } from "@server/features/common/config";
import * as Errors from "@server/repositories/errors";
import { ISalesforceMapper } from "@server/repositories/mappers/salesforceMapperBase";
import {
  TsforceDescribeSObjectField,
  TsforceDescribeSObjectResult,
} from "@server/tsforce/requests/TsforceDescribeSubrequest";
import { TsforceQuerySubrequest } from "@server/tsforce/requests/TsforceQuerySubrequest";
import { TsforceConnection } from "@server/tsforce/TsforceConnection";
import { TsforceSalesforceResponse } from "@server/tsforce/types/TsforceSalesforceResponse";
import { BadRequestError } from "@shared/appError";
import { createBatch } from "@shared/create-batch";
import { ILogger } from "@shared/logger";
import { Readable } from "node:stream";

export type Updatable<T> = Partial<T> & {
  Id: string;
};

export type Insertable<T> = Pick<T, Exclude<keyof T, "Id">>;

// Note: The interface states a string[] but we actually get an Array<object> back
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/f7ec78508c6797e42f87a4390735bc2c650a1bfd/types/jsforce/record-result.d.ts
interface UpdatedErrorResult {
  statusCode: string;
  message: string;
  fields: unknown[];
}

/**
 * Base class for all salesforce repositories
 */
export abstract class RepositoryBase {
  public constructor(
    protected readonly getSalesforceConnection: () => TsforceConnection,
    protected readonly logger: ILogger,
  ) {}

  protected constructError(
    e: unknown | Errors.SalesforceDetailedErrorResponse,
    soql = "No SOQL available for this query",
  ) {
    if (e instanceof Errors.SalesforceDetailedErrorResponse) return e;

    if (Errors.isSalesforceErrorResponse(e)) {
      if (e.message.length < 10_000) {
        this.logger.error(
          "Salesforce Error",
          `Error code: ${e.errorCode}\n\n`,
          `Original SOQL:\n${soql}\n\n`,
          `Error message:\n${e.message}\n\n`,
        );
      } else {
        this.logger.error(
          "Salesforce Error",
          e.errorCode,
          soql,
          "This error message was truncated because Salesforce sent a message with more than 10K characters.",
          "This could be because Salesforce is returning a full HTML error page, such as a Salesforce EDGE connection error.",
        );
      }

      if (e.errorCode === "INVALID_FIELD") {
        new Errors.BadSalesforceQuery({ errorReason: e.errorCode, errorDetail: e.errorCode, cause: e });
      }
      if (e.errorCode === "ERROR_HTTP_503") {
        new Errors.SalesforceUnavailableError({ message: "Salesforce unavailable", cause: e });
      }
      if (e.errorCode === "INVALID_QUERY_FILTER_OPERATOR") {
        new Errors.SalesforceInvalidFilterError({ message: "Salesforce filter error", cause: e });
      }
      if (e.errorCode === "FILE_EXTENSION_NOT_ALLOWED") {
        new Errors.FileTypeNotAllowedError({ message: e.message, cause: e });
      }
      if (e.errorCode === "FIELD_CUSTOM_VALIDATION_EXCEPTION") {
        new Errors.SalesforceFieldCustomValidationError({ message: e.message, cause: e });
      }

      new Errors.SalesforceDetailedErrorResponse({ errorCode: e.errorCode, message: e.message, details: [], cause: e });
    }
    return e instanceof Error ? e : new Error(`${e}`);
  }
}

/**
 * Generic Base class with mapping and helpers to retrieve salesforce objects
 */
export abstract class SalesforceRepositoryBaseWithMapping<TSalesforce, TEntity> extends RepositoryBase {
  public constructor(getSalesforceConnection: () => TsforceConnection, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected abstract readonly salesforceObjectName: string;
  protected abstract readonly salesforceFieldNames: string[];
  protected abstract readonly mapper: ISalesforceMapper<TSalesforce, TEntity>;

  protected logSoql(query: TsforceQuerySubrequest<unknown>): string {
    const soql = query.toSOQL();
    this.logger.trace(`Running query on ${this.salesforceObjectName}`, soql);
    return soql;
  }

  protected async retrieve(id: string): Promise<TEntity | null | undefined> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = await connection
        .sobject(this.salesforceObjectName)
        .retrieve<TSalesforce>(id, this.salesforceFieldNames);

      if (targetObject.records.length === 0) return null;
      if (targetObject.records.length > 1) throw new Error("Multiple records returned :c");

      return this.mapper.map(targetObject.records[0]);
    } catch (e: unknown | Error) {
      if (Errors.isSalesforceErrorResponse(e)) {
        if (e.errorCode === "MALFORMED_ID" || e.errorCode === "NOT_FOUND") {
          return null;
        } else {
          throw this.constructError(e);
        }
      }
    }
  }

  protected async all(): Promise<TEntity[]> {
    let soql: string | undefined = undefined;
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);
      const fullQuery = targetObject.select<TSalesforce>(this.salesforceFieldNames);
      soql = await this.logSoql(fullQuery);
      const allItems = (await fullQuery.execute()).records;

      return this.map(allItems);
    } catch (error) {
      throw this.constructError(error, soql);
    }
  }

  protected async query<T>(salesforceQuery: string): Promise<T> {
    try {
      const connection = await this.getSalesforceConnection();
      const query = await connection.executeSOQL({ query: salesforceQuery });

      if (!query.done) throw new Errors.BadSalesforceQuery();

      return query.records as unknown as T;
    } catch (error) {
      throw this.constructError(error, salesforceQuery);
    }
  }

  protected async getBlob(id: string): Promise<Readable> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);
      const stream = await targetObject.blob(id, "VersionData");

      if (stream === null) throw new Errors.BadSalesforceQuery();

      return stream;
    } catch (error) {
      throw this.constructError(error);
    }
  }

  private async getMetadata(): Promise<TsforceDescribeSObjectResult> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);

      return targetObject.describe();
    } catch (error) {
      throw this.constructError(error);
    }
  }

  private async getFieldMetadata(field: string): Promise<TsforceDescribeSObjectField> {
    const metadata = await this.getMetadata();
    const fieldDescription = metadata.fields.find(x => x.name === field);

    if (!fieldDescription) {
      throw new BadRequestError(`Bad field description: ${field}`);
    }

    return fieldDescription;
  }

  // Using own return type and not jsforce PicklistEntry so we can omit unwanted fields like "defaultValue".
  // "defaultValue" is ignored because it is used internally in SF and not intended to drive the UI
  protected async getPicklist(field: string): Promise<IPicklistEntry[]> {
    const { picklistValues } = await this.getFieldMetadata(field);

    if (!picklistValues) {
      throw new BadRequestError(`Field is not a pick-list: ${field}`);
    }

    return picklistValues;
  }

  protected async where(filter: Partial<TSalesforce> | string): Promise<TEntity[]> {
    let soql: string | undefined = undefined;
    try {
      const connection = await this.getSalesforceConnection();
      const filteredQuery = connection
        .sobject(this.salesforceObjectName)
        .select<TSalesforce>(this.salesforceFieldNames);

      const fullQuery = filteredQuery.where(filter);
      soql = this.logSoql(fullQuery);
      const filteredResponse = (await fullQuery.execute()).records;

      if (!filteredResponse.length) return [];

      return this.map(filteredResponse);
    } catch (error) {
      throw this.constructError(error, soql);
    }
  }

  protected async loadItem(filter: Partial<TSalesforce> | string): Promise<TEntity> {
    const filteredResult = await this.filterOne(filter);

    if (!filteredResult) {
      throw new Errors.SalesforceInvalidFilterError({ message: "Filter did not return a single item" });
    }

    return filteredResult;
  }

  protected async filterOne<Payload extends Partial<TSalesforce> | string>(filter: Payload): Promise<TEntity | null> {
    let soql: string | undefined = undefined;
    try {
      const connection = await this.getSalesforceConnection();
      const fullQuery = connection
        .sobject(this.salesforceObjectName)
        .select(this.salesforceFieldNames)
        .where(filter)
        .count(1);

      soql = await this.logSoql(fullQuery);
      const res = (await fullQuery.execute()).records as TSalesforce[];

      if (!res.length) return null;

      // Note: we limit only 1 item above, so we can return this object from the array
      const [onlyFilteredItem] = this.map(res);

      return onlyFilteredItem;
    } catch (error) {
      throw this.constructError(error, soql);
    }
  }

  private getDataChangeErrorMessage(result: TsforceSalesforceResponse) {
    return !result.success ? result.errors : [];
  }

  private getDataChangeErrorMessages(results: TsforceSalesforceResponse[], ids?: string[]) {
    const ret: IAppDetailedError[] = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const id = ids?.[i];
      if (!result.success) {
        ret.push({ code: DetailedErrorCode.SFDC_INSUFFICIENT_ACCESS_OR_READONLY, id, data: result.errors });
      }
    }
    return ret;
  }

  protected async insertItem<Payload extends Partial<TSalesforce>>(inserts: Payload): Promise<string> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);
      const result = await targetObject.insert(inserts);

      if (result.success) return result.id;

      throw new Errors.SalesforceDataChangeError(
        "Failed to insert to salesforce",
        this.getDataChangeErrorMessage(result),
      );
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async insertAll<Payload extends Partial<TSalesforce>[]>(insertPayload: Payload): Promise<string[]> {
    if (!insertPayload.length) return [];

    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);

      const insertedBatchIds = await this.batchRequest(insertPayload, async batch => {
        const batchResults = await targetObject.insertMany(batch);
        const validPayload = batchResults.every(x => x.success);

        if (validPayload) {
          return batchResults.map(x => `${x.id}`);
        }

        throw new Errors.SalesforceDataChangeError(
          "Failed to insert to salesforce",
          this.getDataChangeErrorMessages(batchResults),
        );
      });

      return insertedBatchIds.flat();
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async updateItem<Payload extends Updatable<TSalesforce>>(updates: Payload): Promise<boolean> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);
      const batchResult = await targetObject.update(updates);

      if (batchResult && "errors" in batchResult) {
        throw new Errors.SalesforceDataChangeError(
          "Failed to update salesforce",
          this.getDataChangeErrorMessage(batchResult),
        );
      }

      return true;
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async updateAll<Payload extends Updatable<TSalesforce>[]>(updatePayload: Payload): Promise<boolean> {
    if (!updatePayload.length) return true;

    try {
      const connection = await this.getSalesforceConnection();

      const updateBatchConfirmations = await this.batchRequest(updatePayload, async batch => {
        const updateQuery = await connection.sobject(this.salesforceObjectName);
        const batchResults = await updateQuery.updateMany(batch);

        // If there are any errors in our batchResults, throw it
        for (const result of batchResults) {
          if (!result.success && result.errors.length) {
            throw new Errors.SalesforceDataChangeError(
              "Failed to update from Salesforce",
              this.getDataChangeErrorMessages(
                batchResults,
                batch.map(x => x.Id),
              ),
            );
          }
        }

        return true;
      });

      return updateBatchConfirmations.every(Boolean);
    } catch (error) {
      if (error instanceof Errors.SalesforceDataChangeError) throw error;
      throw this.constructError(error);
    }
  }

  protected async deleteAll<Payload extends string[]>(deleteIds: Payload): Promise<void> {
    if (!deleteIds.length) return;

    try {
      const connection = await this.getSalesforceConnection();

      const deleteBatchConfirmations = await this.batchRequest(deleteIds, async batch => {
        const deleteQuery = connection.sobject(this.salesforceObjectName);
        const batchResults = await deleteQuery.deleteMany(batch);

        // If there are no batch results, return false
        if (batchResults.length === 0) return false;

        // If there are any errors in our batchResults, throw it
        for (const result of batchResults) {
          if (!result.success && result.errors.length) {
            throw new Errors.SalesforceDataChangeError(
              "Failed to delete from Salesforce",
              this.getDataChangeErrorMessages(batchResults, batch),
            );
          }
        }

        // If there are no errors, return true
        return true;
      });

      const allIdsDeleted: boolean = deleteBatchConfirmations.every(Boolean);

      // Note: Ensure all items are deleted
      if (!allIdsDeleted) {
        throw new Errors.SalesforceDataChangeError("Failed to delete from salesforce", []);
      }
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async deleteItem<Payload extends string>(id: Payload): Promise<void> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);
      await targetObject.delete(id);
    } catch (error) {
      throw this.constructError(error);
    }
  }

  public map(salesforceResult: TSalesforce[]): TEntity[] {
    return salesforceResult.map(x => this.mapper.map(x));
  }

  /**
   * @description It is unclear what payload format we are getting from Salesforce
   */
  private getPayloadErrorStatusCode(error: UpdatedErrorResult | string): string {
    return typeof error === "string" ? error : error.statusCode;
  }

  /**
   * @description Receive a payload, split into batches. Then invoke the param on each batch.
   *
   * A batch is determined from a config value. This config has been set to the max payload size SF can handle on each request, thus removing SF query errors.
   */
  protected batchRequest<BatchType, Response>(
    payload: BatchType[],
    request: (batchPayload: BatchType[]) => Promise<Response>,
  ): Promise<Response[]> {
    const generatedBatches = createBatch(payload, configuration.salesforceQueryLimit);
    const promisedBatches = generatedBatches.map(x => request(x));

    return Promise.all(promisedBatches);
  }
}

class DefaultMapper<T> implements ISalesforceMapper<T, T> {
  map(item: T) {
    return item;
  }
}

/**
 * Generic Base class without mapping
 *
 * Has helpers to retrieve salesforce objects
 */
export default abstract class SalesforceRepositoryBase<T> extends SalesforceRepositoryBaseWithMapping<T, T> {
  protected mapper = new DefaultMapper<T>();
}

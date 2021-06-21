import { Stream } from "stream";
import { Connection, DescribeSObjectResult, Field, Query, RecordResult, SuccessResult } from "jsforce";

import * as Errors from "@server/repositories/errors";
import { ISalesforceMapper } from "@server/repositories/mappers/saleforceMapperBase";
import { BadRequestError, configuration, ILogger } from "@server/features/common";
import { IPicklistEntry } from "@framework/types";
import { createBatch } from "@shared/create-batch";

export type Updatable<T> = Partial<T> & {
  Id: string;
};

export type Insertable<T> = Pick<T, Exclude<keyof T, "Id">>;

// Note: The interface states a string[] but we actually get an Array<object> back
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/f7ec78508c6797e42f87a4390735bc2c650a1bfd/types/jsforce/record-result.d.ts
interface UpdatedErrorResult {
  statusCode: string;
  message: string;
  fields: any[];
}

/**
 * Base class for all salesforce repositories
 */
export abstract class RepositoryBase {
  public constructor(
    protected readonly getSalesforceConnection: () => Promise<Connection>,
    protected readonly logger: ILogger,
  ) {}

  protected readonly payloadErrors = {
    UNABLE_TO_LOCK_ROW: "SF_UPDATE_ALL_FAILURE",
    FALLBACK_QUERY_ERROR: "FALLBACK_QUERY_ERROR",
  };

  protected constructError(e: any) {
    this.logger.error("Salesforce Error: ", e.errorCode, e.message);

    if (e.errorCode === "ERROR_HTTP_503") {
      throw new Errors.SalesforceUnavilableError("Salesforce unavailable");
    }
    if (e.errorCode === "INVALID_QUERY_FILTER_OPERATOR") {
      throw new Errors.SalesforceInvalidFilterError("Salesforce filter error");
    }
    if (e.errorCode === "FILE_EXTENSION_NOT_ALLOWED") {
      throw new Errors.FileTypeNotAllowedError(e.message);
    }

    return e instanceof Error ? e : new Error(`${e.errorCode}: ${e.message}`);
  }

  protected executeArray<T>(query: Query<{}>): Promise<T[]> {
    return new Promise<T[]>((res, rej) => {
      query.execute(undefined, (err, records) => {
        if (err) {
          rej(this.constructError(err));
        } else {
          // there is an error in the typings of result so need to cast here
          res((records as any) as T[]);
        }
      });
    });
  }
}

/**
 * Generic Base class with mapping and helpers to retrieve salesforce objects
 */
export abstract class SalesforceRepositoryBaseWithMapping<TSalesforce, TEntity> extends RepositoryBase {
  public constructor(getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected abstract readonly salesforceObjectName: string;
  protected abstract readonly salesforceFieldNames: string[];
  protected abstract readonly mapper: ISalesforceMapper<TSalesforce, TEntity>;

  protected async retrieve(id: string): Promise<TEntity | null> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = await connection.sobject<TSalesforce>(this.salesforceObjectName).retrieve(id);

      if (!targetObject) return null;

      return this.mapper.map(targetObject);
    } catch (e) {
      if (e.errorCode === "MALFORMED_ID" || e.errorCode === "NOT_FOUND") {
        return null;
      } else {
        throw this.constructError(e);
      }
    }
  }

  protected async all(): Promise<TEntity[]> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);
      const allItems = await targetObject.select(this.salesforceFieldNames).execute();

      return this.map(allItems);
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async getBlob(id: string, fieldName: string): Promise<Stream> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);
      const record = targetObject.record(id);

      return record.blob(fieldName);
    } catch (error) {
      throw this.constructError(error);
    }
  }

  private async getMetadata(): Promise<DescribeSObjectResult> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject(this.salesforceObjectName);

      return targetObject.describe();
    } catch (error) {
      throw this.constructError(error);
    }
  }

  private async getFieldMetadata(field: string): Promise<Field> {
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
    try {
      const connection = await this.getSalesforceConnection();
      const filteredQuery = connection.sobject(this.salesforceObjectName).select(this.salesforceFieldNames);
      const filteredResponse = await filteredQuery.where(filter).execute();

      if (!filteredResponse.length) return [];

      return this.map(filteredResponse);
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async loadItem(filter: Partial<TSalesforce> | string): Promise<TEntity> {
    const filteredResult = await this.filterOne(filter);

    if (!filteredResult) {
      throw new Errors.SalesforceInvalidFilterError("Filter did not return a single item");
    }

    return filteredResult;
  }

  protected async filterOne<Payload extends Partial<TSalesforce> | string>(filter: Payload): Promise<TEntity | null> {
    try {
      const connection = await this.getSalesforceConnection();
      const query = await connection
        .sobject(this.salesforceObjectName)
        .select(this.salesforceFieldNames)
        .where(filter)
        .limit(1)
        .execute();

      if (!query.length) return null;

      // Note: we limit only 1 item above, so we can return this object from the array
      const [onlyFilteredItem] = this.map(query);

      return onlyFilteredItem;
    } catch (error) {
      throw this.constructError(error);
    }
  }

  private getDataChangeErrorMessage(result: RecordResult): string[] {
    return !result.success ? result.errors : [];
  }

  private getDataChangeErrorMessages(results: RecordResult[]): string[] {
    return results.map(x => (!x.success ? x.errors : [])).reduce<string[]>((a, b) => a.concat(b), []);
  }

  protected async insertItem<Payload extends Partial<TSalesforce>>(inserts: Payload): Promise<string> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject<Payload>(this.salesforceObjectName);
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
      const targetObject = connection.sobject<Partial<TSalesforce>>(this.salesforceObjectName);

      const insertedBatchIds = await this.batchRequest<Payload, string[]>(insertPayload, async batch => {
        const batchResults = await targetObject.insert(batch);
        const validPayload = batchResults.every(x => x.success);

        if (validPayload) {
          const successfulBatch = batchResults as SuccessResult[];
          return successfulBatch.map(x => `${x.id}`);
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
      const targetObject = connection.sobject<Payload>(this.salesforceObjectName);
      const batchResult = await targetObject.update(updates);

      if (batchResult.success) return true;

      throw new Errors.SalesforceDataChangeError(
        "Failed to update salesforce",
        this.getDataChangeErrorMessage(batchResult),
      );
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async updateAll<Payload extends Updatable<TSalesforce>[]>(updatePayload: Payload): Promise<boolean> {
    if (!updatePayload.length) return true;

    try {
      const connection = await this.getSalesforceConnection();

      const updateBatchConfirmations = await this.batchRequest<Payload, boolean>(updatePayload, async batch => {
        const updateQuery = await connection.sobject<TSalesforce>(this.salesforceObjectName);
        const batchResults = await updateQuery.update(batch);

        return batchResults.reduce<boolean>((_, result) => {
          if (!result.success && !!result.errors.length) {
            const errorMessage = this.getErrorFromPayload(result.errors);

            throw new Errors.SalesforceDataChangeError(errorMessage, this.getDataChangeErrorMessages(batchResults));
          }

          return true;
        }, false);
      });

      return updateBatchConfirmations.every(Boolean);
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async deleteAll<Payload extends string[]>(deleteIds: Payload): Promise<void> {
    if (!deleteIds.length) return;

    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject<Payload>(this.salesforceObjectName);

      const deleteQuery = await this.batchRequest<Payload, boolean>(deleteIds, async batch => {
        const result = await targetObject.delete(batch);

        if (result.every(x => x.success)) return true;

        throw new Errors.SalesforceDataChangeError(
          "Failed to delete from salesforce",
          this.getDataChangeErrorMessages(result),
        );
      });

      const allIdsDeleted: boolean = deleteQuery.every(Boolean);

      // Note: Ensure all items are deleted
      if (!allIdsDeleted) {
        const deleteStatus = deleteQuery.map((x, i) => `ID: ${deleteIds[i]}, Status: ${x}`);

        throw new Errors.SalesforceDataChangeError("Failed to delete from salesforce", deleteStatus);
      }
    } catch (error) {
      throw this.constructError(error);
    }
  }

  protected async deleteItem<Payload extends string>(id: Payload): Promise<void> {
    try {
      const connection = await this.getSalesforceConnection();
      const targetObject = connection.sobject<Payload>(this.salesforceObjectName);
      const result = await targetObject.delete(id);

      if (result.success) return;

      throw new Errors.SalesforceDataChangeError(
        "Failed to delete from salesforce",
        this.getDataChangeErrorMessage(result),
      );
    } catch (error) {
      throw this.constructError(error);
    }
  }

  private map(result: Partial<{}>[]): TEntity[] {
    const salesforce = result as TSalesforce[];
    return salesforce.map(x => this.mapper.map(x));
  }

  /**
   * @description Provide an escape hatch from the default error message, so we can show unique error messages
   */
  private getErrorFromPayload(errors: (UpdatedErrorResult | string)[]) {
    // Note: Iterate over errors and check for sfPayloadErrors keys
    const uniqueError = errors.find(err =>
      Object.keys(this.payloadErrors).find(errorKey => errorKey === this.getPayloadErrorStatusCode(err)),
    );

    if (!uniqueError) return this.payloadErrors.FALLBACK_QUERY_ERROR;

    const payloadErrorKey = this.getPayloadErrorStatusCode(uniqueError);

    throw Error(payloadErrorKey);
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
   *
   */
  private batchRequest<BatchType extends any[], Response extends any>(
    payload: BatchType,
    request: (batchPayload: BatchType) => Promise<Response>,
  ): Promise<Response[]> {
    const generatedBatches = createBatch<BatchType>(payload, configuration.salesforceQueryLimit);
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

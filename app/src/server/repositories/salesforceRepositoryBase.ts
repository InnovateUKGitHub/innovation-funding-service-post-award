import { Stream } from "stream";
import { Connection, DescribeSObjectResult, Field, Query, RecordResult } from "jsforce";

import * as Errors from "@server/repositories/errors";
import { ISalesforceMapper } from "@server/repositories/mappers/saleforceMapperBase";
import { BadRequestError, Configuration, ILogger } from "@server/features/common";
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
      const conn = await this.getSalesforceConnection();
      const salesforce = await conn.sobject<TSalesforce>(this.salesforceObjectName).retrieve(id);
      return salesforce && this.mapper.map(salesforce);
    } catch (e) {
      if (e.errorCode === "MALFORMED_ID" || e.errorCode === "NOT_FOUND") {
        return null;
      } else {
        throw this.constructError(e);
      }
    }
  }

  protected async all(): Promise<TEntity[]> {
    const conn = await this.getSalesforceConnection();
    const result = await conn
      .sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames)
      .execute()
      .then(x => this.map(x))
      .catch(e => {
        throw this.constructError(e);
      });
    return result as TEntity[];
  }

  protected async getBlob(id: string, fieldName: string): Promise<Stream> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject(this.salesforceObjectName).record(id).blob(fieldName);
  }

  private async getMetadata(): Promise<DescribeSObjectResult> {
    const conn = await this.getSalesforceConnection();
    return conn
      .sobject(this.salesforceObjectName)
      .describe()
      .catch(e => {
        throw this.constructError(e);
      });
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
    const fieldMetadata = await this.getFieldMetadata(field);
    if (!fieldMetadata.picklistValues) {
      throw new BadRequestError(`Field is not a pick-list: ${field}`);
    }
    return fieldMetadata.picklistValues;
  }

  protected async where(filter: Partial<TSalesforce> | string): Promise<TEntity[]> {
    const conn = await this.getSalesforceConnection();
    const result = await conn
      .sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames)
      .where(filter)
      .execute()
      .then(x => this.map(x))
      .catch(e => {
        throw this.constructError(e);
      });
    return result as TEntity[];
  }

  protected async loadItem(filter: Partial<TSalesforce> | string): Promise<TEntity> {
    const result = await this.filterOne(filter);
    if (!result) {
      throw new Errors.SalesforceInvalidFilterError("Filter did not return a single item");
    }
    return result;
  }

  protected async filterOne(filter: Partial<TSalesforce> | string): Promise<TEntity | null> {
    const conn = await this.getSalesforceConnection();
    const result = await conn
      .sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames)
      .where(filter)
      .limit(1)
      .execute()
      .then(x => this.map(x).pop())
      .catch(e => {
        throw this.constructError(e);
      });
    return result as TEntity;
  }

  private getDataChangeErrorMessage(result: RecordResult): string[] {
    return !result.success ? result.errors : [];
  }

  private getDataChangeErrorMessages(results: RecordResult[]): string[] {
    return results.map(x => (!x.success ? x.errors : [])).reduce<string[]>((a, b) => a.concat(b), []);
  }

  protected async insertItem(inserts: Partial<TSalesforce>): Promise<string> {
    const conn = await this.getSalesforceConnection();
    return conn
      .sobject(this.salesforceObjectName)
      .insert(inserts)
      .then(result => {
        if (result.success) {
          return result.id;
        }
        throw new Errors.SalesforceDataChangeError(
          "Failed to insert to salesforce",
          this.getDataChangeErrorMessage(result),
        );
      })
      .catch(e => {
        throw this.constructError(e);
      });
  }

  protected async insertAll(inserts: Partial<TSalesforce>[]): Promise<string[]> {
    if (!inserts.length) {
      return [];
    }

    const conn = await this.getSalesforceConnection();
    return conn
      .sobject<Partial<TSalesforce>>(this.salesforceObjectName)
      .insert(inserts)
      .then(results => {
        if (results.every(x => x.success)) {
          return results.map(x => (x.success ? x.id.toString() : ""));
        }
        throw new Errors.SalesforceDataChangeError(
          "Failed to insert to salesforce",
          this.getDataChangeErrorMessages(results),
        );
      })
      .catch(e => {
        throw this.constructError(e);
      });
  }

  protected async updateItem(updates: Updatable<TSalesforce>): Promise<boolean> {
    const conn = await this.getSalesforceConnection();
    return conn
      .sobject(this.salesforceObjectName)
      .update(updates)
      .then(results => {
        if (results.success) {
          return true;
        }
        throw new Errors.SalesforceDataChangeError(
          "Failed to update salesforce",
          this.getDataChangeErrorMessage(results),
        );
      })
      .catch(e => {
        throw this.constructError(e);
      });
  }

  protected async updateAll(payload: Updatable<TSalesforce>[]): Promise<boolean> {
    if (!payload.length) return true;

    const sfConnection = await this.getSalesforceConnection();

    return this.batchRequest<Updatable<TSalesforce>[]>(payload, batch =>
      sfConnection
        .sobject<TSalesforce>(this.salesforceObjectName)
        .update(batch)
        .then(results => {
          return results.reduce<boolean>((_, result) => {
            if (!result.success && !!result.errors.length) {
              const errorMessage = this.getErrorFromPayload(result.errors);

              throw new Errors.SalesforceDataChangeError(errorMessage, this.getDataChangeErrorMessages(results));
            }

            return true;
          }, false);
        })
        .catch(e => {
          throw this.constructError(e);
        }),
    );
  }

  protected async deleteAll(ids: string[]): Promise<void> {
    if (!ids.length) {
      return;
    }
    const conn = await this.getSalesforceConnection();

    return conn
      .sobject(this.salesforceObjectName)
      .delete(ids)
      .then(result => {
        if (result.every(x => x.success)) {
          return;
        }
        throw new Errors.SalesforceDataChangeError(
          "Failed to delete from salesforce",
          this.getDataChangeErrorMessages(result),
        );
      })
      .catch(e => {
        throw this.constructError(e);
      });
  }

  protected async deleteItem(id: string): Promise<void> {
    const conn = await this.getSalesforceConnection();

    return conn
      .sobject(this.salesforceObjectName)
      .delete(id)
      .then(result => {
        if (result.success) {
          return;
        }
        throw new Errors.SalesforceDataChangeError(
          "Failed to delete from salesforce",
          this.getDataChangeErrorMessage(result),
        );
      })
      .catch(e => {
        throw this.constructError(e);
      });
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
  private batchRequest<T extends any[]>(payload: T, request: (batchPayload: T) => Promise<boolean>): Promise<boolean> {
    const generatedBatches = createBatch<T>(payload, Configuration.salesforceQueryLimit);
    const combinedRequests = Promise.all(generatedBatches.map(request));

    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const isSuccessfulQuery = combinedRequests
      .then(x => x.every(Boolean))
      .catch(e => {
        throw e;
      });

    return isSuccessfulQuery;
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

import { Connection, RecordResult } from "jsforce";
import { Stream } from "stream";
import * as Errors from "@server/repositories/errors";
import { ILogger } from "@server/features/common";

export type Updatable<T> = Partial<T> & {
  Id: string
};

export default abstract class SalesforceRepositoryBase<T> {
  public constructor(
    protected readonly getSalesforceConnection: () => Promise<Connection>,
    protected readonly logger: ILogger
  ) { }

  protected abstract readonly salesforceObjectName: string;
  protected abstract readonly salesforceFieldNames: string[];

  protected async retrieve(id: string): Promise<T | null> {
    try {
      const conn = await this.getSalesforceConnection();
      return await conn.sobject<T>(this.salesforceObjectName).retrieve(id);
    }
    catch (e) {
      if (e.errorCode === "MALFORMED_ID" || e.errorCode === "NOT_FOUND") {
        return null;
      }
      else {
        throw this.constructError(e);
      }
    }
  }

  protected async all(): Promise<T[]> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames)
      .execute()
      .then(x => this.asArray(x))
      .catch(e => { throw this.constructError(e); })
      ;

    return result as T[];
  }

  protected async getBlob(id: string, fieldName: string): Promise<Stream> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject(this.salesforceObjectName)
      .record(id)
      .blob(fieldName)
      ;
  }

  protected async where(filter: Partial<T> | string): Promise<T[]> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames)
      .where(filter)
      .execute()
      .then(x => this.asArray(x))
      .catch(e => { throw this.constructError(e); })
      ;

    return result as T[];
  }

  protected async loadItem(filter: Partial<T> | string): Promise<T> {
    const result = await this.filterOne(filter);
    if (!result) {
      throw new Errors.SalesforceInvalidFilterError();
    }
    return result;
  }

  protected async filterOne(filter: Partial<T> | string): Promise<T | null> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames)
      .where(filter)
      .limit(1)
      .execute()
      .then(x => this.asArray(x).pop())
      .catch(e => { throw this.constructError(e); })
      ;

    return result as T;
  }

  private getDataChangeErrorMessage(result: RecordResult): string[] {
    return !result.success ? result.errors : [];
  }

  private getDataChangeErrorMessages(results: RecordResult[]): string[] {
    return results.map(x => !x.success ? x.errors : []).reduce<string[]>((a, b) => a.concat(b), []);
  }

  protected async insertItem(inserts: Partial<T>): Promise<string> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject(this.salesforceObjectName)
      .insert(inserts)
      .then((result) => {
        if (result.success) {
          return result.id;
        }
        throw new Errors.SalesforceDataChangeError("Failed to insert to saleforce", this.getDataChangeErrorMessage(result));
      })
      .catch(e => { throw this.constructError(e); })
      ;
  }

  protected async insertAll(inserts: Partial<T>[]): Promise<string[]> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject<Partial<T>>(this.salesforceObjectName)
      .insert(inserts)
      .then(results => {
        if (results.every(x => x.success)) {
          return results.map(x => x.success ? x.id.toString() : "");
        }
        throw new Errors.SalesforceDataChangeError("Failed to insert to saleforce", this.getDataChangeErrorMessages(results));
      })
      .catch(e => { throw this.constructError(e); })
      ;
  }

  protected async updateItem(updates: Updatable<T>): Promise<boolean> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject(this.salesforceObjectName)
      .update(updates)
      .then(results => {
        if (results.success) {
          return true;
        }
        throw new Errors.SalesforceDataChangeError("Failed to update to saleforce", this.getDataChangeErrorMessage(results));
      })
      .catch(e => { throw this.constructError(e); })
      ;
  }

  protected async updateAll(updates: Updatable<T>[]): Promise<boolean> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject<T>(this.salesforceObjectName)
      .update(updates)
      .then(results => {
        if (results.every(x => x.success)) {
          return true;
        }
        throw new Errors.SalesforceDataChangeError("Failed to update to saleforce", this.getDataChangeErrorMessages(results));
      })
      .catch(e => { throw this.constructError(e); })
      ;
  }

  protected async deleteAll(ids: string[]): Promise<void> {
    const conn = await this.getSalesforceConnection();

    return conn.sobject(this.salesforceObjectName).delete(ids)
      .then(result => {
        if (result.every(x => x.success)) {
          return;
        }
        throw new Errors.SalesforceDataChangeError("Failed to delete from saleforce", this.getDataChangeErrorMessages(result));
      })
      .catch(e => { throw this.constructError(e); });
  }

  protected async deleteItem(id: string): Promise<void> {
    const conn = await this.getSalesforceConnection();

    return conn.sobject(this.salesforceObjectName).delete(id)
      .then(result => {
        if (result.success) {
          return;
        }
        throw new Errors.SalesforceDataChangeError("Failed to delete from saleforce", this.getDataChangeErrorMessage(result));
      })
      .catch(e => { throw this.constructError(e); });
  }

  private asArray(result: Partial<{}>[]): T[] {
    return result as T[];
  }

  private constructError(e: any) {
    this.logger.error("Salesforce Error: ", e.errorCode, e.message);

    if (e.errorCode === "ERROR_HTTP_503") {
      throw new Errors.SalesforceUnavilableError(`Salesforce unavailable`);
    }
    if (e.errorCode === "INVALID_QUERY_FILTER_OPERATOR") {
      throw new Errors.SalesforceInvalidFilterError(`Salesforce filter error`);
    }

    return e instanceof Error ? e : new Error(e.errorCode + ": " + e.message);
  }
}

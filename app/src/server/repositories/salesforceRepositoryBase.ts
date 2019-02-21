import { Connection, RecordResult, SalesforceId } from "jsforce";
import { Stream } from "stream";

export type Updatable<T> = Partial<T> & {
  Id: string
};

export default abstract class SalesforceRepositoryBase<T> {
  public constructor(
    protected getSalesforceConnection: () => Promise<Connection>
  ) { }

  protected abstract readonly salesforceObjectName: string;
  protected abstract readonly salesforceFieldNames: string[];

  protected async retrieve(id: string): Promise<T | null> {
    try {
      const conn = await this.getSalesforceConnection();
      return await conn.sobject(this.salesforceObjectName).retrieve(id).then(x => this.asItem(x));
    }
    catch (e) {
      if (e.errorCode === "MALFORMED_ID" || e.errorCode === "NOT_FOUND") {
        return null;
      }
      else {
        throw e;
      }
    }
  }

  protected async all(): Promise<T[]> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames.join(", "))
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
      .select(this.salesforceFieldNames.join(", "))
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
      throw new SalesforceInvalidFilterError();
    }
    return result;
  }

  protected async filterOne(filter: Partial<T> | string): Promise<T | null> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.salesforceObjectName)
      .select(this.salesforceFieldNames.join(", "))
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
      .then((r) => {
        const result = r as RecordResult;
        if (result.success) {
          return result.id as string;
        }
        throw new SalesforceDataChangeError("Failed to insert to saleforce", this.getDataChangeErrorMessage(result));
      })
      .catch(e => { throw this.constructError(e); })
      ;
  }

  protected async insertAll(inserts: Partial<T>[]): Promise<string[]> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject(this.salesforceObjectName)
      .insert(inserts)
      .then((r) => {
        const results = r as RecordResult[];
        if (results.every(x => x.success)) {
          return results.map(x => x.success ? x.id.toString() : "");
        }
        throw new SalesforceDataChangeError("Failed to insert to saleforce", this.getDataChangeErrorMessages(results));
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
        throw new SalesforceDataChangeError("Failed to update to saleforce", this.getDataChangeErrorMessage(results));
      })
      .catch(e => { throw this.constructError(e); })
      ;
  }

  protected async updateAll(updates: Updatable<T>[]): Promise<boolean> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject(this.salesforceObjectName)
      .update(updates)
      .then(r => {
        const results = r as any as RecordResult[];
        if (results.every(x => x.success)) {
          return true;
        }
        throw new SalesforceDataChangeError("Failed to update to saleforce", this.getDataChangeErrorMessages(results));
      })
      .catch(e => { throw this.constructError(e); })
      ;
  }

  protected async deleteAll(ids: string[]): Promise<void> {
    const conn = await this.getSalesforceConnection();
    // missing typeing in the jsForce.d.ts
    // tslint:disable
    return (conn.sobject(this.salesforceObjectName).delete(ids) as any as Promise<RecordResult[]>)
      .then(result => {
        if (result.every(x => x.success)) {
          return;
        }
        throw new SalesforceDataChangeError("Failed to delete from saleforce", this.getDataChangeErrorMessages(result));
      })
      .catch(e => { throw this.constructError(e); });
    // tslint:enable
  }

  protected async deleteItem(id: string): Promise<void> {
    const conn = await this.getSalesforceConnection();

    // missing typeing in the jsForce.d.ts
    // tslint:disable
    return (conn.sobject(this.salesforceObjectName).delete(id) as any as Promise<RecordResult>)
      .then(result => {
        if (result.success) {
          return;
        }
        throw new SalesforceDataChangeError("Failed to delete from saleforce", this.getDataChangeErrorMessage(result));
      })
      .catch(e => { throw this.constructError(e); });
    // tslint:enable
  }

  private asArray(result: Partial<{}>[]): T[] {
    return result as T[];
  }

  private asItem(result: { Id?: SalesforceId }): T {
    return result as any as T;
  }

  private constructError(e: any) {
    if (e.errorCode === "ERROR_HTTP_503") {
      throw new SalesforceUnavilableError(`Salesforce unavailable`);
    }
    if (e.errorCode === "INVALID_QUERY_FILTER_OPERATOR") {
      throw new SalesforceInvalidFilterError(`Salesforce unavailable`);
    }
    console.log("SALESFORCE ERROR:", JSON.stringify(e));
    if (e instanceof Error) {
      return e;
    }
    return new Error(e.errorCode + ": " + e.message);
  }
}

export class SalesforceUnavilableError extends Error { }

export class SalesforceInvalidFilterError extends Error { }

export class SalesforceDataChangeError extends Error {
  constructor(message: string, public errors: string[]) {
    super(message);
  }
}

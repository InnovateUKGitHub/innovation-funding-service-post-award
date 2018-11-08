import {Connection, SalesforceId, SuccessResult} from "jsforce";
import {Stream} from "stream";

export type Updatable<T> = Partial<T> & {
  Id: string
};

export default abstract class SalesforceBase<T> {
  private log = false;

  protected constructor(
    protected getSalesforceConnection: () => Promise<Connection>,
    protected objectName: string,
    private columns: string[]
  ) { }

  protected async retrieve(id: string): Promise<T | null> {
    try {
      const conn = await this.getSalesforceConnection();
      return await conn.sobject(this.objectName).retrieve(id).then(x => this.asItem(x));
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
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .execute()
      .then(x => this.asArray(x))
      .catch(e => { throw this.constructError(e, conn); })
      ;

    return result as T[];
  }

  protected async getBlob(id: string, fieldName: string): Promise<Stream> {
    const conn = await this.getSalesforceConnection();
    return conn.sobject(this.objectName)
      .record(id)
      .blob(fieldName)
      ;
  }

  protected async whereString(filter: string): Promise<T[]> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .where(filter)
      .execute()
      .then(x => this.asArray(x))
      .catch(e => { throw this.constructError(e, conn); })
      ;

    return result as T[];
  }

  protected async whereFilter(filter: Partial<T>): Promise<T[]> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .where(filter)
      .execute()
      .then(x => this.asArray(x))
      .catch(e => { throw this.constructError(e, conn); })
      ;

    return result as T[];
  }

  protected async filterOne(filter: Partial<T> | string): Promise<T | null> {
    const conn = await this.getSalesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .where(filter)
      .limit(1)
      .execute()
      .then(x => this.asArray(x).pop())
      .catch(e => { throw this.constructError(e, conn); })
      ;
      
    return result as T;
  }

  protected async insert(inserts: Partial<T>): Promise<string>;
  protected async insert(inserts: Partial<T>[]): Promise<string[]>;
  protected async insert(inserts: Partial<T> | Partial<T>[]): Promise<string | string[]> {
    const conn = await this.getSalesforceConnection();
    return await conn.sobject(this.objectName)
      .insert(inserts)
      .then(results => {
        if(!(inserts instanceof Array)) {
          return (results as SuccessResult).id.toString();
        }
        return (results as SuccessResult[]).map(r => r.id.toString());
      })
      .catch(e => { throw this.constructError(e, conn); })
      ;
  }

  protected async update(updates: Updatable<T>[] | Updatable<T>): Promise<boolean> {
    const conn = await this.getSalesforceConnection();
    return await conn.sobject(this.objectName)
      .update(updates)
      .then(() => true)
      .catch(e => { throw this.constructError(e, conn); })
      ;
  }

  protected async delete(ids: string[] | string): Promise<void> {
    const conn = await this.getSalesforceConnection();
    return new Promise<void>((resolve, reject) => {
      conn.sobject(this.objectName).delete(ids, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      })
    })
    .catch(e => { throw this.constructError(e, conn); })
    ;
  }

  private asArray(result: Partial<{}>[]): T[] {
    if(this.log) {
      console.log("Retrieved array", result);
    }
    return result as T[];
  }

  private asItem(result: { Id?: SalesforceId }): T {
    if(this.log) {
      console.log("Retrieved item", result);
    }
    return result as any as T;
  }

  private constructError(e: any, connection: Connection){
    if(e.errorCode === "ERROR_HTTP_503"){
      throw new SalesforceUnavilableError(`Salesforce unavailable`);
    }
    console.log("SALESFORCE ERROR:", JSON.stringify(e));
    return new Error(e.errorCode + ": " + e.message);
  }
}
export class SalesforceUnavilableError extends Error {

}

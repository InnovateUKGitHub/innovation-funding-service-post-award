import salesforceConnection from "./salesforceConnection";
import {SalesforceId, SuccessResult} from "jsforce";

export default abstract class SalesforceBase<T> {
  private log = false;

  protected constructor(
    protected objectName: string,
    private columns: string[]
  ) { }

  protected async retrieve(id: string): Promise<T | null> {
    try {
      const conn = await salesforceConnection();
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
    const conn = await salesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .execute()
      .then(x => this.asArray(x));

    return result as T[];
  }

  protected async whereString(filter: string): Promise<T[]> {
    const conn = await salesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .where(filter)
      .execute()
      .then(x => this.asArray(x))
      .catch(e => {
        console.log("Salesforce Error", e);
        throw e;
      });

    return result as T[];
  }

  protected async whereFilter(filter: (item: T) => void): Promise<T[]> {
    const jsonFilter = {} as T;
    filter(jsonFilter);

    const conn = await salesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .where(jsonFilter)
      .execute()
      .then(x => this.asArray(x));

    return result as T[];
  }

  protected async filterOne(filter: (item: T) => void): Promise<T | null> {
    const jsonFilter = {} as T;
    filter(jsonFilter);
    try {
        const conn = await salesforceConnection();
        const result = await conn.sobject(this.objectName)
            .select(this.columns.join(", "))
            .where(jsonFilter)
            .limit(1)
            .execute()
            .then(x => this.asArray(x).pop());
        return result as T;
    } catch (e) {
      if (e.errorCode === "INVALID_QUERY_FILTER_OPERATOR") {
        return null;
      }
      throw e;
    }
  }

  protected async updateOne(updatedObj: Partial<T> & { Id: string }): Promise<boolean> {
    const conn = await salesforceConnection();
    return await conn.sobject(this.objectName)
      .update(updatedObj)
      .then((res) => res.success);
  }

  protected async insert(insertList: Partial<T>[]): Promise<string[]> {
    const conn = await salesforceConnection();
    return await conn.sobject(this.objectName)
      .insert(insertList).then(results => {
        return (results as SuccessResult[]).map(r => r.id.toString());
      });
  }

  protected async update(updateList: Partial<T>[]) {
    const conn = await salesforceConnection();
    await conn.sobject(this.objectName).update(updateList).then(res => {
      return res.success;
    });
  }

  protected async delete(ids: string[]): Promise<void> {
    const conn = await salesforceConnection();
    return new Promise<void>((resolve, reject) => {
      conn.sobject(this.objectName).delete(ids, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
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
}

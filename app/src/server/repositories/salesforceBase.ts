import salesforceConnection from "./salesforceConnection";

export default abstract class SalesforceBase<T> {
  protected constructor(
    private objectName: string,
    private columns: string[]
  ) { }

  protected async retrieve(id: string): Promise<T|null> {
    try
    {
      const conn = await salesforceConnection();
      const result = await conn.sobject(this.objectName).retrieve(id);
      return result as T;
    }
    catch(e) {
      if (e.errorCode === "NOT_FOUND") {
        return null;
      }
      else{
        throw e;
      }

    }
  }

  protected async all(): Promise<T[]> {
    const conn = await salesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .execute();
    return result as T[];
  }

  protected async whereString(filter: string): Promise<T[]> {
    const conn = await salesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .where(filter)
      .execute();

    return result as T[];
  }

  protected async whereFilter(filter: (item: T) => void): Promise<T[]> {
    const jsonFilter = {} as T;
    filter(jsonFilter);

    const conn = await salesforceConnection();
    const result = await conn.sobject(this.objectName)
      .select(this.columns.join(", "))
      .where(jsonFilter)
      .execute();

    return result as T[];
  }
}

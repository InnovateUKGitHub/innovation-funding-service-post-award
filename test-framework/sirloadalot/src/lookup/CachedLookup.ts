import { Connection } from "jsforce";
import { ApiName } from "../enum/ApiName";
import { mapKeysToObject } from "../helper/mapKeysToObject";

interface LookupProps<TApiName extends ApiName> {
  apiName: TApiName;
}

class CachedLookup<TQuery extends {}, TApiName extends ApiName = ApiName> {
  apiName: TApiName;
  records: ({ Id: string } & Omit<TQuery, "type">)[] = [];

  constructor({ apiName }: LookupProps<TApiName>) {
    this.apiName = apiName;
  }

  async find(conn: Connection, lookup: Omit<TQuery, "type">): Promise<string> {
    const cachedRecord = this.records.find(existingRecord => {
      for (const [key, value] of Object.entries(lookup)) {
        if (existingRecord[key as keyof Omit<TQuery, "type">] !== value) return false;
      }
      return true;
    });

    if (cachedRecord) return cachedRecord.Id;

    const result = (await conn.sobject(this.apiName).findOne(
      lookup as any,
      mapKeysToObject(["Id", ...Object.keys(lookup)], () => 1),
    )) as { Id: string } & Omit<TQuery, "type">;

    if (!result) throw new Error("could not findy");

    this.records.push(result);
    return result.Id;
  }
}

export { CachedLookup };

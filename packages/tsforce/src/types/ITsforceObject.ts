import type { TsforceDescribeSObjectResult } from "../requests/TsforceDescribeSubrequest";
import type { TsforceQuerySubrequest } from "../requests/TsforceQuerySubrequest";
import type { AnyObject } from "./AnyObject";
import type { TsforceSalesforceResponse, TsforceUnsuccessfulSalesforceResponse } from "./TsforceSalesforceResponse";
import type { Readable } from "node:stream";

interface ITsforceSobject {
  name: string;
  blob(id: string, fieldName: string): Promise<Readable>;
  describe(): Promise<TsforceDescribeSObjectResult>;
  retrieve<T>(
    id: string,
    fieldNames: string[],
  ): Promise<{
    totalSize: number;
    done: boolean;
    nextRecordsUrl: string;
    records: T[];
  }>;
  select<T>(fieldNames: string[]): TsforceQuerySubrequest<T>;
  insert<T>(body: T): Promise<TsforceSalesforceResponse>;
  insertMany<T>(body: T[]): Promise<TsforceSalesforceResponse[]>;
  update({
    Id,
    ...body
  }: {
    Id: string;
  } & AnyObject): Promise<TsforceUnsuccessfulSalesforceResponse | null>;
  updateMany(
    body: ({
      Id: string;
    } & AnyObject)[],
  ): Promise<TsforceSalesforceResponse[]>;
  delete(id: string): Promise<null>;
  deleteMany(ids: string[]): Promise<TsforceSalesforceResponse[]>;
}

export { ITsforceSobject };

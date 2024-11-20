import { Dispatcher } from "undici";
import BodyReadable from "undici/types/readable";
import { TsforceDescribeSObjectResult } from "../requests/TsforceDescribeSubrequest";
import { TsforceQuerySubrequest } from "../requests/TsforceQuerySubrequest";
import { AnyObject } from "./AnyObject";
import { TsforceSalesforceResponse, TsforceUnsuccessfulSalesforceResponse } from "./TsforceSalesforceResponse";

interface ITsforceSobject {
  name: string;
  blob(id: string, fieldName: string): Promise<BodyReadable & Dispatcher.BodyMixin>;
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

import { TsforceBlobRequest } from "./requests/TsforceBlobRequest";
import { TsforceBulkDeleteSubrequest } from "./requests/TsforceBulkDeleteSubrequest";
import { TsforceBulkInsertSubrequest } from "./requests/TsforceBulkInsertSubrequest";
import { TsforceBulkUpdateSubrequest } from "./requests/TsforceBulkUpdateSubrequest";
import { TsforceDeleteSubrequest } from "./requests/TsforceDeleteSubrequest";
import { TsforceDescribeSubrequest } from "./requests/TsforceDescribeSubrequest";
import { TsforceInsertSubrequest } from "./requests/TsforceInsertSubrequest";
import { TsforceQuerySubrequest } from "./requests/TsforceQuerySubrequest";
import { TsforceUpdateSubrequest } from "./requests/TsforceUpdateSubrequest";
import { AnyObject } from "./types/AnyObject";
import { ITsforceConnection } from "./types/ITsforceConnection";
import { ITsforceSobject } from "./types/ITsforceObject";

class TsforceSobject implements ITsforceSobject {
  private readonly connection: ITsforceConnection;
  private readonly useSubrequests?: boolean;
  public readonly name: string;

  constructor({
    connection,
    name,
    useSubrequests,
  }: {
    connection: ITsforceConnection;
    name: string;
    useSubrequests?: boolean;
  }) {
    this.connection = connection;
    this.name = name;
    this.useSubrequests = useSubrequests;
  }

  private args() {
    return { connection: this.connection, sobject: this.name, useSubrequests: this.useSubrequests };
  }

  blob(id: string, fieldName: string) {
    const command = new TsforceBlobRequest({ ...this.args(), id, fieldName });
    return command.execute();
  }
  describe() {
    const command = new TsforceDescribeSubrequest({ ...this.args() });
    return command.execute();
  }
  retrieve<T>(id: string, fieldNames: string[]) {
    const command = this.select<T>(fieldNames).where({ id }).count(1);
    return command.execute();
  }
  select<T>(fieldNames: string[]) {
    const command = new TsforceQuerySubrequest<T>({ ...this.args(), fieldNames });
    return command;
  }
  insert<T>(body: T) {
    const command = new TsforceInsertSubrequest<T>({ ...this.args(), body });
    return command.execute();
  }
  insertMany<T>(body: T[]) {
    const command = new TsforceBulkInsertSubrequest<T>({ ...this.args(), body });
    return command.execute();
  }
  update({ Id, ...body }: { Id: string } & AnyObject) {
    const command = new TsforceUpdateSubrequest({ ...this.args(), id: Id, body });
    return command.execute();
  }
  updateMany(body: ({ Id: string } & AnyObject)[]) {
    const command = new TsforceBulkUpdateSubrequest({ ...this.args(), body });
    return command.execute();
  }
  delete(id: string) {
    const command = new TsforceDeleteSubrequest({ ...this.args(), id });
    return command.execute();
  }
  deleteMany(ids: string[]) {
    const command = new TsforceBulkDeleteSubrequest({ ...this.args(), ids });
    return command.execute();
  }
}

export { TsforceSobject };

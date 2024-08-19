import { TsforceBlobRequest } from "./requests/TsforceBlobRequest";
import { TsforceBulkDeleteSubrequest } from "./requests/TsforceBulkDeleteSubrequest";
import { TsforceBulkInsertSubrequest } from "./requests/TsforceBulkInsertSubrequest";
import { TsforceBulkUpdateSubrequest } from "./requests/TsforceBulkUpdateSubrequest";
import { TsforceDeleteSubrequest } from "./requests/TsforceDeleteSubrequest";
import { TsforceDescribeSubrequest } from "./requests/TsforceDescribeSubrequest";
import { TsforceInsertSubrequest } from "./requests/TsforceInsertSubrequest";
import { TsforceQuerySubrequest } from "./requests/TsforceQuerySubrequest";
import { TsforceUpdateSubrequest } from "./requests/TsforceUpdateSubrequest";
import { TsforceConnection } from "./TsforceConnection";

class TsforceSobject {
  private readonly connection: TsforceConnection;
  public readonly name: string;

  constructor({ connection, name }: { connection: TsforceConnection; name: string }) {
    this.connection = connection;
    this.name = name;
  }

  blob(id: string) {
    const command = new TsforceBlobRequest({ connection: this.connection, sobject: this.name, id });
    return command.execute();
  }
  describe() {
    const command = new TsforceDescribeSubrequest({ connection: this.connection, sobject: this.name });
    return command.execute();
  }
  retrieve<T>(id: string, fieldNames: string[]) {
    const command = this.select<T>(fieldNames).where({ id }).count(1);
    return command.execute();
  }
  select<T>(fieldNames: string[]) {
    const command = new TsforceQuerySubrequest<T>({ connection: this.connection, sobject: this.name, fieldNames });
    return command;
  }
  insert<T>(body: T) {
    const command = new TsforceInsertSubrequest<T>({ connection: this.connection, sobject: this.name, body });
    return command.execute();
  }
  insertMany<T>(body: T[]) {
    const command = new TsforceBulkInsertSubrequest<T>({ connection: this.connection, sobject: this.name, body });
    return command.execute();
  }
  update({ id, ...body }: { Id: string } & AnyObject) {
    const command = new TsforceUpdateSubrequest({ connection: this.connection, sobject: this.name, id, body });
    return command.execute();
  }
  updateMany(body: ({ Id: string } & AnyObject)[]) {
    const command = new TsforceBulkUpdateSubrequest({ connection: this.connection, sobject: this.name, body });
    return command.execute();
  }
  delete(id: string) {
    const command = new TsforceDeleteSubrequest({ connection: this.connection, sobject: this.name, id });
    return command.execute();
  }
  deleteMany(ids: string[]) {
    const command = new TsforceBulkDeleteSubrequest({ connection: this.connection, ids });
    return command.execute();
  }
}

export { TsforceSobject };

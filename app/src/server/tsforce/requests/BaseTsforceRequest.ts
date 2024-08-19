import { TsforceConnection } from "../TsforceConnection";

interface BaseTsforceRequestProps {
  connection: TsforceConnection;
}

abstract class BaseTsforceRequest<T> {
  protected version = "v59.0";
  protected readonly connection: TsforceConnection;
  abstract execute(): Promise<T>;

  constructor({ connection }: BaseTsforceRequestProps) {
    this.connection = connection;
  }
}

abstract class BaseTsforceSobjectIdRequest<T> extends BaseTsforceRequest<T> {
  protected readonly id: string;
  protected readonly sobject: string;

  constructor({ sobject, id, connection }: { sobject: string; id: string } & BaseTsforceRequestProps) {
    super({ connection });
    this.sobject = sobject;
    this.id = id;
  }
}

export { BaseTsforceRequest, BaseTsforceSobjectIdRequest, BaseTsforceRequestProps };

import { AbstractSObject } from "../sobjects/AbstractProjectFactory";

interface IDatabaseConnector {
  insert(recordsToInsert: AbstractSObject, allOrNone?: boolean): Promise<void>;
  insert(recordsToInsert: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  insert(recordsToInsert: AbstractSObject | AbstractSObject[], allOrNone?: boolean): Promise<void>;

  delete(recordToDelete: AbstractSObject, allOrNone?: boolean): Promise<void>;
  delete(recordsToDelete: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  delete(data: AbstractSObject | AbstractSObject[], allOrNone?: boolean): Promise<void>;
}

export { IDatabaseConnector };

import { ProjectFactoryDatabaseMixedSobjectInsertException } from "../exceptions/ProjectFactoryDatabaseMixedSobjectInsertException";
import { AbstractSObject } from "../sobjects/AbstractProjectFactory";
import { IDatabaseConnector } from "./IDatabaseConnector";

class StubDatabaseConnector implements IDatabaseConnector {
  counts: Map<string, number> = new Map();

  insert(data: AbstractSObject, allOrNone?: boolean): Promise<void>;
  insert(data: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  async insert(data: AbstractSObject | AbstractSObject[], allOrNone?: boolean): Promise<void> {
    if (Array.isArray(data)) {
      if (data.length === 0) return;
      const sobjectTypes = new Set<string>();

      // confirm all objects can be serialised
      // and all objects are of the same type
      for (const val of data) {
        if (allOrNone) {
          val.checkForMissingFields();
        }
        sobjectTypes.add(val.sobject);
      }

      if (sobjectTypes.size !== 1) throw new ProjectFactoryDatabaseMixedSobjectInsertException();
      await Promise.all(data.map(x => this.insert(x, allOrNone)));
    } else {
      const { sobject } = data;
      const count = (this.counts.get(sobject) ?? 0) + 1;
      this.counts.set(sobject, count);

      // confirm the object can be serialised
      // will throw an exception if not possible
      data.checkForMissingFields();
      data.Id = `${sobject}-${count}`;
    }
  }

  delete(recordToDelete: AbstractSObject, allOrNone?: boolean): Promise<void>;
  delete(recordsToDelete: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  async delete(data: AbstractSObject | AbstractSObject[], allOrNone?: boolean): Promise<void> {
    if (Array.isArray(data)) {
      for (const val of data) {
        this.delete(val);
      }
    } else {
      // TODO: If we ever have a stub query statement, we need to remove from there
    }
  }
}

export { StubDatabaseConnector };

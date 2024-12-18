import { ITsforceConnection, TsforceSalesforceResponse } from "@innovateuk/tsforce/index";
import { AbstractSObject } from "../sobjects/AbstractProjectFactory";
import { ProjectFactoryDatabaseMixedSobjectInsertException } from "../exceptions/ProjectFactoryDatabaseMixedSobjectInsertException";
import { IDatabaseConnector } from "./IDatabaseConnector";
import { ProjectFactoryDatabaseSalesforceException } from "../exceptions/ProjectFactoryDatabaseSalesforceException";
import { ProjectFactoryDatabaseQueryInvalidSoqlException } from "../exceptions/ProjectFactoryDatabaseQueryInvalidSoqlException";
import { sobjects, SObjectInstanceFromQuery, GetSobjectName } from "../sobjects/factories";
import { ProjectFactoryUnknownSobjectException } from "../exceptions/ProjectFactoryUnknownSobjectException";
import { ProjectFactoryDatabaseIdMissingException } from "../exceptions/ProjectFactoryDatabaseIdMissingException";
import { batch } from "../helpers/batch";

class DatabaseConnector implements IDatabaseConnector {
  private readonly connection: ITsforceConnection;

  constructor({ connection }: { connection: ITsforceConnection }) {
    this.connection = connection;
  }

  insert(recordToInsert: AbstractSObject, allOrNone?: boolean): Promise<void>;
  insert(recordsToInsert: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  async insert(data: AbstractSObject | AbstractSObject[], allOrNone: boolean = true): Promise<void> {
    if (Array.isArray(data)) {
      if (data.length === 0) return;
      const sobjectTypes = new Set<string>();

      for (const recordToInsert of data) {
        sobjectTypes.add(recordToInsert.sobject);
      }

      if (sobjectTypes.size !== 1) throw new ProjectFactoryDatabaseMixedSobjectInsertException();
      const { sobject } = data[0];

      data.forEach(x => x.checkForMissingFields());

      const responses = await this.connection.sobject(sobject).insertMany(data.map(x => x.toObject()));

      if (responses.some(x => !x.success)) {
        throw new ProjectFactoryDatabaseSalesforceException(
          responses
            .filter(x => !x.success)
            .map(x => x.errors)
            .flat()
            .map(x => JSON.stringify(x))
            .join(),
        );
      }

      for (let i = 0; i < data.length; i++) {
        const res = responses[i];
        if (res.success) {
          data[i].Id = res.id;
        }
      }

      return;
    } else {
      data.checkForMissingFields();
      const res = await this.connection.sobject(data.sobject).insert(data.toObject());
      if (!res.success) throw new ProjectFactoryDatabaseSalesforceException();
      data.Id = res.id;

      return;
    }
  }

  delete(recordToDelete: AbstractSObject, allOrNone?: boolean): Promise<void>;
  delete(recordsToDelete: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  async delete(data: AbstractSObject | AbstractSObject[], allOrNone: boolean = true): Promise<void> {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return;
      } else if (data.every(x => x instanceof AbstractSObject)) {
        const { sobject } = data[0];
        if (data.some(x => !x.Id)) throw new ProjectFactoryDatabaseIdMissingException();
        await this.connection.sobject(sobject).deleteMany(data.map(x => x.Id) as string[]);
      } else {
        throw new ProjectFactoryDatabaseMixedSobjectInsertException();
      }
    } else {
      if (!data.Id) throw new ProjectFactoryDatabaseIdMissingException();
      const { sobject } = data;
      await this.connection.sobject(sobject).delete(data.Id);
    }
  }

  update(recordToUpdate: AbstractSObject, allOrNone?: boolean): Promise<void>;
  update(recordsToUpdate: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  async update(data: AbstractSObject | AbstractSObject[], allOrNone: boolean = true): Promise<void> {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return;
      } else if (data.every(x => x instanceof AbstractSObject)) {
        const { sobject } = data[0];
        if (data.some(x => !x.Id)) throw new ProjectFactoryDatabaseIdMissingException();
        await this.connection.sobject(sobject).updateMany(data.map(x => x.toObject()));
      } else {
        throw new ProjectFactoryDatabaseMixedSobjectInsertException();
      }
    } else {
      if (!data.Id) throw new ProjectFactoryDatabaseIdMissingException();
      const { sobject } = data;
      await this.connection.sobject(sobject).update(data.toObject());
    }
  }

  upsert(recordToUpdate: AbstractSObject, allOrNone?: boolean): Promise<void>;
  upsert(recordsToUpdate: AbstractSObject[], allOrNone?: boolean): Promise<void>;
  async upsert(data: AbstractSObject | AbstractSObject[], allOrNone: boolean = true): Promise<void> {
    if (Array.isArray(data)) {
      const itemsToInsert = data.filter(x => typeof x.Id === "undefined");
      const itemsToUpdate = data.filter(x => typeof x.Id !== "undefined");

      await this.insert(itemsToInsert, allOrNone);
      await this.update(itemsToUpdate, allOrNone);
    } else {
      if (typeof data.Id === "undefined") {
        await this.insert(data, allOrNone);
      } else {
        await this.update(data, allOrNone);
      }
    }
  }

  async query<Query extends string>(
    queryString: Query,
  ): Promise<InstanceType<(typeof sobjects)[GetSobjectName<Query>]>[]> {
    const match = /^SELECT .+ FROM (\w+)/.exec(queryString);
    if (!match) throw new ProjectFactoryDatabaseQueryInvalidSoqlException();
    const sobject = match[1] as keyof typeof sobjects;
    if (!sobjects[sobject]) throw new ProjectFactoryUnknownSobjectException();

    const Factory = sobjects[sobject] as (typeof sobjects)[GetSobjectName<Query>];

    const res = await this.connection.executeSOQL({ query: queryString });

    if (!("records" in res)) {
      throw new ProjectFactoryDatabaseQueryInvalidSoqlException();
    }

    return res.records.map(x => {
      const factory = new Factory();
      Object.assign(factory, x);
      return factory as SObjectInstanceFromQuery<Query>;
    });
  }
}

export { DatabaseConnector };

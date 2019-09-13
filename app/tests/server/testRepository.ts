import {Updatable} from "../../src/server/repositories/salesforceRepositoryBase";
import { NotFoundError } from "@server/features/common";

export abstract class TestRepository<T> {
  Items: T[] = [];

  protected getOne(conditional: (item: T) => boolean): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const found = this.Items.find(x => conditional(x));
      if (found) {
        resolve(found);
      }
      else {
        reject(new NotFoundError("NOT FOUND"));
      }
    });
  }

  protected filterOne(conditional: (item: T) => boolean): Promise<T|null> {
    return new Promise<T|null>((resolve, reject) => {
      const found = this.Items.find(x => conditional(x));
      if (found) {
        resolve(found);
      }
      else {
        resolve(null);
      }
    });
  }

  protected getWhere(conditional: (item: T) => boolean): Promise<T[]> {
    return new Promise<T[]>((resolve) => {
      const found = this.Items.filter(x => conditional(x));
      resolve(found);
    });
  }

  protected getAll(): Promise<T[]> {
    return Promise.resolve(this.Items);
  }

  protected deleteItem(item: T|null|undefined): Promise<void> {
    this.Items = this.Items.filter(element => element !== item);
    return Promise.resolve();
  }

  protected update(update: Updatable<T> | Updatable<T>[]): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected insertOne(inserted: T) {
    this.Items.push(inserted);
    return Promise.resolve(this.Items.length.toString());
  }
}

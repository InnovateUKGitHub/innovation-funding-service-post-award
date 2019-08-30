import { Clock } from "@server/features/common/clock";

export interface ISalesforceMapper<TSalesforce, TEntity> {
  map: (item: TSalesforce) => TEntity;
}

export abstract class SalesforceBaseMapper<TSalesforce, TEntity> implements ISalesforceMapper<TSalesforce, TEntity> {
  protected clock: Clock;

  constructor() {
    this.clock = new Clock();
  }

  public abstract map(item: TSalesforce): TEntity;
}

export interface ISalesforceMapper<TSalesforce, TEntity> {
  map: (item: TSalesforce) => TEntity;
}

export abstract class SalesforceBaseMapper<TSalesforce, TEntity> implements ISalesforceMapper<TSalesforce, TEntity> {
  public abstract map(item: TSalesforce): TEntity;
}

import { MiddlewareInterface, ResolverData, NextFn } from "type-graphql";

class RenameInternalToSalesforceFieldNames<TContext> implements MiddlewareInterface<TContext> {
  async use({ context, info }: ResolverData<TContext>, next: NextFn) {
    
  }
}

export { RenameInternalToSalesforceFieldNames };

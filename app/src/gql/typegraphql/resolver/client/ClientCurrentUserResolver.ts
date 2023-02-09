import type { GraphQLContext } from "@gql/GraphQLContext";
import { configuration } from "@server/features/common";
import { Ctx, Query, Resolver } from "type-graphql";
import { ClientCurrentUserObject } from "@gql/typegraphql/object/client/ClientCurrentUserObject";

@Resolver()
class ClientCurrentUserResolver {
  @Query(() => ClientCurrentUserObject)
  currentUser(@Ctx() ctx: GraphQLContext): ClientCurrentUserObject {
    return {
      email: ctx.email,
      isSystemUser: ctx.email === configuration.salesforceServiceUser.serviceUsername,
    };
  }
}

export { ClientCurrentUserResolver };

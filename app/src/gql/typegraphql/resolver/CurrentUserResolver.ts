import type { GraphQLContext } from "@gql/GraphQLContext";
import { configuration } from "@server/features/common";
import { Ctx, Query, Resolver } from "type-graphql";
import { CurrentUserObject } from "../object/CurrentUserObject";

@Resolver()
class CurrentUserResolver {
  @Query(() => CurrentUserObject)
  currentUser(@Ctx() ctx: GraphQLContext): CurrentUserObject {
    return {
      email: ctx.email,
      isSystemUser: ctx.email === configuration.salesforceServiceUser.serviceUsername,
    };
  }
}

export { CurrentUserResolver };

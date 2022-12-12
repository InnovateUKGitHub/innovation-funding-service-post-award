import { GraphQLContext } from "@gql/GraphQLContext";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
class CurrentUserResolver {
  @Query(() => String, { nullable: true })
  currentUser(@Ctx() ctx: GraphQLContext): string | null {
    return ctx.email;
  }
}

export { CurrentUserResolver };

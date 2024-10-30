import type { GraphQLContext } from "@gql/GraphQLContext";
import { Ctx, Query, Resolver } from "type-graphql";
import { CurrentUserObject } from "../object/CurrentUserObject";
import { DeveloperObject } from "../object/DeveloperObject";

@Resolver()
class DeveloperResolver {
  @Query(() => CurrentUserObject)
  async developer(@Ctx() ctx: GraphQLContext): Promise<DeveloperObject> {
    return { email: ctx.developerEmail };
  }
}

export { DeveloperResolver };

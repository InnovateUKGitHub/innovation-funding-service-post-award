import { GraphQLContext } from "@gql/GraphQLContext";
import { SalesforceAccProjectObject } from "@gql/typegraphql/object/sf/SalesforceAccProjectObject";
import { SalesforceAccProjectParticipantObject } from "@gql/typegraphql/object/sf/SalesforceAccProjectParticipantObject";
import { GraphQLResolveInfo } from "graphql";
import { Ctx, FieldResolver, Info, Resolver, Root } from "type-graphql";
import { sfResolver } from "./sfResolver";

@Resolver(() => SalesforceAccProjectObject)
class SalesforceApiProjectResolver {
  @FieldResolver(() => [SalesforceAccProjectParticipantObject])
  async projectParticipants(
    @Root() root: SalesforceAccProjectObject,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    return sfResolver({ context, info, ids: root.projectParticipantIds });
  }
}

export { SalesforceApiProjectResolver };

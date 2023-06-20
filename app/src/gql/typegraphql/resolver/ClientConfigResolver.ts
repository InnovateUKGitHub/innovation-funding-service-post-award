import { Query, Resolver } from "type-graphql";
import { ClientConfigObject } from "@gql/typegraphql/object/ClientConfigObject";
import { configuration } from "@server/features/common/config";

@Resolver(ClientConfigObject)
class ClientConfigResolver {
  @Query(() => ClientConfigObject)
  async clientConfig(): Promise<ClientConfigObject> {
    return {
      ifsRoot: configuration.urls.ifsRoot,
      features: configuration.features,
      ssoEnabled: configuration.sso.enabled,
      options: configuration.options,
      logLevel: configuration.logLevel,
    };
  }
}

export { ClientConfigResolver };

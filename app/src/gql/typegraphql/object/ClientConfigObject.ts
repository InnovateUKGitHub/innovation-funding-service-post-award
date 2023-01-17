import { LogLevel } from "@framework/types";
import { IAppOptions } from "@framework/types/IAppOptions";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Field, ObjectType } from "type-graphql";
import { ClientConfigAppOptionsObject } from "./ClientConfigAppOptionsObject";
import { ClientConfigFeaturesObject } from "./ClientConfigFeaturesObject";

@ObjectType()
class ClientConfigObject implements IClientConfig {
  @Field(() => ClientConfigFeaturesObject)
  features!: ClientConfigFeaturesObject;

  @Field(() => ClientConfigAppOptionsObject)
  options!: IAppOptions;

  @Field(() => String)
  ifsRoot!: string;

  @Field(() => Boolean)
  ssoEnabled!: boolean;

  @Field(() => LogLevel)
  logLevel!: LogLevel;
}

export { ClientConfigObject };

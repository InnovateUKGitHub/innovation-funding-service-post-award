import { Field, Int, ObjectType } from "type-graphql";
import { ClientConfigAppOptionsPermittedFileTypesObject } from "./ClientConfigAppOptionsPermittedFileTypesObject";

@ObjectType()
class ClientConfigAppOptionsObject {
  @Field(() => Int)
  maxFileSize!: number;

  @Field(() => Int)
  maxUploadFileCount!: number;

  @Field(() => [String])
  permittedFileTypes!: string[];

  @Field(() => ClientConfigAppOptionsPermittedFileTypesObject)
  permittedTypes!: ClientConfigAppOptionsPermittedFileTypesObject;

  @Field(() => Int)
  bankCheckValidationRetries!: number;

  @Field(() => Int)
  bankCheckAddressScorePass!: number;

  @Field(() => Int)
  bankCheckCompanyNameScorePass!: number;

  @Field(() => Int)
  standardOverheadRate!: number;

  @Field(() => Int)
  numberOfProjectsToSearch!: number;

  @Field(() => Int)
  maxClaimLineItems!: number;

  @Field(() => Int)
  nonJsMaxClaimLineItems!: number;
}

export { ClientConfigAppOptionsObject };

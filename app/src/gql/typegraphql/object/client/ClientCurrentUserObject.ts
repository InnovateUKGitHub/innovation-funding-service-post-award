import { Field, ObjectType } from "type-graphql";

@ObjectType()
class ClientCurrentUserObject {
  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => Boolean)
  isSystemUser!: boolean;
}

export { ClientCurrentUserObject };

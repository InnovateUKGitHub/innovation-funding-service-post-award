import { Field, ObjectType } from "type-graphql";

@ObjectType()
class CurrentUserObject {
  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => Boolean)
  isSystemUser!: boolean;
}

export { CurrentUserObject };

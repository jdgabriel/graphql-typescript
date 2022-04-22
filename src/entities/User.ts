import cypto from "node:crypto";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  constructor(props: Omit<User, "id">, id?: string) {
    this.id = id ?? cypto.randomUUID();
    Object.assign(this, props);
  }
}

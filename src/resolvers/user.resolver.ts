import {
  Arg,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { User } from "../entities/User";
import { UserSubscription } from "../enum/user-sub.emun";
import { CreateUserInput } from "../inputs/create-user.input";

@Resolver()
export class UserResolver {
  private data: User[] = [];

  @Query(() => [User])
  async users() {
    return this.data;
  }

  @Mutation(() => User)
  async createUser(
    @Arg("input") input: CreateUserInput,
    @PubSub(UserSubscription.NOTIFICATIONS)
    publish: Publisher<{ topic: string; user: User }>
  ) {
    const { email, name } = input;
    const user = new User({ email, name });
    this.data.push(user);

    await publish({
      topic: UserSubscription.NOTIFICATIONS,
      user,
    });

    return user;
  }

  @Subscription({
    topics: UserSubscription.NOTIFICATIONS,
    filter: ({ payload, args }) => payload.topic === args.topic,
  })
  userCreated(
    @Arg("topic") topic: string,
    @Root() payload: { topic: string; user: User }
  ): User {
    return payload.user;
  }
}

import { registerEnumType } from "type-graphql";

export enum UserSubscription {
  NOTIFICATIONS = "NOTIFICATIONS",
}

registerEnumType(UserSubscription, {
  name: "UserSubscription",
  description: "User subscription topics",
});

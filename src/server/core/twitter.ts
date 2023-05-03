import { env } from "@/env.mjs";
import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: env.TWITTER_CLIENT_ID,
  appSecret: env.TWITTER_CLIENT_SECRET,
});

const roClient = client.v1;

export const getTweets = async (username: string) => {
  const tweets = (await roClient.get("statuses/user_timeline", {
    screen: username,
  })) as unknown;

  return tweets;
};

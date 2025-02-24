import { redis } from "../redis/client";

interface GetSubscriberInvitesClicksParams {
  subscriberId: string;
}

export async function getSubscriberInvitesClicks({
  subscriberId,
}: GetSubscriberInvitesClicksParams) {
  const count = await redis.hget("referral:access-count", subscriberId);

  return { count: count ? Number.parseInt(count) : 0 };
}

"use server";

import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamSecret = process.env.STREAM_API_SECRET;

export async function getStreamToken(userId: string) {
  if (!apiKey || !streamSecret) {
    throw new Error("Stream API Key or Secret not found");
  }
  const client = new StreamClient(apiKey, streamSecret);
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  
  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: expirationTime,
  });

  return token;
}

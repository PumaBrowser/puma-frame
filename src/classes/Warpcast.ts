// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { config } from "@/config/config";
import { z } from "zod";

// Neynar's api
const apiUrl = "https://api.neynar.com";

const validateMessageSchema = z.object({
  valid: z.literal(true),
  action: z.object({
    interactor: z.object({
      fid: z.number(),
      username: z.string(),
      custody_address: z.string().startsWith("0x"),
    }),
    tapped_button: z.object({
      index: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    }),
  }),
});

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(config.neynar.apiKey as string);

interface User {
  fid: number;
}

export const fetchAllFollowing = async (fid: number): Promise<User[]> => {
  let cursor: string | null = "";
  let users: User[] = [];
  do {
    const result = await client.fetchUserFollowing(fid, {
      limit: 150,
      cursor,
    });
    users = users.concat(result.result.users);
    cursor = result.result.next.cursor;
  } while (cursor !== "" && cursor !== null);

  return users;
};

// const rishFID = 194;
// const rishFollowings = await fetchAllFollowing(rishFID);

export class Warpcast {
  private static get computeDefaultHeader() {
    return {
      api_key: config.neynar.apiKey as string,
      "content-type": "application/json",
    };
  }

  public static async validateMessage(messageBytes: string) {
    const url = `${apiUrl}/v2/farcaster/frame/validate`;

    const response = await fetch(url, {
      headers: Warpcast.computeDefaultHeader,
      method: "POST",
      body: JSON.stringify({
        message_bytes_in_hex: messageBytes,
      }),
    });

    const data = await response
      .json()
      .then((res) => res)
      .then(validateMessageSchema.parse);

    return data.action;
  }
}

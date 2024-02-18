import { computeHtml } from "@/utils/compute-html";

import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { z } from "zod";
import { ThirdWebEngine } from "@/classes/ThirdWebEngine";
import { Warpcast, fetchAllFollowing } from "@/classes/Warpcast";
import { config } from "@/config/config";

const requestBodyWarpcastSchema = z.object({
  trustedData: z.object({
    messageBytes: z.string().min(5),
  }),
});

const requestQuerySchema = z.object({
  // "start" = will display Re-cast to mint & Like to mint
  // "follow" = will attempt to see if you follow the user
  // "mint" = will be the actual mint process and display a congratulation html view
  type: z.union([z.literal("start"), z.literal("follow"), z.literal("mint")]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "POST"],
    origin: "*",
  });

  if (req.method !== "POST") {
    return res.status(400).send({ error: "invalid method" });
  }

  try {
    const { type } = requestQuerySchema.parse(req.query);

    const { trustedData } = requestBodyWarpcastSchema.parse(req.body);

    const action = await Warpcast.validateMessage(trustedData.messageBytes);

    if (type === "start") {
      const isNFTOwned = await ThirdWebEngine.isNFTOwned(
        action.interactor.custody_address
      );

      if (isNFTOwned) {
        return res.status(200).send(
          computeHtml({
            imagePath: "/image.png",
            postType: "start",
            content: "You already own the NFT",
          })
        );
      }

      const isBalanceLow = await ThirdWebEngine.isBalanceLow();

      if (isBalanceLow) {
        return res.status(200).send(
          computeHtml({
            imagePath: "/image.png",
            postType: "start",
            content: "Sorry we went out of gas :(",
          })
        );
      }

      return res.status(200).send(
        computeHtml({
          imagePath: "/image.png",
          postType: "follow",
          content: "Follow to mint",
        })
      );
    }

    if (type === "follow") {
      const fid = action.interactor.fid;

      const followings = await fetchAllFollowing(fid);

      console.log("followings", followings);

      const hasToFollow = config.warpcast.fIds;

      const oneOfTheOwners = hasToFollow.some(
        (fid) => Number(fid) === action.interactor.fid
      );

      if (oneOfTheOwners) {
        return res.status(200).send(
          computeHtml({
            imagePath: "/image.png",
            postType: "mint",
            content: "Mint",
          })
        );
      }

      const isFollowingAllFids = hasToFollow.every((fid) =>
        followings.some((following) => following.fid === Number(fid))
      );

      if (!isFollowingAllFids) {
        return res.status(200).send(
          computeHtml({
            imagePath: "/image.png",
            postType: "follow",
            content: "Follow to mint",
          })
        );
      }

      return res.status(200).send(
        computeHtml({
          imagePath: "/image.png",
          postType: "mint",
          content: "Mint",
        })
      );
    }

    if (type === "mint") {
      await ThirdWebEngine.mint(action.interactor.custody_address);

      return res.status(200).send(
        computeHtml({
          imagePath: "/image.png",
          postType: "start", // Do your own custom post_url after user has minted the NFT + clicks your button
          content: "Congrats! The NFT was sent to your wallet",
        })
      );
    }
  } catch (err) {
    return res.status(200).send(
      computeHtml({
        imagePath: "/image.png",
        postType: "start",
        content: "Something went wrong",
      })
    );
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis/node";

import { likeArticleMoralis } from "@/helpers/articles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const success = await likeArticleMoralis(
    req.body.articleSlug.toString(),
    req.body.userID.toString(),
    Moralis
  );

  res.status(200).json(success);
}

export {};

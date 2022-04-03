import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis/node";

import { setArticleMoralis } from "@/helpers/articles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const success = req.body.slug
    ? await setArticleMoralis(
        req.body.slug.toString(),
        req.body.title.toString(),
        req.body.mdxContent.toString(),
        req.body.userId.toString(),
        req.body.previewPictureURL.toString(),
        Moralis
      )
    : "error";

  res.status(200).json(success);
}

export {};

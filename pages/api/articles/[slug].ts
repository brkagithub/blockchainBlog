import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis/node";

import { getArticleMoralis } from "@/helpers/articles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const article = req.query.slug
    ? await getArticleMoralis(req.query.slug.toString(), Moralis)
    : {};
  res.status(200).json(article);
}

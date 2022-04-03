import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis/node";

import { getAllArticleSlugsMoralis } from "@/helpers/articles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  res.status(200).json(await getAllArticleSlugsMoralis(Moralis));
}

import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import type MoralisLib from "moralis/node";
import env from "@/helpers/env";
import MoralisType from "moralis";
import { RunCircle } from "@mui/icons-material";

type MDXContent = string;
type MDXBlogData = Record<string, any>;

export const getArticleProps = async (
  blog: MDXContent
): Promise<{
  source: MDXRemoteSerializeResult;
  data: MDXBlogData;
}> => {
  const { content, data } = matter(blog);
  const source = await serialize(content, { scope: data });
  return {
    source,
    data,
  };
};

export const getArticle = async (
  slug: string,
  apiUrl = ""
): Promise<MDXContent> => {
  try {
    const article = await fetch(`${apiUrl}/api/articles/${slug}`).then((r) =>
      r.json()
    );
    return article?.mdxContent ?? "";
  } catch (e) {
    console.log("ERROR!", e);
    return "";
  }
};

export const getArticleMoralis = async (slug: string, Moralis: MoralisLib) => {
  try {
    await Moralis.start({
      appId: env.MORALIS_APP_ID,
      serverUrl: env.MORALIS_SERVER_URL,
      masterKey: process.env.MORALIS_MASTER_KEY,
    });
    const query = new Moralis.Query("Article");
    query.equalTo("slug", slug);
    return (await query.first({ useMasterKey: true }))?.attributes ?? {};
  } catch (e) {
    console.log("ERROR!", e);
    return {};
  }
};

export const getAllArticleSlugs = async (apiUrl = ""): Promise<string[]> => {
  try {
    return await fetch(`${apiUrl}/api/articles`).then((r) => r.json());
  } catch (e) {
    console.log("ERROR!", e);
    return [];
  }
};

export const getAllArticleSlugsMoralis = async (
  Moralis: MoralisLib
): Promise<string[]> => {
  try {
    await Moralis.start({
      appId: env.MORALIS_APP_ID,
      serverUrl: env.MORALIS_SERVER_URL,
      masterKey: process.env.MORALIS_MASTER_KEY,
    });
    const query = new Moralis.Query("Article");
    query.select("slug");
    const articles = await query.find({ useMasterKey: true });
    return articles.map((a) => a.get("slug"));
  } catch (e) {
    console.log("ERROR!", e);
    return [];
  }
};

export const setArticleMoralis = async (
  slug: string,
  title: string,
  mdxContent: string,
  userId: string,
  previewPictureURL: string,
  Moralis: MoralisLib
): Promise<string> => {
  try {
    await Moralis.start({
      appId: env.MORALIS_APP_ID,
      serverUrl: env.MORALIS_SERVER_URL,
      masterKey: process.env.MORALIS_MASTER_KEY,
    });
    const Article = Moralis.Object.extend("Article");
    const newArticle = new Article();

    const slugExists = await getArticleMoralis(slug, Moralis);

    if (slugExists.length > 0) {
      console.log("error: Change the slug");
      return "error"; //future mechanism needed to generate slugs...
    }

    const author = await Moralis.Cloud.run("getUserObjectById", {
      paramUserId: userId,
    });

    newArticle.set("slug", slug);
    newArticle.set("title", title);
    newArticle.set("mdxContent", mdxContent);
    newArticle.set("isValidated", true);
    newArticle.set("author", author);
    newArticle.set("previewPictureURL", previewPictureURL);

    newArticle.save();
    return "Created " + title;
  } catch (e) {
    console.log("ERROR!", e);
    return "error";
  }
};

export const likeArticleMoralis = async (
  articleSlug: string,
  userId: string,
  Moralis: MoralisLib
): Promise<string> => {
  try {
    await Moralis.start({
      appId: env.MORALIS_APP_ID,
      serverUrl: env.MORALIS_SERVER_URL,
      masterKey: process.env.MORALIS_MASTER_KEY,
    });

    const returnValue = await Moralis.Cloud.run("userLikingArticle", {
      paramUserId: userId,
      paramArticleSlug: articleSlug,
    });

    return returnValue;
  } catch (e) {
    console.log("ERROR!", e);
    return "error";
  }
};

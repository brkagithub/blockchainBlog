import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Moralis from "moralis/node";

import { LayoutItemSafe } from "@/components/UI/Layout";
import { MDXRenderer } from "@/helpers/mdx";
import {
  getAllArticleSlugsMoralis,
  getArticleMoralis,
  getArticleProps,
  likeArticleMoralis,
} from "@/helpers/articles";
import { Button, IconButton } from "@mui/material";
import { useMoralis } from "react-moralis";
import { useState } from "react";

type BlogPageProps = {
  source: MDXRemoteSerializeResult;
  sourceData: any;
  articleSlug: any;
  userIdsThatLiked: any;
};

const BlogPage: NextPage<BlogPageProps> = (props) => {
  const { user } = useMoralis();

  const [likes, setLikes] = useState(props.userIdsThatLiked);

  const onLike: (articleSlug: string) => Promise<string> = async (
    articleSlug
  ) => {
    const response = await fetch(`/api/articles/${articleSlug}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleSlug: articleSlug,
        userID: user?.id ? user.id : "",
      }),
    });

    return response?.body?.toString() ? response?.body?.toString() : "";
  };

  return (
    <LayoutItemSafe>
      <h1>{props.sourceData?.title}</h1>
      <MDXRenderer source={props.source} />
      <Button
        variant="contained"
        color={"primary"}
        size="medium"
        onClick={async () => {
          if (likes?.includes(user?.id ? user.id : ""))
            setLikes(
              likes?.filter((el: any) => el != (user?.id ? user.id : ""))
            );
          else {
            setLikes(likes?.concat([user?.id]));
          }

          await onLike(props.articleSlug);
        }}
      >
        {likes?.includes(user?.id ? user.id : "") ? "Unlike" : "Like"}{" "}
        {likes?.length}
      </Button>
    </LayoutItemSafe>
  );
};
export default BlogPage;

export const getStaticProps: GetStaticProps<BlogPageProps> = async ({
  params,
}) => {
  const slug = params!.slug as string;
  const article = await getArticleMoralis(slug, Moralis);
  const blogMDX = article?.mdxContent ?? "";
  const { source, data } = await getArticleProps(blogMDX);

  const userIdsThatLiked = await Moralis.Cloud.run("getArticleUserIdsLikes", {
    paramArticleSlug: slug,
  });

  return {
    props: {
      source,
      sourceData: data,
      articleSlug: slug,
      userIdsThatLiked: userIdsThatLiked,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allSlugs = await getAllArticleSlugsMoralis(Moralis);

  return {
    paths: allSlugs.map((s) => ({
      params: {
        slug: s,
      },
    })),
    fallback: true,
  };
};

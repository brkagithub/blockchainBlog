import { GetServerSideProps, NextPage } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import Moralis from "moralis/node";

import { LayoutItemSafe } from "@/components/UI/Layout";
import { MDXRenderer } from "@/helpers/mdx";
import { getArticleMoralis, getArticleProps } from "@/helpers/articles";

type BlogPageProps = {
  source: MDXRemoteSerializeResult;
  sourceData: any;
};

const BlogPageSSR: NextPage<BlogPageProps> = (props) => {
  return (
    <LayoutItemSafe>
      <h1>{props.sourceData?.title}</h1>
      <MDXRenderer source={props.source} />
    </LayoutItemSafe>
  );
};
export default BlogPageSSR;

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async (
  req
) => {
  const slug = req.params!.slug as string;
  const article = await getArticleMoralis(slug, Moralis);
  const blogMDX = article?.mdxContent ?? "";
  const { source, data } = await getArticleProps(blogMDX);
  return {
    props: {
      source,
      sourceData: data,
    },
  };
};

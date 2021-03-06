import Image from "next/image";
import Link from "next/link";
import { useMoralisCloudFunction, useMoralisQuery } from "react-moralis";
import { Button, Grid, Typography, Box } from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Moralis from "moralis/node";
import { getAllArticles } from "@/helpers/articles";
import { LayoutItemLoading, LayoutItemSafe } from "@/components/UI/Layout";
import ScrollableTags from "@/components/UI/ScrollableTags";

import { useAuthRedirect } from "@/helpers/hooks";

interface IUsernameId {
  username: string;
  id: string;
}

interface IArticle {
  id: any;
  isValidated: boolean;
  slug: string;
  previewPictureURL: string;
  title: string;
  authorID: any;
}

type HomePageProps = {
  dataArticles: any;
};

const Home: NextPage<HomePageProps> = (props) => {
  const { data: dataUsernamesIds } =
    useMoralisCloudFunction("getUsernamesAndIds");

  /*const { data: dataArticles } = useMoralisQuery(
    "Article",
    (query) => query.ascending("name"),
    [],
    {}
  );*/

  const { user, isAuth, logout } = useAuthRedirect();

  if (!isAuth || !user) return <LayoutItemLoading />;

  return (
    <LayoutItemSafe sx={{ width: 1 }}>
      <ScrollableTags />
      <Box sx={{ flexGrow: 1, bgcolor: "error.main", pt: "10px" }}>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 2 }}
          columnSpacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 2, md: 4 }} //maybe it can become flexbox with XL ?
        >
          {props.dataArticles?.map(
            (
              article: IArticle //maybe Link can have prefetch=false
            ) =>
              article.isValidated == true ? (
                <Grid item xs={1} sm={1} md={1} key={article.id}>
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <Box key={article.id} sx={{ cursor: "pointer" }}>
                      <img
                        style={{
                          display: "block",
                          margin: "0 auto",
                          borderRadius: "50%",
                          border: "1px solid black",
                        }}
                        width="200"
                        height="200"
                        src={article.previewPictureURL}
                      ></img>

                      <Typography
                        variant="body1"
                        style={{
                          textAlign: "center",
                          fontSize: "1.5rem",
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          textAlign: "center",
                          fontSize: "0.7rem",
                        }}
                      >
                        Post by{" "}
                        {(dataUsernamesIds as Array<IUsernameId>)?.map(
                          (usernameAndId) =>
                            usernameAndId.id == article.authorID
                              ? usernameAndId.username
                              : ""
                        )}
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
              ) : (
                <></>
              )
          )}
        </Grid>
      </Box>
      <Button color="primary" onClick={() => logout()}>
        Logout
      </Button>
    </LayoutItemSafe>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const dataArticles = await getAllArticles(Moralis);

  return {
    props: {
      dataArticles,
    },
    revalidate: 10,
  };
};

import Head from "next/head";
import { ComponentProps, PropsWithChildren, useState } from "react";
import { CircularProgress, Grid, ThemeProvider } from "@mui/material";

import Navbar from "./Navbar";
import { lightTheme, darkTheme } from "./theming";

const Layout = (props: PropsWithChildren<any>): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false); //dark mode initially false
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    //ThemeProvider wraps the whole app
    <ThemeProvider theme={theme}>
      <Head>
        <title>Dev3 Web3 Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Navbar theme={theme} onThemeModeChange={setDarkMode} />
      <Grid container maxWidth="xl" mx="auto" minHeight="100vh" spacing={0}>
        {props.children}
      </Grid>
    </ThemeProvider>
  );
};
export default Layout;

const TOP_NAV_HEIGHT = 9;
export const LayoutItemSafe = (props: ComponentProps<typeof Grid>) => (
  <Grid item {...props} pt={TOP_NAV_HEIGHT} />
);
export const LayoutItemSafeCenter = (props: ComponentProps<typeof Grid>) => (
  <Grid
    item
    {...props}
    mx="auto"
    justifySelf="center"
    alignSelf="center"
    pt={TOP_NAV_HEIGHT}
  />
);
export const LayoutItemLoading = () => (
  <LayoutItemSafeCenter>
    <CircularProgress size={120} />
  </LayoutItemSafeCenter>
);

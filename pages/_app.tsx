import "../styles/globals.scss";
import type { AppProps } from "next/app";

import Layout from "@/components/UI/Layout";
import { MoralisProvider } from "@/helpers/moralis";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MoralisProvider>
  );
}

export default MyApp;

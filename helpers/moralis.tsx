import { PropsWithChildren, useEffect } from "react";
import { MoralisProvider as MProvider, useMoralis } from "react-moralis";

import env from "./env";

const MMiddleware = (props: PropsWithChildren<any>): JSX.Element => {
  const { Moralis } = useMoralis();

  useEffect(() => {
    Moralis.onAccountChanged(async (account) => {
      const confirmed = confirm("Link this address to your account?");
      if (confirmed && account) {
        await Moralis.link(account);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return props.children;
};

export const MoralisProvider = (props: PropsWithChildren<any>) => (
  <MProvider appId={env.MORALIS_APP_ID} serverUrl={env.MORALIS_SERVER_URL}>
    <MMiddleware>{props.children}</MMiddleware>
  </MProvider>
);

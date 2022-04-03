import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { Button } from "@mui/material";

export const MDXRenderer = (props: {
  source: MDXRemoteSerializeResult;
}): JSX.Element => {
  if (!props.source) return <>{"Loading..."}</>;
  return (
    <MDXRemote
      {...props.source}
      components={{
        Button,
      }}
    />
  );
};

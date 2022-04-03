import React from "react";
import { LayoutItemSafe } from "@/components/UI/Layout";
import { NextPage } from "next";

const ArticlesForMe: NextPage = () => {
  return (
    <LayoutItemSafe sx={{ width: 1 }}>
      <div>articles for Me</div>
    </LayoutItemSafe>
  );
};

export default ArticlesForMe;

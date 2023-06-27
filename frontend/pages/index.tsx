import React from "react";

import { NextPageWithLayout } from "@/types/next.types";
import { Authenticated } from "@/components/Authenticated";

const IndexPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Hello World from index</h1>
    </div>
  );
};

IndexPage.getLayout = (page) => {
  return <Authenticated>{page}</Authenticated>;
};

export default IndexPage;

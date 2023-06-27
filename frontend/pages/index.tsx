import React from "react";

import { NextPageWithLayout } from "@/types/next.types";
import { useSession } from "@/hooks/useSession";
import { Authenticated } from "@/components/Authenticated";

const IndexPage: NextPageWithLayout = () => {
  const session = useSession();

  return (
    <div>
      <h1>Hello World from {session?.user.first_name}</h1>
    </div>
  );
};

IndexPage.getLayout = (page) => {
  return <Authenticated>{page}</Authenticated>;
};

export default IndexPage;

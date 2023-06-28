import React from "react";

import { NextPageWithLayout } from "@/types/next.types";
import { Authenticated } from "@/components/auth/Authenticated";

const LoginRoot: NextPageWithLayout = () => {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex gap-4">Test</div>
    </section>
  );
};

LoginRoot.getLayout = (page) => {
  return <Authenticated>{page}</Authenticated>;
};

export default LoginRoot;

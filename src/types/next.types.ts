import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

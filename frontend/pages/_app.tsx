import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { NextPageWithLayout } from "@/types/next.types";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { RQQueryClientProvider } from "@/components/client-providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

function LaitrrApp(props: MyAppProps) {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RQQueryClientProvider>
          <div
            className={cn(
              "bg-background min-h-screen font-sans antialiased",
              fontSans.variable
            )}
          >
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                {getLayout(<Component {...pageProps} />)}
              </div>
            </div>
          </div>
          <TailwindIndicator />
        </RQQueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default LaitrrApp;

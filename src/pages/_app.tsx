import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Hint Hub</title>
        <meta name="description" content="Virtual Sticky Notes for Power Users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MantineProvider
        withCSSVariables
        withNormalizeCSS
        theme={{
          fontFamily: "Inter, sans-serif",
          // colorScheme: "dark",
        }}
      >
        <ModalsProvider>
          <SessionProvider session={session}>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </SessionProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { IconBoxMultiple, IconDashboard, IconFileText, IconHome, IconSearch } from "@tabler/icons";

const actions: SpotlightAction[] = [
  {
    title: 'Go to Collections',
    description: 'Get to collections page',
    onTrigger: () => console.log('Collections'),
    icon: <IconBoxMultiple size={18} />,
    group: "General"
  },
  {
    title: 'Documentation',
    description: 'Visit documentation to lean more about all features',
    onTrigger: () => console.log('Documentation'),
    icon: <IconFileText size={18} />,
    group: "General"
  },
  {
    title: 'Search Collection',
    onTrigger: () => console.log('Documentation'),
    icon: <IconFileText size={18} />,
    group: "Collections"
  },
  {
    title: 'Create Collection',
    onTrigger: () => console.log('Documentation'),
    icon: <IconFileText size={18} />,
    group: "Collections"
  },
  {
    title: 'Search Hints',
    onTrigger: () => console.log('Documentation'),
    icon: <IconFileText size={18} />,
    group: "Hints"
  },
  {
    title: 'Create Hints',
    onTrigger: () => console.log('Documentation'),
    icon: <IconFileText size={18} />,
    group: "Hints"
  },

];

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
        <SpotlightProvider
          actions={actions}
          searchIcon={<IconSearch size={18} />}
          searchPlaceholder="Search..."
          shortcut={['mod + P', 'mod + K']}
          nothingFoundMessage="Nothing found..."
          highlightQuery
        >
          <ModalsProvider>
            <SessionProvider session={session}>
              <NotificationsProvider>
                <Component {...pageProps} />
              </NotificationsProvider>
            </SessionProvider>
          </ModalsProvider>
        </SpotlightProvider>
      </MantineProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);

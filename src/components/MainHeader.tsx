import { Container, Header, Group, Text, Tooltip, Divider, ActionIcon, Avatar, ColorScheme } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { IconBoxMultiple, IconCommand, IconLogin, IconLogout } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const MainHeader = () => {
  const { data: session } = useSession();
  const spotlight = useSpotlight();

  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const isDark = colorScheme === 'dark';

  return (
    <Header height={75} style={{}}>
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}>

        <Link href={"/"}>
          <Logo color={isDark ? "dark" : "light"} />
        </Link>

        <Group>
          {
            session &&
            (
              <>

                <Group>
                  <Text
                    style={{
                      maxWidth: "100px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    color="indigo.5"
                    fw="bold">
                    {session.user?.name}
                  </Text>

                  <Tooltip label="My Collections" position="bottom">
                    <Link href="/collections">
                      <ActionIcon color="indigo">
                        <IconBoxMultiple size={20} />
                      </ActionIcon>
                    </Link>
                  </Tooltip>

                  {/* TODO: change command icon on windows */}
                  <Tooltip label="Command Palette (⌘ + K)" position="bottom">
                    <ActionIcon color="dark" onClick={() => spotlight.openSpotlight()} style={{ cursor: "pointer" }}>
                      <IconCommand size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Group>

                <Divider orientation="vertical" />

                <Avatar
                  src={session.user?.image}
                  radius="xl"
                  size="sm"
                  color={session.user?.image ? "transparent" : "indigo"}
                  alt={`${session.user?.name} Profile Picutre`}
                />

              </>
            )
          }
          <LoginButton />
        </Group>
      </Container>
    </Header>
  )
}

const LoginButton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <Tooltip label={!sessionData ? "Log In" : "Log Out"}>
      <ActionIcon
        onClick={sessionData ? () => signOut() : () => signIn()}
        style={{ cursor: "pointer" }}
        color="dark"
      >
        {!sessionData ? <IconLogin size={20} /> : <IconLogout size={20} />}
      </ActionIcon>

    </Tooltip>
  );
};


export default MainHeader;
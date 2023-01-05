import { Container, Header, Group, Text, Tooltip, Divider, ActionIcon, Avatar, useMantineColorScheme } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { IconBoxMultiple, IconCommand, IconLogin, IconLogout } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLargeScreen } from "../hooks/useMediaQueries";
import HeaderMenu from "./HeaderMenu";
import IconSetTheme from "./IconSetTheme";
import Logo from "./Logo";

const MainHeader = () => {
  const { data: session } = useSession();
  const spotlight = useSpotlight();


  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const router = useRouter();
  const isLargeScreen = useLargeScreen();

  return (
    <Header height={75}>
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}>

        <Link href={"/"}>
          <Logo color={isDark ? "light" : "dark"} />
        </Link>

        <Group>
          <IconSetTheme />
          {
            session &&
            (
              <>
                {!isLargeScreen ? (
                  <HeaderMenu name={session.user?.name}
                    onClickCollections={() => { router.push("/collections") }}
                    onClickCommand={() => spotlight.openSpotlight()}
                    onClickLogout={session ? () => signOut() : () => signIn()}
                    targetComponent={
                      <Avatar
                        src={session.user?.image}
                        radius="xl"
                        size="sm"
                        color={session.user?.image ? "transparent" : "indigo"}
                        alt={`${session.user?.name} Profile Picutre`}
                        style={{ cursor: "pointer" }}
                      />
                    } />
                ) : (
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
                      style={{ cursor: isLargeScreen ? "initial" : "pointer" }}
                    />
                  </>
                )}
              </>
            )
          }
          {/* Only show the login button on small screens, but not log out button */}
          {(isLargeScreen || !session) && <LoginButton />}
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
import { Container, Header, Group, Text, Tooltip, Box, Divider } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { IconBoxMultiple, IconCommand, IconLogin, IconLogout } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "./Logo";

const MainHeader = () => {
  const { data: session } = useSession();
  const spotlight = useSpotlight();

  return (
    <Header height="60" >
      <Container py={20}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

        <Link href={"/"}>
          <Logo />
        </Link>

        <Group>
          {
            session &&
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
                  <Box ml="md">
                    <IconBoxMultiple size={20} />
                  </Box>
                </Link>
              </Tooltip>

              {/* TODO: change command icon on windows */}
              <Tooltip label="Command Palette (⌘ + K)" position="bottom">
                <Box onClick={() => spotlight.openSpotlight()} style={{ cursor: "pointer" }}>
                  <IconCommand size={20} />
                </Box>
              </Tooltip>
            </Group>
          }
          <Divider orientation="vertical" />
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
      <Box
        onClick={sessionData ? () => signOut() : () => signIn()}
        style={{ cursor: "pointer" }}
      >
        {!sessionData ? <IconLogin size={20} /> : <IconLogout size={20} />}
      </Box >

    </Tooltip>
  );
};


export default MainHeader;
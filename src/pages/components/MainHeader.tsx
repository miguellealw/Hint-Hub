
import { Container, Header, Button, Group, Title, Center, createStyles, Text, Tooltip, Box } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { IconBoxMultiple, IconCommand, IconLogin } from "@tabler/icons";
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
              <Text variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}> {session.user?.name} </Text>

              <Tooltip label="My Collections" position="bottom">
                <Link href="/collections">
                  <Box ml="md">
                    <IconBoxMultiple size={20} />
                  </Box>
                </Link>
              </Tooltip>

              {/* TODO: change command icon on windows */}
              <Tooltip label="Command Palette (⌘ + K)" position="bottom">
                <Box onClick={() => spotlight.openSpotlight()} style={{cursor: "pointer"}}>
                  <IconCommand size={20} />
                </Box>
              </Tooltip>
            </Group>
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
    <Button
      // className={styles.loginButton}
      leftIcon={<IconLogin size={14} />}
      color="indigo.8"
      onClick={sessionData ? () => signOut() : () => signIn()}
      variant="outline"
    >
      {sessionData ? "Sign out" : "Sign in"}
    </Button>
  );
};


export default MainHeader;
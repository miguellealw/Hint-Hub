
import { Container, Header, Button, Group, Title, Center, createStyles, Text, Tooltip } from "@mantine/core";
import { IconBoxMultiple, IconLogin } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "./Logo";

const MainHeader = () => {
  const { data: session } = useSession();

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
              <Text variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} inline > {session.user.name} </Text>

              <Tooltip label="My Collections" position="bottom">
                <Link href="/collections">
                  <IconBoxMultiple size={20} />
                </Link>
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
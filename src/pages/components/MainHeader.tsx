
import { Container, Header, Button, Group, Title, Center, createStyles, Text } from "@mantine/core";
import { IconLogin } from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "./Logo";

const MainHeader = () => {
  return (
    <Link href={"/"}>
    <Header height="60" >
      <Container py={20}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <Logo />
        <LoginButton />
      </Container>
    </Header>
    </Link>
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
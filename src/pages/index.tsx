import { type NextPage } from "next";
import Link from "next/link";
import { Button, Title, createStyles, Text } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons";
import MainLayout from "../components/layouts/MainLayout";
import { useMediaQuery } from "@mantine/hooks";

const useStyles = createStyles(() => ({
  mainContent: {
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",
    flexDirection: "column",
    // remove the 60px from the header and 40px from the header padding
    minHeight: "calc(100vh - 60px - 40px)",
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
  }
}));

const Home: NextPage = () => {
  const { classes } = useStyles();
  const largeScreen = useMediaQuery('(min-width: 900px)');

  return (
    <MainLayout containerSize="sm" className={classes.mainContent}>
      <Title order={1} weight="black" size={largeScreen ? "72px" : "48px"} align="center">
        Virtual Sticky Notes for Power Users
      </Title>

      <Text fz="md" color="dimmed" align="center" m="md">
        Hint Hub allows you to quickly create and search small notes, or “hints”, on things that may be hard to remember, like keyboard shortcuts, math formulas, or a common process to follow.
      </Text>

      <Button size="md" color="indigo.8" style={{ alignSelf: "center" }} rightIcon={<IconArrowNarrowRight size={18} />}>
        <Link href="/collections">
           Get Started
        </Link>
      </Button>
    </MainLayout>
  );
};

export default Home;

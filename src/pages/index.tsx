import { Button, createStyles, Text, Group } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import MainLayout, { MainLandingLayout } from "../components/layouts/MainLayout";
import { signIn, useSession } from "next-auth/react";
import router from "next/router";

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    // height: "100%"
  },

  inner: {
    position: 'relative',
    paddingTop: 200,
    paddingBottom: 120,
    textAlign: 'center',

    [BREAKPOINT]: {
      paddingBottom: 100,
      paddingTop: 100,
    },
  },

  title: {
    // fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontFamily: theme.fontFamily,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 48,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,
    color: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.dark[0],

    [BREAKPOINT]: {
      fontSize: 16,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,
    display: 'flex',
    justifyContent: 'center',

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },

}));

export function HeroTitle() {
  const { classes } = useStyles();
  const { data: session } = useSession()

  return (
    <MainLandingLayout containerSize={700} className={classes.wrapper} containerClass={classes.inner}>
      {/* <Container size={700} className={classes.inner}> */}
      <h1 className={classes.title}>
        Virtual{' '}
        <Text component="span" variant="gradient" gradient={{ from: 'indigo', to: 'violet' }} inherit>
          Sticky Notes
        </Text>{' '}
      </h1>

      <Text className={classes.description} color="dimmed">
        Hint Hub allows you to quickly create and search your small notes, or &ldquo;hints&rdquo;, on anything you&apos;d like. Some examples include: keyboard shortcuts, code snippets, terminal commands, or a common process to follow.
      </Text>

      <Group className={classes.controls}>
        <Button
          size="xl"
          className={classes.control}
          variant="gradient"
          gradient={{ from: 'indigo', to: 'violet' }}
          onClick={() => {
            if (!session) signIn();
            else router.push('/collections')
          }}
        >
          Get started
        </Button>

        <Button
          component="a"
          // href="https://github.com/mantinedev/mantine"
          href="https://github.com/miguellealw/Hint-Hub"
          size="xl"
          variant="default"
          className={classes.control}
          leftIcon={<IconBrandGithub size={20} />}
        >
          GitHub
        </Button>
      </Group>
      {/* </Container> */}
    </MainLandingLayout>
  );
}

export default HeroTitle;

import { Button, createStyles, Text, Group, Container, SimpleGrid, Paper, ThemeIcon, Title, Box } from "@mantine/core";
import { IconBrandGithub, IconNotes, IconKeyboard, IconPalette, IconFileExport, IconSearch, IconFolders } from "@tabler/icons";
import { MainLandingLayout } from "../components/layouts/MainLayout";
import { signIn, useSession } from "next-auth/react";
import router from "next/router";

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: '100vh',
    background: theme.colorScheme === 'dark'
      ? 'radial-gradient(circle at center, #2b5876 0%, #4e4376 100%)'
      : 'radial-gradient(circle at center, #e6dee9 0%, #bdc2e8 100%)',
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
    color: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.dark[4],

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

  featuresSection: {
    paddingTop: 80,
    paddingBottom: 80,
    position: 'relative',

    [BREAKPOINT]: {
      paddingTop: 60,
      paddingBottom: 60,
    },
  },

  featuresTitle: {
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.1,
    textAlign: 'center',
    marginBottom: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      fontSize: 32,
    },
  },

  featureCard: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    textAlign: 'center',

    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: theme.shadows.md,
    },
  },

  featureIcon: {
    marginBottom: theme.spacing.md,
    display: 'flex',
    justifyContent: 'center',
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: theme.spacing.sm,
  },

  featureDescription: {
    color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[6],
    fontSize: 14,
    lineHeight: 1.6,
  },

}));

const features = [
  {
    icon: IconNotes,
    title: 'Rich Text Formatting',
    description: 'Create beautifully formatted notes with support for headings, lists, code blocks, and more. Perfect for technical documentation and personal knowledge bases.',
  },
  {
    icon: IconFolders,
    title: 'Smart Collections',
    description: 'Organize your hints into collections for easy management. Group related notes together and access them quickly when you need them.',
  },
  {
    icon: IconKeyboard,
    title: 'Keyboard Shortcuts',
    description: 'Navigate and create hints at lightning speed with powerful keyboard shortcuts. Boost your productivity without touching the mouse.',
  },
  {
    icon: IconPalette,
    title: 'Command Palette',
    description: 'Access any feature instantly with the command palette. Search, create, and navigate your hints with a few keystrokes.',
  },
  {
    icon: IconFileExport,
    title: 'PDF Export',
    description: 'Export your hints and cheat sheets as professional PDFs. Share your knowledge or keep offline copies for reference.',
  },
  {
    icon: IconSearch,
    title: 'Quick Search',
    description: 'Find any hint instantly with powerful search capabilities. Filter by collections or content to locate exactly what you need.',
  },
];

function FeaturesSection() {
  const { classes, theme } = useStyles();

  return (
    <Box className={classes.featuresSection}>
      <Container size={1600} px="xl">
        <Title className={classes.featuresTitle} style={{ color: theme.colorScheme === 'dark' ? '#ffffff' : undefined }}>
          Features
        </Title>

        <SimpleGrid
          cols={3}
          spacing="xl"
          breakpoints={[
            { maxWidth: 980, cols: 2, spacing: 'lg' },
            { maxWidth: 600, cols: 1, spacing: 'md' },
          ]}
        >
          {features.map((feature) => (
            <Paper key={feature.title} className={classes.featureCard} radius="md">
              <div className={classes.featureIcon}>
                <ThemeIcon
                  size={70}
                  radius="md"
                  variant="gradient"
                  gradient={theme.colorScheme === 'dark'
                    ? { from: '#6161ff', to: '#8c83ff', deg: 180 }
                    : { from: '#9e7aec', to: '#1d00e8', deg: 45 }
                  }
                >
                  <feature.icon size={40} />
                </ThemeIcon>
              </div>

              <Text className={classes.featureTitle}>
                {feature.title}
              </Text>

              <Text className={classes.featureDescription}>
                {feature.description}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export function HeroTitle() {
  const { classes, theme } = useStyles();
  const { data: session } = useSession()

  return (
    <MainLandingLayout containerSize={700} className={classes.wrapper} containerClass={classes.inner}>
      {/* <Container size={700} className={classes.inner}> */}
      <h1 className={classes.title}>
        <Text
          component="span"
          variant="gradient"
          gradient={theme.colorScheme === 'dark'
            ? { from: '#6161ff', to: '#8c83ff', deg: 180 }
            : { from: '#9e7aec', to: '#1d00e8', deg: 45 }
          }
          inherit
        >
          Create{' '}
        </Text>{' '}
        Quick Cheat Sheets
      </h1>

      <Text className={classes.description} color="dimmed">
        {/* Hint Hub allows you to quickly create and search your small notes, or &ldquo;hints&rdquo;, on anything you&apos;d like. Some examples include: keyboard shortcuts, code snippets, terminal commands, or a common process to follow. */}
        {/* Hint Hub is a minimal, but intuitive, note taking application with rich text capabilities, keyboard shortcuts, and a command palette. */}
        Create and organize small notes or cheat sheets with rich text formatting, keyboard shortcuts, and the ability to export them as PDFs.
      </Text>

      <Group className={classes.controls}>
        <Button
          size="xl"
          className={classes.control}
          variant="gradient"
          gradient={theme.colorScheme === 'dark'
            ? { from: '#6161ff', to: '#8c83ff', deg: 180 }
            : { from: '#9e7aec', to: '#1d00e8', deg: 45 }
          }
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

      <FeaturesSection />
    </MainLandingLayout>
  );
}

export default HeroTitle;

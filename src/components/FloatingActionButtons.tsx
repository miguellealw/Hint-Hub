import { ActionIcon, Stack, Tooltip, useMantineColorScheme, createStyles } from '@mantine/core';
import { IconCommand, IconSun, IconMoonStars } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  floatingContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      bottom: '16px',
      right: '16px',
    },
  },
  actionButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    boxShadow: theme.shadows.lg,
    transition: 'all 0.2s ease',

    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: theme.shadows.xl,
    },

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '48px',
      height: '48px',
    },
  },
}));

type FloatingActionButtonsProps = {
  onOpenCommandPalette?: () => void;
  showCommandPalette?: boolean;
};

export default function FloatingActionButtons({
  onOpenCommandPalette,
  showCommandPalette = true
}: FloatingActionButtonsProps) {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack className={classes.floatingContainer} spacing="md">
      {showCommandPalette && (
        <Tooltip label="Command Palette (⌘ + K)" position="left">
          <ActionIcon
            className={classes.actionButton}
            variant="filled"
            color="indigo"
            onClick={() => onOpenCommandPalette?.()}
            aria-label="Open command palette"
          >
            <IconCommand size={24} />
          </ActionIcon>
        </Tooltip>
      )}

      <Tooltip label={isDark ? 'Light Mode' : 'Dark Mode'} position="left">
        <ActionIcon
          className={classes.actionButton}
          variant="filled"
          color={isDark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          aria-label="Toggle color scheme"
        >
          {isDark ? <IconSun size={24} /> : <IconMoonStars size={24} />}
        </ActionIcon>
      </Tooltip>
    </Stack>
  );
}

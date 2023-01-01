import { createStyles, Group, Title, TypographyStylesProvider } from "@mantine/core";
import HintCardMenu from "./HintCardMenu";
import type { Hint } from "@prisma/client";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { htmlToText } from 'html-to-text';

type HintCardProps = {
  hint: Hint;
  onDelete: () => void;
  onEdit: () => void;
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.gray[1],
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.gray[2]}`,
    // lineHeight: 1.5,
    position: "relative"
  },
  iconEdit: {
    cursor: "pointer",
    color: theme.colors.gray[4],
    ":hover": {
      color: theme.colors.gray[8],
    }
  },
}))

export default function HintCard({ hint, onDelete, onEdit, ...props }: HintCardProps) {
  const { classes, cx } = useStyles();
  const clipboard = useClipboard({ timeout: 500 });
  return (
    // <Card shadow="sm" padding="xl" radius="md" my="md">
    <li {...props} style={{ listStyleType: "none", position: "relative" }}>
      <Group position="apart" align="center" mb="sm">
        <Title order={6}>{hint.title}</Title>
        <HintCardMenu
          classes={classes}
          onDelete={onDelete}
          onEdit={onEdit}
          onCopy={() => { 
            const formattedText = htmlToText(hint.content);
            clipboard.copy(formattedText); 
            showNotification({
              message: "Copied content to clipboard", 
              color: "teal", 
              icon: <IconCheck />
            });
          }}
        />

      </Group>
      {/* must be 'div' instead of 'p', or it will give hydration error */}

      <TypographyStylesProvider className={classes.card}>
        <div dangerouslySetInnerHTML={{ __html: hint.content }} />
      </TypographyStylesProvider>
      {/* {
        hint.isCode ?
          <Prism language="tsx">{hint.content}</Prism> :
          <TypographyStylesProvider className={classes.card}>
            <div dangerouslySetInnerHTML={{ __html: hint.content }} />
          </TypographyStylesProvider>
      } */}
    </li>


  )

}
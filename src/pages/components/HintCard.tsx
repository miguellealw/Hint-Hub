import { createStyles, Group, Title, TypographyStylesProvider } from "@mantine/core";
import HintCardMenu from "./HintCardMenu";
import { Prism } from "@mantine/prism";

type HintCardProps = {
  hint: {
    id: number;
    title: string;
    isCode: boolean;
    content: string;
  }
}

const useStyles = createStyles(theme => ({
  card: {
    // backgroundColor: theme.colors.indigo[0],
    backgroundColor: theme.colors.gray[1],
    padding: theme.spacing.lg,
    borderRadius: theme.radius.sm,
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

export default function HintCard({ hint, ...props }: HintCardProps) {
  const { classes, cx } = useStyles();

  return (
    // <Card shadow="sm" padding="xl" radius="md" my="md">
    <li {...props} style={{ listStyleType: "none", position: "relative" }}>
      <Group position="apart" align="center" mb="sm">
        <Title order={6}>{hint.title}</Title>
        <HintCardMenu classes={classes} />
      </Group>
      {/* must be 'div' instead of 'p', or it will give hydration error */}

      {
        hint.isCode ?
          <Prism language="tsx">{hint.content}</Prism> :
          <TypographyStylesProvider className={classes.card}>
            <div dangerouslySetInnerHTML={{ __html: hint.content }} />
          </TypographyStylesProvider>
      }
    </li>

    
  )

}
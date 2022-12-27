import { Code, createStyles, Group, Title } from "@mantine/core";
import { CodeBlockControl } from "@mantine/tiptap/lib/controls";
import { NextPage } from "next";
import parse from 'html-react-parser';
import { IconEdit } from "@tabler/icons";
import HintCardMenu from "./HintCardMenu";

type HintCardProps = {
  // id: number;
  title: string;
  content: string;
}

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colors.gray[2],
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

export default function HintCard({ title, content, ...props }: HintCardProps) {
  const { classes, cx } = useStyles();

  return (
    // <Card shadow="sm" padding="xl" radius="md" my="md">
    <li {...props} style={{ listStyleType: "none", position: "relative" }}>
      <Group position="apart">
        <Title order={6} mb="sm">{title}</Title>
        <HintCardMenu classes={classes} />
      </Group>
      {/* must be 'div' instead of 'p', or it will give hydration error */}
      <div className={classes.card}>
        {parse(content)}
      </div>
    </li>
  )

}
import { useState } from "react";
import { Button, createStyles, Group, SimpleGrid, Title, Tooltip, Text } from "@mantine/core"
import { IconBoxMultiple, IconDotsVertical, IconFilePlus } from "@tabler/icons";
import { type NextPage } from "next";
import MainLayout from "./components/layouts/MainLayout";
import { InputWithButton as SearchBar } from "./components/InputWithButton";
import CreateHintModal from "./components/CreateHintModal";

const useStyles = createStyles((theme) => ({
  collectionCard: {
    display: "flex",
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",

    listStyleType: "none",
    position: "relative",
    backgroundColor: theme.colors.indigo[0],
    padding: theme.spacing.xl,
    borderRadius: theme.radius.sm,
    cursor: "pointer",

    "&:hover": {
      backgroundColor: theme.colors.indigo[1],
    }
  },
}));


const collections = [
  { id: 1, name: "Terminal" },
  { id: 2, name: "Git" },
  { id: 3, name: "React" }, 
  { id: 4, name: "JavaScript" },
];

const Collections: NextPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { classes } = useStyles();

  return (
    <MainLayout containerSize="md">
      <CreateHintModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} />

      <Group position="apart" align="center" my="xl">
        <Title align="center">Your Collections</Title>

        {/* TODO: show cmd or ctrl depending on OS */}
        {/* <Tooltip label="Create Hint (⌘ + K)"> */}
        <Group>
          <Tooltip label="Create Hint ('C')">
            <Button variant="subtle" color="indigo.5" leftIcon={<IconFilePlus size={18} />} onClick={() => setModalOpen(true)}>
              Create Hint
            </Button>
          </Tooltip>
          <Tooltip label="Create Collection ('O')">
            <Button color="indigo.8" leftIcon={<IconBoxMultiple size={18} />} onClick={() => setModalOpen(true)}>
              Create Collection
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <SearchBar mb="xl" />


      <ul style={{ paddingLeft: 0 }}>
        <SimpleGrid cols={3}>
          {collections.map(collection => (
            <li key={collection.id} className={classes.collectionCard}>
              <Text fz="lg" fw={600} c="indigo.9">{collection.name}</Text>
              <Text fz="xs" c="indigo.4">5 hints</Text>
            </li>
          ))}
        </SimpleGrid>
      </ul>
    </MainLayout>
  )
}


export default Collections;
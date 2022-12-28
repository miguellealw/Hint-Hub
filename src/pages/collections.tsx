import { useState } from "react";
import { Button, createStyles, Group, SimpleGrid, Title, Tooltip, Text, Loader, Box } from "@mantine/core"
import { IconBoxMultiple, IconDotsVertical, IconFilePlus, IconFolderPlus } from "@tabler/icons";
import { type NextPage } from "next";
import MainLayout from "./components/layouts/MainLayout";
import { InputWithButton as SearchBar } from "./components/InputWithButton";
import CreateHintModal from "./components/CreateHintModal";
import CreateCollectionModal from "./components/CreateCollectionModal";
import { trpc } from "../utils/trpc";
import { type Collection } from "@prisma/client";
import Link from "next/link";

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


const Collections: NextPage = () => {
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  const [isHintModalOpen, setHintModalOpen] = useState(false);
  const { classes } = useStyles();
  const { data: collections, isLoading } = trpc.collection.getAll.useQuery();

  return (
    <MainLayout containerSize="md">
      <CreateCollectionModal isModalOpen={isCollectionModalOpen} setModalOpen={setCollectionModalOpen} />
      <CreateHintModal isModalOpen={isHintModalOpen} setModalOpen={setHintModalOpen} />

      <Group position="apart" align="center" my="xl">
        <Title align="center">My Collections</Title>

        {/* TODO: show cmd or ctrl depending on OS */}
        {/* <Tooltip label="Create Hint (⌘ + K)"> */}
        <Group>
          <Tooltip label="Create Hint ('C')">
            <Button variant="subtle" color="indigo.5" leftIcon={<IconFilePlus size={18} />} onClick={() => setHintModalOpen(true)}>
              Create Hint
            </Button>
          </Tooltip>
          <Tooltip label="Create Collection ('O')">
            <Button color="indigo.8" leftIcon={<IconFolderPlus size={18} />} onClick={() => setCollectionModalOpen(true)}>
              Create Collection
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <SearchBar mb="xl" />


      {isLoading ? (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Loader color="indigo" />
        </Box>
      ) : <CollectionsList collections={collections} classes={classes} />}

    </MainLayout>
  )
}

// TODO: change any to correct type
const CollectionsList = ({ collections, classes }: { collections: Collection[] | undefined, classes: any }) => {

  return (
    <ul style={{ paddingLeft: 0 }}>
      <SimpleGrid cols={3}>
        {collections?.length === 0 ?
          <Text align="center" c="indigo.5">You don&apos;t have any collections yet.</Text> :
          collections?.map(collection => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <li className={classes.collectionCard}>
                <Text fz="lg" fw={600} c="indigo.9">{collection.name}</Text>
                <Text fz="xs" c="indigo.4">5 hints</Text>
              </li>
            </Link>
          ))
        }
      </SimpleGrid>
    </ul>
  )
}


export default Collections;
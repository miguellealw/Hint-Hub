import { useState } from "react";
import { Button, createStyles, Group, SimpleGrid, Title, Tooltip, Text, Loader, Box, TextInput } from "@mantine/core"
import { IconBoxMultiple, IconDotsVertical, IconFilePlus, IconFolderPlus } from "@tabler/icons";
import { type NextPage } from "next";
import MainLayout from "./components/layouts/MainLayout";
import { InputWithButton as SearchBar } from "./components/InputWithButton";
import CreateHintModal from "./components/CreateHintModal";
import CreateCollectionModal from "./components/Modals/CollectionModal";
import { trpc } from "../utils/trpc";
import { type Collection } from "@prisma/client";
import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { useHotkeys } from "@mantine/hooks";

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
  const [collectionName, setCollectionName] = useState("");

  const { classes } = useStyles();
  useHotkeys([
    ["c", () => setHintModalOpen(true)],
    ["o", () => setCollectionModalOpen(true)]
    // FIXME: SearchBarRef is null
    // ["/", () => SearchBarRef.current?.focus()]
  ])

  // trpc
  const { data: collections, isLoading } = trpc.collection.getAll.useQuery();
  const mutation = trpc.collection.create.useMutation();
  const utils = trpc.useContext();

  return (
    <MainLayout containerSize="md">
      <CreateCollectionModal
        isModalOpen={isCollectionModalOpen}
        setModalOpen={setCollectionModalOpen}
        name={collectionName}
        setName={setCollectionName}
        onConfirm={(e) => {
          e.preventDefault();
          // Check if field is empty
          if (typeof collectionName === "string" && collectionName.trim() === "") {
            showNotification({
              message: "Name field can not be empty",
              color: "yellow"
            })
            return;
          }

          // TODO: optimistic update
          mutation.mutate({ name: collectionName }, {
            onSuccess: () => {
              setCollectionModalOpen(false);
              setCollectionName("");
              showNotification({
                title: "Collection created",
                message: "Collection created successfully",
              })

              utils.collection.getAll.invalidate();
            },
            onError: (error) => {
              showNotification({
                title: "Error creating collection",
                message: error.message,
                color: "red"
              })
            }
          })
        }}
        onCancel={(e) => { setCollectionModalOpen(false) }}
      />
      <CreateHintModal isModalOpen={isHintModalOpen} setModalOpen={setHintModalOpen} />

      <Group position="apart" align="center" my="xl">
        <Title align="center">My Collections</Title>

        {/* TODO: show cmd or ctrl depending on OS */}
        <Group>
          <Tooltip label="Create Hint ('C')">
            <Button variant="subtle" color="indigo.5" leftIcon={<IconFilePlus size={18} />} onClick={() => setHintModalOpen(true)}>
              Create Hint
            </Button>
          </Tooltip>
          <Tooltip label="Create Collection ('O')">

            <Button 
              color="indigo.8" 
              leftIcon={<IconFolderPlus size={18} />} 
              onClick={() => {
                setCollectionModalOpen(true);
              }}
            >
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
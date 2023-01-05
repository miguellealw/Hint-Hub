import { useRef, useState } from "react";
import { Button, createStyles, Group, SimpleGrid, Title, Tooltip, Text, Loader, Box, LoadingOverlay, useMantineColorScheme } from "@mantine/core"
import { IconFolderPlus } from "@tabler/icons";
import { type NextPage } from "next";
import MainLayout from "../components/layouts/MainLayout";
import SearchBar from "../components/InputWithButton";
// import CreateHintModal from "./components/CreateHintModal";
import CreateCollectionModal from "../components/Modals/CollectionModal";
import { trpc } from "../utils/trpc";
import { type Collection } from "@prisma/client";
import Link from "next/link";
import { useHotkeys } from "@mantine/hooks";
import useCollectionForm from "../hooks/useCollectionForm";
import useUnauthed from "../hooks/useUnauthed";
import { useCreateCollection } from "../hooks/collectionHooks";
import { useLargeScreen } from "../hooks/useMediaQueries";

const useStyles = createStyles((theme) => ({
  heading: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[9],
  },
  collectionCard: {
    display: "flex",
    // alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    listStyleType: "none",
    position: "relative",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.indigo[0],
    color: theme.colorScheme === "dark" ? theme.colors.gray[1] : theme.colors.indigo[9],
    padding: theme.spacing.xl,
    borderRadius: theme.radius.sm,
    cursor: "pointer",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.indigo[1],
    }
  },

  hintCount: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.indigo[4],
  }
}));


const Collections: NextPage = () => {
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  const { status } = useUnauthed();
  const [searchValue, setSearchValue] = useState("");
  const searchBarRef = useRef<HTMLInputElement>(null);

  const collectionForm = useCollectionForm("");

  const { classes } = useStyles();
  useHotkeys([
    // ["c", () => setHintModalOpen(true)],
    ["o", () => setCollectionModalOpen(true)],
    ["/", () => searchBarRef.current?.focus()]
  ])


  // trpc
  const {
    data: collections,
    isLoading: isLoadingCollections,
    isSuccess: isSuccessCollections
  } = trpc.collection.getAll.useQuery({
    searchValue
  }, {
    queryKey: ["collection.getAll", { searchValue }],
  });
  const mutation = useCreateCollection({
    onMutateCb: () => { setCollectionModalOpen(false) },
    onSuccessCb: () => {
      setCollectionModalOpen(false)
      collectionForm.reset();
    },
    onErrorCb: (newCollection) => {
      collectionForm.setFieldValue("name", newCollection.name)
      setCollectionModalOpen(true)
    }
  });

  if (status === "loading") {
    return (
      <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader color="indigo" />
      </Box>
    )
  }

  // if (status === "authenticated") {
  return (
    <MainLayout containerSize="md">
      <CreateCollectionModal
        isModalOpen={isCollectionModalOpen}
        form={collectionForm}
        isCollectionsLoading={mutation.isLoading}
        onClose={() => {
          setCollectionModalOpen(false);
          collectionForm.reset();
        }}
        onConfirm={collectionForm.onSubmit((values) => {
          mutation.mutate({ name: values.name })
          // NOTE: don't call collectionForm.reset() since it will be reset on errors
        }, collectionForm.handleEditCollectionError)}
        onCancel={() => {
          setCollectionModalOpen(false)
          collectionForm.reset();
        }}
      />
      {/* <CreateHintModal 
          isModalOpen={isHintModalOpen} setModalOpen={setHintModalOpen} 
          onConfirm = {(e) => {}}
          onCancel = {() => { setHintModalOpen(false); }}
        /> */}

      <Group position="apart" align="center" my="xl">
        <Title align="center" className={classes.heading}>My Collections</Title>

        {/* TODO: show cmd or ctrl depending on OS */}
        <Group>
          {/* <Tooltip label="Create Hint ('C')">
              <Button variant="subtle" color="indigo.5" leftIcon={<IconFilePlus size={18} />} onClick={() => setHintModalOpen(true)}>
                Create Hint
              </Button>
            </Tooltip> */}
          <Tooltip label="Create Collection ('O')">

            <Button
              color="indigo.8"
              leftIcon={<IconFolderPlus size={18} />}
              onClick={() => { setCollectionModalOpen(true); }}
            >
              Create Collection
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <SearchBar mb="xl"
        ref={searchBarRef}
        value={searchValue}
        onChange={(e) => { setSearchValue(e.currentTarget.value) }}
      />


      {isLoadingCollections && !isSuccessCollections ? (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Loader color="indigo" />
        </Box>
      ) : <CollectionsList collections={collections} classes={classes} />}

    </MainLayout>
  )
  // }

}

type CollectionWithCount = Collection & { _count: { hints: number } };

type CollectionsListProps = {
  collections: CollectionWithCount[] | undefined,
  classes: {
    heading: string;
    collectionCard: string;
    hintCount: string;
  }
};

const CollectionsList = ({ collections, classes }: CollectionsListProps) => {
  const isLargeScreen = useLargeScreen();

  return (
    <ul style={{ paddingLeft: 0, paddingBottom: "50px", margin: 0 }}>
      <SimpleGrid cols={isLargeScreen ? 3 : 1}>
        {collections?.length === 0 ?
          <Text align="center" c="gray.5">You don&apos;t have any collections yet.</Text> :
          collections?.map(collection => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <li className={classes.collectionCard}>
                <Text fz="lg" fw={600} style={{
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>{collection.name}</Text>
                <Text fz="xs" className={classes.hintCount}>{collection._count.hints} hints</Text>
              </li>
            </Link>
          ))
        }
      </SimpleGrid>
    </ul>
  )
}


export default Collections;
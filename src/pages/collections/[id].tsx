import { Box, Button, Group, Loader, SimpleGrid, Title, Tooltip, Text } from "@mantine/core"
import { IconEdit, IconFilePlus, IconTrash } from "@tabler/icons";
import { type NextPage } from "next";
import { InputWithButton as SearchBar } from "../components/InputWithButton";
import MainLayout from "../components/layouts/MainLayout";
import { useState } from 'react';
import CreateHintModal from "../components/CreateHintModal";
import { useHotkeys } from "@mantine/hooks";
import HintCard from "../components/HintCard";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { openDeleteConfirmModal } from "../components/Modals/openConfirmModals";
import { showNotification } from "@mantine/notifications";
import CreateCollectionModal from "../components/Modals/CollectionModal";
import isStringEmpty from "../../utils/isStringEmpty";
import { useForm } from "@mantine/form";

function handleCreateHintError() {
  showNotification({
    title: "Error",
    message: "All fields must be filled",
    color: "red"
  })
}

const SingleCollection: NextPage = () => {
  const [isHintModalOpen, setHintModalOpen] = useState(false);
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  // const SearchBarRef = useRef<HTMLInputElement>(null);

  // New hint state
  const [hintTitle, setHintTitle] = useState("");
  const [hintCollection, setHintCollection] = useState("");
  const [hintContent, setHintContent] = useState("");

  // form
  const form = useForm({
    initialValues: {
      title: "",
      // collection: "",
      content: ""
    },
    validate: {
      title: (title) => isStringEmpty(title) ?? "Title cannot be empty",
      content: (content) => isStringEmpty(content) ?? "Content cannot be empty"
    }
  })

  // router
  const router = useRouter();
  const currentCollectionId = router.query.id as string;

  // trpc
  // const createCollectionMutation = trpc.collection.create.useMutation();
  const updateCollectionMutation = trpc.collection.update.useMutation();
  const deleteCollectionMutation = trpc.collection.delete.useMutation();
  const {
    data: currentCollection,
    isLoading: isCurrentCollectionLoading,
    isError: isCurrentCollectionError,
  } = trpc.collection.getById.useQuery(
    { id: currentCollectionId },
    {
      onSuccess: (data) => {
        // setCurrentCollection(data);
        setHintCollection(data.name);
      },
    }
  );

  const createHintMutation = trpc.hint.create.useMutation();
  const updateHintMutation = trpc.hint.update.useMutation();
  const deleteHintMutation = trpc.hint.delete.useMutation();
  const {
    data: hints,
    // isLoading: isHintsLoading,
    isError: isHintsError,
  } = trpc.hint.getAllByCollectionId.useQuery(
    { collectionId: currentCollectionId },
    // {
    //   onSuccess: (data) => {
    //     // setHints(data);
    //   },
    // }
  );

  const utils = trpc.useContext();

  useHotkeys([
    ["c", () => setHintModalOpen(true)],
    // FIXME: SearchBarRef is null
    // ["/", () => SearchBarRef.current?.focus()]
  ])

  if (isHintsError || isCurrentCollectionError) {
    <div>Error loading hints or collection</div>
  }


  return (
    <MainLayout containerSize="md">
      {isCurrentCollectionLoading ? (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt="xl">
          <Loader color="indigo" />
        </Box>
      ) : (
        <>
          <CreateCollectionModal
            isModalOpen={isCollectionModalOpen}
            setModalOpen={setCollectionModalOpen}
            name={hintCollection}
            setName={setHintCollection}
            onConfirm={(e) => {
              // TODO: useForm for collection
              e.preventDefault();
              // Check if field is empty
              if (isStringEmpty(hintCollection)) {
                showNotification({
                  message: "Name field can not be empty",
                  color: "yellow"
                })
                return;
              }

              // TODO: optimistic update
              updateCollectionMutation.mutate({ id: currentCollectionId, name: hintCollection }, {
                onSuccess: () => {
                  setCollectionModalOpen(false);
                  setHintCollection("");
                  showNotification({
                    title: "Collection updated",
                    message: "Collection updated successfully",
                  })

                  utils.collection.getById.invalidate({ id: currentCollectionId });
                },
                onError: (error) => {
                  showNotification({
                    title: "Error updating collection",
                    message: error.message,
                    color: "red"
                  })
                }
              })
            }}
            onCancel={() => { setCollectionModalOpen(false) }}
          />
          <CreateHintModal
            isModalOpen={isHintModalOpen}
            setModalOpen={setHintModalOpen}
            handleTitleChange={(e) => setHintTitle(e.currentTarget.value)}
            hintTitle={hintTitle}

            handleContentChange={(editorHtml) => setHintContent(editorHtml)}
            hintContent={hintContent}

            // handleCollectionChange={(name, id) => setHintCollection({name, id})}
            // hintCollection={hintCollection}

            form={form}
            onConfirm={form.onSubmit((values) => {
              // TODO: optimistic update
              createHintMutation.mutate({
                title: values.title,
                collectionId: currentCollection.id,
                content: values.content
              }, {
                onSuccess: () => {
                  setHintModalOpen(false);
                  form.reset();
                  showNotification({
                    title: "Hint created",
                    message: "Hint created successfully",
                  })

                  utils.hint.getAllByCollectionId.invalidate({ collectionId: currentCollectionId });
                },
                onError: (error) => {
                  showNotification({
                    title: "Error creating hint",
                    message: error.message,
                    color: "red"
                  })
                }
              })
            }, handleCreateHintError)}
            onCancel={() => { setHintModalOpen(false); }}
          />

          <Group position="apart" align="center" my="xl">
            <Group align="center">
              <Title align="center">{currentCollection?.name}</Title>

              <Tooltip label="Edit Collection">
                <span onClick={() => { setCollectionModalOpen(true) }}>
                  <IconEdit size={20} style={{ cursor: "pointer" }} />
                </span>
              </Tooltip>

              <Tooltip label="Delete Collection">
                <span onClick={() => {
                  openDeleteConfirmModal({
                    onConfirm: () => {
                      deleteCollectionMutation.mutate(
                        { id: currentCollectionId },
                        {
                          // on mutate success
                          onSuccess: () => {
                            router.push(`/collections`)
                            showNotification({
                              message: "Collection Deleted",
                              color: "red"
                            });
                          },
                          onError: (error) => {
                            showNotification({
                              message: error.message,
                              color: "red"
                            });
                          },
                          onSettled: () => {
                            // refetch collection data
                            utils.collection.getAll.invalidate();
                          }
                        }
                      );
                    }
                  })
                }}>
                  <IconTrash size={20} style={{ cursor: "pointer" }} />
                </span>
              </Tooltip>
            </Group>

            <Tooltip label="Create Hint ('C')">
              <Button color="indigo.8" leftIcon={<IconFilePlus size={18} />} onClick={() => setHintModalOpen(true)}>
                Create Hint
              </Button>
            </Tooltip>
          </Group>

          {/* <SearchBar ref={SearchBarRef} mb="xl" /> */}
          <SearchBar mb="xl" />

          {hints?.length === 0 ?
            (<Text fz="sm" c="gray.6">No hints in this collection.</Text>) :
            (
              <ul style={{ paddingLeft: 0 }}>
                <SimpleGrid cols={2} spacing="xl">
                  {
                    hints?.map(hint => (
                      <HintCard
                        key={hint.id}
                        hint={hint}
                        onDelete={() => {
                          deleteHintMutation.mutate({ id: hint.id }, {
                            onSuccess: () => {
                              showNotification({ message: "Hint deleted", color: "red" })
                              utils.hint.getAllByCollectionId.invalidate({ collectionId: currentCollectionId });
                            },
                            onError: (error) => {
                              showNotification({ message: error.message, color: "red" })
                            }
                          })
                        }}
                      />
                    ))
                  }
                </SimpleGrid>
              </ul>
            )}

        </>
      )}
    </MainLayout>
  )

}


export default SingleCollection;
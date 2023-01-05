import { Box, Button, Group, Loader, SimpleGrid, Title, Tooltip, Text, ActionIcon } from "@mantine/core"
import { IconEdit, IconFilePlus, IconTrash } from "@tabler/icons";
import { type NextPage } from "next";
import SearchBar from "../../components/InputWithButton";
import MainLayout from "../../components/layouts/MainLayout";
import { useRef, useState } from 'react';
import CreateHintModal from "../../components/CreateHintModal";
import { useHotkeys } from "@mantine/hooks";
import HintCard from "../../components/HintCard";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { openDeleteConfirmModal } from "../../utils/openConfirmModals";
import { showNotification } from "@mantine/notifications";
import CreateCollectionModal from "../../components/Modals/CollectionModal";
import { useDeleteCollection, useUpdateCollection } from "../../hooks/collectionHooks";
import useHintForm from "../../hooks/useHintForm";
import useCollectionForm from "../../hooks/useCollectionForm";
import type { Hint } from "@prisma/client";
import useUnauthed from "../../hooks/useUnauthed";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useLargeScreen } from "../../hooks/useMediaQueries";


const SingleCollection: NextPage = () => {
  const [isHintModalOpen, setHintModalOpen] = useState(false);
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [currentCollectionName, setCurrentCollectionName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const isLargeScreen = useLargeScreen();

  const { status } = useUnauthed();

  // New hint state
  const [hintContent, setHintContent] = useState("");
  const [selectedHint, setSelectedHint] = useState<Hint | undefined>(undefined);

  // forms
  const hintForm = useHintForm({ title: "", content: "" });
  const collectionForm = useCollectionForm(currentCollectionName);

  // router
  const router = useRouter();
  const currentCollectionId = router.query.id as string;

  // trpc
  const updateCollectionMutation = useUpdateCollection();
  const deleteCollectionMutation = useDeleteCollection();
  /*
  TODO: figure out how to export this to its own hook file
  the issue is with the on success and selecct in useQuery
  I want to get back the name, but I also have to store it in local state
  because it will be used in the form for editing
  */
  const {
    // data: currentCollection,
    isLoading: isCurrentCollectionLoading,
    isError: isCurrentCollectionError,
    isSuccess: isCurrentCollectionSuccess
  } = trpc.collection.getById.useQuery({ id: currentCollectionId }, {
    onSuccess: (data) => {
      setCurrentCollectionName(data.name);
      collectionForm.setValues({ name: data.name })
    }
  });

  const createHintMutation = trpc.hint.create.useMutation();
  const updateHintMutation = trpc.hint.update.useMutation();
  const deleteHintMutation = trpc.hint.delete.useMutation();
  const {
    data: hints,
    isError: isHintsError,
    isLoading: isHintsLoading,
  } = trpc.hint.getAllByCollectionId.useQuery({
    collectionId: currentCollectionId,
    searchValue
  }, {
    queryKey: ["hint.getAllByCollectionId", { collectionId: currentCollectionId, searchValue }],
  });


  const utils = trpc.useContext();

  useHotkeys([
    ["c", () => setHintModalOpen(true)],
    ["o", () => setCollectionModalOpen(true)],
    ["/", () => searchBarRef.current?.focus()]
  ])

  if (status === "loading") {
    return (
      <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader color="indigo" />
      </Box>
    )
  }

  if (isHintsError || isCurrentCollectionError) {
    return <div>Error loading hints or collection</div>
  }


  return (
    <MainLayout containerSize="md">
      {!isCurrentCollectionSuccess && isCurrentCollectionLoading ? (
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }} mt="xl">
          <Loader color="indigo" />
        </Box>
      ) : (
        <>
          <LoadingOverlay visible={deleteCollectionMutation.isLoading || deleteHintMutation.isLoading} />
          <CreateCollectionModal
            isModalOpen={isCollectionModalOpen}
            onClose={() => { setCollectionModalOpen(false) }}
            isEditing
            isCollectionsLoading={updateCollectionMutation.isLoading}
            form={collectionForm}
            onConfirm={collectionForm.onSubmit((values) => {
              updateCollectionMutation.mutate({ id: currentCollectionId, name: values.name }, {
                onSuccess: () => {
                  setCollectionModalOpen(false);
                  showNotification({
                    title: "Collection updated",
                    message: "Collection updated successfully",
                  })

                },
                onError: (error) => {
                  showNotification({
                    title: "Error updating collection",
                    message: error.message,
                    color: "red"
                  })
                },
                onSettled: () => {
                  utils.collection.getById.invalidate({ id: currentCollectionId });
                }
              })
            }, collectionForm.handleEditCollectionError)}
            onCancel={() => { setCollectionModalOpen(false) }}
          />
          <CreateHintModal
            isModalOpen={isHintModalOpen}
            setModalOpen={setHintModalOpen}
            isEditing={typeof selectedHint !== "undefined"}
            isHintLoading={createHintMutation.isLoading || updateHintMutation.isLoading}

            handleContentChange={(editorHtml) => setHintContent(editorHtml)}
            hintContent={hintContent}

            // if hint is being edited, set the form values to the selected hint
            initialValues={
              typeof selectedHint !== "undefined" ?
                { title: selectedHint.title, content: selectedHint.content } :
                { title: "", content: "" }
            }



            form={hintForm}
            onConfirm={hintForm.onSubmit((values) => {
              // TODO: optimistic update
              if (typeof selectedHint !== "undefined") {
                updateHintMutation.mutate({
                  id: selectedHint.id,
                  title: values.title,
                  content: values.content,
                }, {
                  onSuccess: () => {
                    setHintModalOpen(false);
                    setSelectedHint(undefined); // reset selected hint
                    hintForm.reset();
                    showNotification({ title: "Hint updated", message: "Hint updated successfully" })
                  },
                  onError: (error) => {
                    showNotification({ title: "Error updating hint", message: error.message, color: "red" })
                  },
                  onSettled: () => {
                    utils.hint.getAllByCollectionId.invalidate({ collectionId: currentCollectionId, searchValue: "" });
                  }
                })
              } else {
                createHintMutation.mutate({
                  title: values.title,
                  collectionId: currentCollectionId,
                  content: values.content
                }, {
                  onSuccess: () => {
                    setHintModalOpen(false);
                    hintForm.reset();
                    showNotification({ title: "Hint created", message: "Hint created successfully" })
                  },
                  onError: (error) => {
                    showNotification({ title: "Error creating hint", message: error.message, color: "red" })
                  },
                  onSettled: () => {
                    utils.hint.getAllByCollectionId.invalidate({ collectionId: currentCollectionId, searchValue: "" });
                  }
                })
              }

            }, hintForm.handleCreateHintError)}
            onCancel={() => { setHintModalOpen(false) }}
            onClose={() => {
              setHintModalOpen(false);
              hintForm.reset();
              setSelectedHint(undefined); // reset selected hint
            }}
          />

          <Group position="apart" align="center" my="xl" style={{ width: "100%" }}>
            <Group position="left" align="center" style={{ width: isLargeScreen ? "80%" : "100%" }}>
              <Title align="center" style={{
                // maxWidth: "auto",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>{currentCollectionName}</Title>

              {/* Icon group */}
              <Group style={{
                maxWidth: "auto",
              }}>
                <Tooltip label="Edit Collection ('O')">
                  <ActionIcon onClick={() => { setCollectionModalOpen(true) }} color="indigo">
                    <IconEdit size={20} style={{ cursor: "pointer" }} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete Collection">
                  <ActionIcon
                    color="red"
                    onClick={() => {
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
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            {/* <Box style={{ width: "10%" }}> */}
            <Tooltip label="Create Hint ('C')">
              <Button
                color="indigo.8"
                leftIcon={<IconFilePlus size={18} />}
                onClick={() => setHintModalOpen(true)}
              >
                Create Hint
              </Button>
            </Tooltip>
            {/* </Box> */}
            {/* </Group> */}
          </Group>

          <SearchBar
            mb="xl"
            value={searchValue}
            ref={searchBarRef}
            onChange={(e) => { setSearchValue(e.currentTarget.value) }}
          />

          {isHintsLoading ? (<Text size="sm" color="gray.7">Loading hints...</Text>) : (
            <>
              {
                hints?.length === 0 ?
                  (<Text fz="sm" c="gray.6">No hints found.</Text>) :
                  (
                    <ul style={{ paddingLeft: 0 }}>
                      <SimpleGrid cols={1} spacing="xl">
                        {
                          hints?.map(hint => (
                            <HintCard
                              key={hint.id}
                              hint={hint}
                              onEdit={() => {
                                setHintModalOpen(true)
                                setSelectedHint(hint);
                              }}
                              onDelete={() => {
                                deleteHintMutation.mutate({ id: hint.id }, {
                                  onSuccess: () => {
                                    showNotification({ message: "Hint deleted", color: "red" })
                                    utils.hint.getAllByCollectionId.invalidate({ collectionId: currentCollectionId, searchValue: "" });
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
                  )
              }
            </>
          )}

        </>
      )
      }
    </MainLayout >
  )

}

export default SingleCollection;
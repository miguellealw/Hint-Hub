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
import { useDeleteCollection, useUpdateCollection } from "../../hooks/collection";
import useHintForm from "../../hooks/useHintForm";
import useCollectionForm from "../../hooks/useCollectionForm";
import { Hint } from "@prisma/client";


const SingleCollection: NextPage = () => {
  const [isHintModalOpen, setHintModalOpen] = useState(false);
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  // const SearchBarRef = useRef<HTMLInputElement>(null);
  const [currentCollectionName, setCurrentCollectionName] = useState("");

  // New hint state
  const [hintContent, setHintContent] = useState("");

  // forms
  const hintForm = useHintForm();
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
    data: currentCollection,
    isLoading: isCurrentCollectionLoading,
    isError: isCurrentCollectionError,
    isSuccess: isCurrentCollectionSuccess
  } = trpc.collection.getById.useQuery({ id: currentCollectionId }, {
    onSuccess: (data) => {
      collectionForm.setValues({ name: data.name })
    }
  });

  const createHintMutation = trpc.hint.create.useMutation();
  // const updateHintMutation = trpc.hint.update.useMutation();
  const deleteHintMutation = trpc.hint.delete.useMutation();
  const {
    data: hints,
    isError: isHintsError,
  } = trpc.hint.getAllByCollectionId.useQuery({ collectionId: currentCollectionId });

  const utils = trpc.useContext();

  useHotkeys([
    ["c", () => setHintModalOpen(true)],
    ["o", () => setCollectionModalOpen(true)],
    // FIXME: SearchBarRef is null
    // ["/", () => SearchBarRef.current?.focus()]
  ])



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
          <CreateCollectionModal
            isModalOpen={isCollectionModalOpen}
            setModalOpen={setCollectionModalOpen}
            isEditing
            form={collectionForm}
            onConfirm={collectionForm.onSubmit((values) => {
              // TODO: optimistic update
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

            handleContentChange={(editorHtml) => setHintContent(editorHtml)}
            hintContent={hintContent}

            form={hintForm}
            onConfirm={hintForm.onSubmit((values) => {
              // TODO: optimistic update
              createHintMutation.mutate({
                title: values.title,
                collectionId: currentCollection.id,
                content: values.content
              }, {
                onSuccess: () => {
                  setHintModalOpen(false);
                  // TODO: only run form reset when creating hint, not updating it
                  // hintForm.reset();
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
            }, hintForm.handleCreateHintError)}
            onCancel={() => {
              hintForm.reset();
              setHintModalOpen(false);
            }}
          />

          <Group position="apart" align="center" my="xl">
            <Group align="center">
              <Title align="center">{currentCollection.name}</Title>

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
                  <HintsList hints={hints} currentCollectionId={currentCollectionId} mutation={deleteHintMutation} utils={utils} />
                </SimpleGrid>
              </ul>
            )}

        </>
      )}
    </MainLayout>
  )

}



const HintsList = ({
  hints,
  currentCollectionId,
  mutation,
  utils
}: {
  hints: Hint[] | undefined
  currentCollectionId: string
  mutation: unknown
  utils: unknown
}) => {
  return (
    <>
      {
        hints.map(hint => (
          <HintCard
            key={hint.id}
            hint={hint}
            onDelete={() => {
              mutation.mutate({ id: hint.id }, {
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

      }</>
  )
}


export default SingleCollection;
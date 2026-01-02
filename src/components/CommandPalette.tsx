import "react-cmdk/dist/cmdk.css";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import { useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import { IconBoxMultiple, IconFilePlus, IconFileText, IconFolderPlus, IconListSearch, IconReportSearch } from "@tabler/icons";
import { router } from "../server/trpc/trpc";
import { useRouter } from "next/router";
import CreateCollectionModal from "./Modals/CollectionModal";
import useCollectionForm from "../hooks/useCollectionForm";
import { useCreateCollection } from "../hooks/collectionHooks";
import CreateHintModal from "./CreateHintModal";
import useHintForm from "../hooks/useHintForm";
import { trpc } from "../utils/trpc";
import { showNotification } from "@mantine/notifications";

type CommandProps = {
  isOpen: boolean,
  setOpen: (isOpen: boolean) => void
}

const Command = ({ isOpen, setOpen }: CommandProps) => {
  const [page, setPage] = useState<"root" | "collections" | "hints">("root");
  const [search, setSearch] = useState("");
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  const [isHintModalOpen, setHintModalOpen] = useState(false);
  const [hintContent, setHintContent] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const router = useRouter();

  const collectionForm = useCollectionForm("");
  const hintForm = useHintForm({ title: "", content: "" });

  const utils = trpc.useContext();
  const createHintMutation = trpc.hint.create.useMutation();

  // Fetch collections for search
  const { data: collections } = trpc.collection.getAll.useQuery({ searchValue: search });

  // Fetch all hints for search (only when on hints page)
  const { data: allHints } = trpc.hint.getAll.useQuery(
    { searchValue: search },
    { enabled: page === "hints" }
  ) as { data: Array<{ id: string; title: string; Collection: { id: string; name: string } }> | undefined };

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

  useHotkeys([['mod+K', () => setOpen(true)]]);

  const filteredItems = filterItems(
    [
      // General
      {
        heading: "General",
        id: "general",
        items: [
          {
            id: "go-to-collections",
            children: "Go to Collections",
            icon: () => <IconBoxMultiple color="gray" />,
            onClick: () => {
              router.push("/collections");
            },
            // href: "/collections",
          },
        ],
      },

      // Collections
      {
        heading: "Collections",
        id: "collections-section",
        items: [
          {
            id: "create-collection",
            children: "Create Collection",
            icon: () => <IconFolderPlus color="gray" />,
            onClick: () => {
              setOpen(false);
              // Delay opening the modal to allow command palette to fully close
              setTimeout(() => {
                setCollectionModalOpen(true);
              }, 100);
            },
          },
          {
            id: "search-collections",
            children: "Search Collections",
            icon: () => <IconReportSearch color="gray" />,
            closeOnSelect: false,
            onClick: () => {
              setPage("collections");
            },
          },
        ],
      },

      // Hints
      {
        heading: "Hints",
        id: "hints-section",
        items: [
          {
            id: "create-hint",
            children: "Create Hint",
            icon: () => <IconListSearch color="gray" />,
            onClick: () => {
              setOpen(false);
              // Delay opening the modal to allow command palette to fully close
              setTimeout(() => {
                setHintModalOpen(true);
              }, 100);
            },
          },
          {
            id: "search-hints",
            children: "Search Hints",
            icon: () => <IconFilePlus color="gray" />,
            closeOnSelect: false,
            onClick: () => {
              setPage("hints");
            },
          },
        ],
      },

      // Other
      {
        heading: "Other",
        id: "other-section",
        items: [
          {
            id: "log-out",
            children: "Log out",
            // icon: "LogoutIcon",
            onClick: () => {
              alert("Logging out...");
            },
          },
        ]
      }

    ],
    search
  );

  return (
    <>
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
        }, collectionForm.handleEditCollectionError)}
        onCancel={() => {
          setCollectionModalOpen(false)
          collectionForm.reset();
        }}
      />

      <CreateHintModal
        isModalOpen={isHintModalOpen}
        setModalOpen={setHintModalOpen}
        isEditing={false}
        isHintLoading={createHintMutation.isLoading}
        handleContentChange={(editorHtml) => setHintContent(editorHtml)}
        hintContent={hintContent}
        initialValues={{ title: "", content: "" }}
        form={hintForm}
        showCollectionSelect={true}
        selectedCollectionId={selectedCollectionId}
        onCollectionChange={setSelectedCollectionId}
        onConfirm={hintForm.onSubmit((values) => {
          if (!selectedCollectionId) {
            showNotification({
              title: "Error",
              message: "Please select a collection",
              color: "red"
            });
            return;
          }

          createHintMutation.mutate({
            title: values.title,
            collectionId: selectedCollectionId,
            content: values.content
          }, {
            onSuccess: () => {
              setHintModalOpen(false);
              hintForm.reset();
              setHintContent("");
              setSelectedCollectionId("");
              showNotification({
                title: "Hint created",
                message: "Hint created successfully"
              });
            },
            onError: (error) => {
              showNotification({
                title: "Error creating hint",
                message: error.message,
                color: "red"
              });
            },
            onSettled: () => {
              utils.hint.getAllByCollectionId.invalidate();
            }
          });
        }, hintForm.handleCreateHintError)}
        onCancel={() => {
          setHintModalOpen(false);
          hintForm.reset();
          setHintContent("");
          setSelectedCollectionId("");
        }}
        onClose={() => {
          setHintModalOpen(false);
          hintForm.reset();
          setHintContent("");
          setSelectedCollectionId("");
        }}
      />

      <CommandPalette
        onChangeSearch={setSearch}
        onChangeOpen={setOpen}
        search={search}
        isOpen={isOpen}
        page={page}
      >
        <CommandPalette.Page id="root">
          {filteredItems.length ? (
            filteredItems.map((list) => (
              <CommandPalette.List key={list.id} heading={list.heading}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPalette.ListItem
                    key={id}
                    index={getItemIndex(filteredItems, id)}
                    {...rest}
                  />
                ))}
              </CommandPalette.List>
            ))
          ) : (
            <CommandPalette.FreeSearchAction />
          )}
        </CommandPalette.Page>

        <CommandPalette.Page id="collections">
          {collections && collections.length > 0 ? (
            <>
              <CommandPalette.List heading="Collections">
                {collections.map((collection, index) => (
                  <CommandPalette.ListItem
                    key={collection.id}
                    index={index}
                    onClick={() => {
                      router.push(`/collections/${collection.id}`);
                      setOpen(false);
                      setPage("root");
                    }}
                  >
                    {collection.name}
                  </CommandPalette.ListItem>
                ))}
              </CommandPalette.List>
              <CommandPalette.List heading="Actions">
                <CommandPalette.ListItem
                  index={collections.length}
                  onClick={() => setPage("root")}
                >
                  ← Back to main menu
                </CommandPalette.ListItem>
              </CommandPalette.List>
            </>
          ) : (
            <CommandPalette.List>
              <CommandPalette.ListItem
                index={0}
                onClick={() => setPage("root")}
              >
                ← Back to main menu
              </CommandPalette.ListItem>
            </CommandPalette.List>
          )}
        </CommandPalette.Page>

        <CommandPalette.Page id="hints">
          {allHints && allHints.length > 0 ? (
            <>
              <CommandPalette.List heading="Hints">
                {allHints.map((hint, index) => (
                  <CommandPalette.ListItem
                    key={hint.id}
                    index={index}
                    onClick={() => {
                      router.push(`/collections/${hint.Collection.id}`);
                      setOpen(false);
                      setPage("root");
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: '#fff' }}>{hint.title}</span>
                      <span style={{ fontSize: '0.85em', opacity: 0.6, color: '#fff' }}>
                        in {hint.Collection.name}
                      </span>
                    </div>
                  </CommandPalette.ListItem>
                ))}
              </CommandPalette.List>
              <CommandPalette.List heading="Actions">
                <CommandPalette.ListItem
                  index={allHints.length}
                  onClick={() => setPage("root")}
                >
                  ← Back to main menu
                </CommandPalette.ListItem>
              </CommandPalette.List>
            </>
          ) : (
            <CommandPalette.List>
              <CommandPalette.ListItem
                index={0}
                onClick={() => setPage("root")}
              >
                ← Back to main menu
              </CommandPalette.ListItem>
            </CommandPalette.List>
          )}
        </CommandPalette.Page>
      </CommandPalette>
    </>
  );
};

export default Command;
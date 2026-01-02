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

type CommandProps = {
  isOpen: boolean,
  setOpen: (isOpen: boolean) => void
}

const Command = ({ isOpen, setOpen }: CommandProps) => {
  const [page, setPage] = useState<"root" | "projects">("root");
  const [search, setSearch] = useState("");
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  const router = useRouter();

  const collectionForm = useCollectionForm("");

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
          {
            id: "documentation",
            children: "Documentation",
            icon: () => <IconFileText color="gray" />,
            href: "#",
          },
          // {
          //   id: "projects",
          //   children: "Projects",
          //   icon: "CollectionIcon",
          //   closeOnSelect: false,
          //   onClick: () => {
          //     setPage("projects");
          //   },
          // },
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
              setCollectionModalOpen(true);
            },
          },
          {
            id: "search-collections",
            children: "Search Collections",
            icon: () => <IconReportSearch color="gray" />,
            href: "#",
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
            href: "#",
          },
          {
            id: "search-hints",
            children: "Search Hints",
            icon: () => <IconFilePlus color="gray" />,
            href: "#",
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

        <CommandPalette.Page id="projects">
          {/* Projects page */}
        </CommandPalette.Page>
      </CommandPalette>
    </>
  );
};

export default Command;
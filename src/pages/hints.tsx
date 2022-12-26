import { Button, Container, Group, Input, Loader, Modal, Textarea, TextInput, Title, Tooltip } from "@mantine/core"
import { Toolbar } from "@mantine/tiptap/lib/Toolbar/Toolbar";
import { IconFilePlus, IconSearch } from "@tabler/icons";
import { type NextPage } from "next";
import { InputWithButton as SearchBar } from "./components/InputWithButton";
import MainLayout from "./components/layouts/MainLayout";
import MainHeader from "./components/MainHeader";
import { useRef, useState } from 'react';
import RREditor from "./components/RichTextEditor";
import CreateHintModal from "./components/CreateHintModal";
import { useHotkeys } from "@mantine/hooks";


const Hints: NextPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const SearchBarRef = useRef<HTMLInputElement>(null);
  useHotkeys([
    ["c", () => setModalOpen(true)],
    // FIXME: SearchBarRef is null
    ["/", () => SearchBarRef.current?.focus()]
  ])

  return (
    <MainLayout containerSize="md">
      <CreateHintModal isModalOpen={isModalOpen} setModalOpen={setModalOpen}/>

      <Group position="apart" align="center" my="xl">
        <Title align="center">Terminal Commands</Title>

        {/* TODO: show cmd or ctrl depending on OS */}
        {/* <Tooltip label="Create Hint (⌘ + K)"> */}
        <Tooltip label="Create Hint ('C')">
          <Button color="indigo.8" leftIcon={<IconFilePlus size={18} />} onClick={() => setModalOpen(true)}>
            Create Hint
          </Button>

        </Tooltip>

      </Group>
      <SearchBar ref={SearchBarRef} />
    </MainLayout>
  )
}


export default Hints;
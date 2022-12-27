import { Button, Container, Grid, Group, Input, Loader, Modal, SimpleGrid, Textarea, TextInput, Title, Tooltip } from "@mantine/core"
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
import HintCard from "./components/HintCard";


const testHints = [
  {
    id: 1,
    title: "How to create a new file in terminal",
    isCode: false,
    content: "To create a new file in terminal, use the touch command. For example, to create a new file called index.html, you would type <code>touch index.html</code>."
  },
  {
    id: 2,
    title: "How to create a new folder in terminal",
    isCode: false,
    content: "To create a new folder in terminal, use the mkdir command. For example, to create a new folder called images, you would type mkdir images."
  },
  {
    id: 3,
    title: "How to delete a file in terminal",
    isCode: false,
    content: "To delete a file in terminal, use the rm command. For example, to delete a file called index.html, you would type rm index.html."
  },
  {
    id: 4,
    title: "How to delete a folder in terminal",
    isCode: false,
    content: "To delete a folder in terminal, use the rm -r command. For example, to delete a folder called images, you would type rm -r images."
  },
  {
    id: 5,
    title: "How to move a file in terminal",
    isCode: false,
    content: "To move a file in terminal, use the mv command. For example, to move a file called index.html to a folder called images, you would type mv index.html images."
  },
  {
    id: 6,
    title: "Test Rich Text",
    isCode: false,
    content: '<h2 style="text-align: left;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>'
  },
  {
    id: 7,
    title: "Hello World in Python",
    isCode: true,
    content: `
def main():
  print("Hello World") 

main()
    `
  }
]


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
      <CreateHintModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} />

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

      <SearchBar ref={SearchBarRef} mb="xl"/>

      <ul style ={{paddingLeft: 0}}>
        <SimpleGrid cols={2} spacing="xl">
          {
            testHints.map(hint => (
              <HintCard key={hint.id} hint={hint}/>
            ))
          }
        </SimpleGrid>
      </ul>
    </MainLayout>
  )
}


export default Hints;
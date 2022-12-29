import { type MouseEventHandler, type FormEventHandler, type KeyboardEventHandler } from 'react';
import { Modal, Button, Group, TextInput, Switch, Tooltip } from '@mantine/core';
import Editor from './RichTextEditor';
import { CreatableSelect as CollectionSelect } from './CreatableSelect';
import { getHotkeyHandler } from '@mantine/hooks';

type CreateHintModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;

  hintTitle: string;
  setHintTitle: (value: string) => void;

  hintCollection: string;
  setHintCollection: (value: string) => void;

  hintContent: string;
  setHintContent: (value: string) => void;

  onConfirm: FormEventHandler<HTMLFormElement>;
  onCancel: MouseEventHandler<HTMLButtonElement>;
}

export default function CreateHintModal({
  isModalOpen, setModalOpen,
  onConfirm, onCancel,
  hintTitle, setHintTitle,
  hintCollection, setHintCollection,
  hintContent, setHintContent
}: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={() => setModalOpen(false)}
      title="Create Hint"
      overflow="inside"
      size="xl"
    >
      <form onSubmit={onConfirm}>
        <TextInput label="Title" placeholder="Title" value={hintTitle} onChange={(e) => setHintTitle(e.currentTarget.value)} data-autofocus />
        <CollectionSelect
          mt="md"
          description="To create a new collection just type its name"
          value={hintCollection}
          onChange={(e) => setHintCollection(e.currentTarget.value)}
        />
        <Editor
          mt="lg"
          value={hintContent} onContentUpdate={setHintContent}
          // onKeydown={(e) => getHotkeyHandler([
          //   ['mod+shift+Enter', onConfirm]
          // ])}
        />

        <Group mt="lg">
          <Button type="submit" color="indigo.8">Create</Button>
          <Tooltip label="Cancel ('Esc') - Any new data that was written will be lost">
            <Button color="indigo.8" variant="light" onClick={onCancel}>Cancel</Button>
          </Tooltip>
        </Group>
      </form>
    </Modal>
  );
}
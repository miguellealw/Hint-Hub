import { type MouseEventHandler, type FormEvent } from 'react';
import { Modal, Button, Group, TextInput, Tooltip } from '@mantine/core';
import Editor from './RichTextEditor';
import { type UseFormReturnType } from '@mantine/form';
// import { CreatableSelect as CollectionSelect } from './CreatableSelect';

type CreateHintFormValues = {
  title: string;
  // collection: string;
  content: string;
}

type CreateHintModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;

  hintContent: string;
  handleContentChange: (value: string) => void;

  onConfirm: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  form: UseFormReturnType<CreateHintFormValues>,
  isEditing?: boolean,
}

export default function CreateHintModal({
  isModalOpen, setModalOpen,
  handleContentChange,
  onConfirm,
  onCancel,
  hintContent,
  form,
  isEditing
}: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={() => { setModalOpen(false) }}
      title={`${isEditing ? "Update" : "Create"} Hint`}
      overflow="inside"
      size="xl"
    >
      <form onSubmit={onConfirm}>
        <TextInput label="Title" placeholder="Title" data-autofocus
          {...form.getInputProps('title')}
        />
        {/* <CollectionSelect
          mt="md"
          description="To create a new collection just type its name"
          value={hintCollection}
          onChange={(name, id) => handleCollectionChange(name, id)}
          {...form.getInputProps('collection')}
        /> */}
        <Editor
          mt="lg"
          value={hintContent}
          onContentUpdate={handleContentChange}
          form={form}
        // {...form.getInputProps('content')}
        // onKeydown={(e) => getHotkeyHandler([
        //   ['mod+shift+Enter', onConfirm]
        // ])}
        />

        <Group mt="lg">
          <Button type="submit" color="indigo.8">{isEditing ? "Update" : "Create"} </Button>
          <Tooltip label="Cancel ('Esc') - Any new data that was written will be lost">
            <Button color="indigo.8" variant="light" onClick={onCancel}>Cancel</Button>
          </Tooltip>
        </Group>
      </form>
    </Modal>
  );
}
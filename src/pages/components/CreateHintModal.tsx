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

  hintTitle: string;
  // setHintTitle: (value: string) => void;

  // hintCollection: string;
  // setHintCollection: (value: string) => void;

  hintContent: string;
  // setHintContent: (value: string) => void;

  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // handleCollectionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  // handleCollectionChange: (value: string | null) => void;
  // handleCollectionChange: (value: string | null, id: string | null) => void;
  handleContentChange: (value: string) => void;

  // onConfirm: (e: FormEvent<HTMLFormElement>, formValues: FormValues) => void;
  // onConfirm: (e: FormEvent<HTMLFormElement>, form: UseFormReturnType<CreateHintFormValues>) => void;
  onConfirm: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  form: UseFormReturnType<CreateHintFormValues>,
}

export default function CreateHintModal({
  isModalOpen, setModalOpen,
  handleTitleChange,
  handleContentChange,
  // handleCollectionChange,
  onConfirm, 
  onCancel,
  hintTitle,
  // hintCollection,
  // setHintCollection,
  hintContent,
  form
}: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={() => {
        setModalOpen(false)
        form.reset();
      }}
      title="Create Hint"
      overflow="inside"
      size="xl"
    >
      <form onSubmit={onConfirm}>
        <TextInput label="Title" placeholder="Title" data-autofocus
          value={hintTitle}
          onChange={handleTitleChange}
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
          <Button type="submit" color="indigo.8">Create</Button>
          <Tooltip label="Cancel ('Esc') - Any new data that was written will be lost">
            <Button color="indigo.8" variant="light" onClick={onCancel}>Cancel</Button>
          </Tooltip>
        </Group>
      </form>
    </Modal>
  );
}
import { type MouseEventHandler, type FormEvent } from 'react';
import { Modal, Button, Group, TextInput, Tooltip, type ModalProps } from '@mantine/core';
import Editor from './RichTextEditor';
import { type UseFormReturnType } from '@mantine/form';
import LoadingOverlay from './LoadingOverlay';
import CollectionSelect from './CollectionSelect';

type HintFormValues = {
  title: string;
  content: string;
}

type CreateHintModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void

  hintContent: string
  handleContentChange: (value: string) => void

  onConfirm: (e: FormEvent<HTMLFormElement>) => void
  onCancel: MouseEventHandler<HTMLButtonElement>
  onClose: ModalProps["onClose"]
  form: UseFormReturnType<HintFormValues>
  isEditing?: boolean

  initialValues: HintFormValues
  isHintLoading: boolean

  // Optional collection selector props
  showCollectionSelect?: boolean
  selectedCollectionId?: string
  onCollectionChange?: (collectionId: string) => void
}

export default function CreateHintModal({
  isModalOpen,
  handleContentChange,
  onConfirm,
  onCancel,
  onClose,
  hintContent,
  form,
  isEditing,
  initialValues,
  isHintLoading,
  showCollectionSelect = false,
  selectedCollectionId = "",
  onCollectionChange
}: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={onClose}
      title={`${isEditing ? "Update" : "Create"} Hint`}
      overflow="inside"
      size="xl"
    >
      <LoadingOverlay visible={isHintLoading} />
      <form onSubmit={onConfirm}>
        <TextInput label="Title" placeholder="Title" data-autofocus {...form.getInputProps('title')} />
        {showCollectionSelect && (
          <CollectionSelect
            mt="md"
            value={selectedCollectionId}
            onChange={(val) => onCollectionChange?.(val ?? "")}
          />
        )}
        <Editor
          mt="lg"
          value={hintContent}
          onContentUpdate={handleContentChange}
          form={form}
          initialValues={initialValues}
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
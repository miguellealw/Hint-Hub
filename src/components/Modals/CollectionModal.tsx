import type { FormEvent, SyntheticEvent } from 'react';
import { Modal, Button, Group, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

type CreateHintModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  currentName?: string,

  onConfirm: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: (e: SyntheticEvent) => void;
  onClose: () => void;

  form: UseFormReturnType<{ name: string }>,
  isEditing?: boolean,
}


export default function CreateCollectionModal({
  isModalOpen,
  setModalOpen,
  onConfirm,
  onCancel,
  onClose,
  form,
  isEditing
}: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={onClose}
      title={`${isEditing ? "Update" : "Create"} Collection`}
      size="md"
    >
      <form onSubmit={onConfirm}>
        <TextInput
          label="Collection Name"
          placeholder="Name"
          data-autofocus
          {...form.getInputProps('name')}
        />

        <Group mt="lg">
          <Button color="indigo.8" type="submit">{isEditing ? "Update" : "Create"}</Button>
          <Button variant="light" color="indigo.8" onClick={onCancel}>Cancel</Button>
        </Group>
      </form>
    </Modal>
  );
}
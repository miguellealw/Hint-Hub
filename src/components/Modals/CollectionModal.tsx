import { FormEvent, SyntheticEvent, useState } from 'react';
import { Modal, Button, Group, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import LoadingOverlay from '../LoadingOverlay';

type CreateHintModalProps = {
  isModalOpen: boolean;
  currentName?: string,

  onConfirm: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: (e: SyntheticEvent) => void;
  onClose: () => void;

  form: UseFormReturnType<{ name: string }>,
  isEditing?: boolean,
  isCollectionsLoading: boolean
}


export default function CreateCollectionModal({
  isModalOpen,
  onConfirm,
  onCancel,
  onClose,
  form,
  isEditing,
  isCollectionsLoading,
}: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={onClose}
      title={`${isEditing ? "Update" : "Create"} Collection`}
      size="md"
    >
      <LoadingOverlay visible={isCollectionsLoading} />
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
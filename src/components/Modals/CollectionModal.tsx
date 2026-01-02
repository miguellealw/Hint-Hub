import { FormEvent, SyntheticEvent, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      // Longer timeout to ensure the modal is fully rendered and command palette is closed
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

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
          ref={inputRef}
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
import { type SyntheticEvent, useState } from 'react';
import { Modal, Button, Group, TextInput, Switch, Title } from '@mantine/core';
import RREditor from '../RichTextEditor';
import { CreatableSelect as CollectionSelect } from '../CreatableSelect';
import { trpc } from '../../../utils/trpc';

type CreateHintModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  currentName?: string,

  onConfirm: (e: SyntheticEvent) => void;
  onCancel: (e: SyntheticEvent) => void;

  setName: (name: string) => void;
  name: string
}

export default function CreateCollectionModal({
  isModalOpen,
  setModalOpen,
  name,
  setName,
  onConfirm,
  onCancel
}: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={() => setModalOpen(false)}
      title="Create Collection"
      size="md"
    >
      <TextInput
        label="Collection Name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        data-autofocus
      />

      <Group mt="lg">
        <Button color="indigo.8" onClick={onConfirm}>Create</Button>
        <Button variant="light" color="indigo.8" onClick={onCancel}>Cancel</Button>
      </Group>
    </Modal>
  );
}
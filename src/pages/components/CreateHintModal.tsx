import { useState } from 'react';
import { Modal, Button, Group, TextInput } from '@mantine/core';
import RREditor from './RichTextEditor';
import {CreatableSelect as CollectionSelect} from './CreatableSelect';

type CreateHintModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export default function CreateHintModal({ isModalOpen, setModalOpen }: CreateHintModalProps) {
  return (
    <Modal
      opened={isModalOpen}
      onClose={() => setModalOpen(false)}
      title="Create Hint"
      size="xl"
    >
      <TextInput label="Title" placeholder="Title" />
      <CollectionSelect mt="lg" />
      <RREditor mt="lg" />
    </Modal>
  );
}
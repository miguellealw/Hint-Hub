import { useState } from 'react';
import { Modal, Button, Group, TextInput } from '@mantine/core';
import RREditor from './RichTextEditor';

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
      <RREditor mt="lg" />
    </Modal>
  );
}
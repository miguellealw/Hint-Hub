import { useState } from 'react';
import { Modal, Button, Group, TextInput, Switch, Title } from '@mantine/core';
import RREditor from './RichTextEditor';
import { CreatableSelect as CollectionSelect } from './CreatableSelect';
import { trpc } from '../../utils/trpc';

type CreateHintModalProps = {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export default function CreateCollectionModal({ isModalOpen, setModalOpen }: CreateHintModalProps) {
  const mutation = trpc.collection.create.useMutation();
  const [name, setName] = useState("")

  return (
    <Modal
      opened={isModalOpen}
      onClose={() => setModalOpen(false)}
      title="Create Collection"
      size="md"
    >
      <TextInput label="Collection Name" placeholder="Name" onChange={(e) => setName(e.currentTarget.value)} />
      <Group mt="lg">
        <Button color="indigo.8" onClick={() => {
          mutation.mutate({ name });
          setModalOpen(false);
        }}>Create</Button>
        <Button variant="light" color="indigo.8">Cancel</Button>
      </Group>
    </Modal>
  );
}
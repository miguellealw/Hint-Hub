import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { ConfirmModalProps } from '@mantine/modals/lib/ConfirmModal';

const openModal = (
  onConfirm: ConfirmModalProps["onConfirm"], 
  // onCancel: ConfirmModalProps["onCancel"]
) => openConfirmModal({
  title: 'Are you sure you want to delete this collection?',
  children: (
    <Text size="sm">
      If you delete this collection, it will delete all the hints in it.
    </Text>
  ),
  labels: { confirm: 'Confirm', cancel: 'Cancel' },
  confirmProps: { color: 'red' },
  // onCancel,
  onConfirm
});

// export { openModal as openConfirmModal };
export default openModal;
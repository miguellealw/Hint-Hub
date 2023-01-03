import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { type OpenConfirmModal } from '@mantine/modals/lib/context';


const openDeleteConfirmModal = (opts: OpenConfirmModal) => openConfirmModal({
  title: opts.title ?? 'Are you sure you want to delete this collection?',
  children: opts.children ?? (
    <Text size="sm">
      If you delete this collection, it will delete all the hints in it.
    </Text>
  ),
  labels: { confirm: 'Confirm', cancel: 'Cancel' },
  confirmProps: { color: 'red' },
  onCancel: opts.onCancel,
  onConfirm: opts.onConfirm,
  ...opts
});


// export { openModal as openConfirmModal };
export { openDeleteConfirmModal };
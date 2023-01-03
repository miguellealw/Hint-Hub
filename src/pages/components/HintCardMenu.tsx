import { Menu } from '@mantine/core';
import { IconTrash, IconEdit, IconDotsVertical, IconCopy } from '@tabler/icons';

type HintCardMenuProps = {
  // TODO: figure out how to make a dynamic type for classes
  classes: {
    card: string;
    iconEdit: string;
  }
  onDelete: () => void;
  onEdit: () => void;
  onCopy: () => void;
}

export default function HintCardMenu({ classes, onDelete, onEdit, onCopy }: HintCardMenuProps) {
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <div>
          <IconDotsVertical size={18} className={classes.iconEdit} />
        </div>
        {/* <Button>Test Button</Button> */}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Hint Options</Menu.Label>
        <Menu.Item icon={<IconEdit size={14} />} onClick={() => onEdit()}>Edit hint</Menu.Item>
        <Menu.Item icon={<IconCopy size={14} />} onClick={() => onCopy()}>Copy content</Menu.Item>
        {/* TODO: for future */}
        {/* <Menu.Item icon={<IconShare size={14}/>}>Share</Menu.Item> */}


        <Menu.Divider />
        <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={() => onDelete()}>Delete hint</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
import { Menu } from '@mantine/core';
import { IconTrash, IconEdit, IconDotsVertical, IconCopy, IconBoxMultiple, IconCommand, IconLogout } from '@tabler/icons';

type HeadingMenuProps = {
  // TODO: figure out how to make a dynamic type for classes
  targetComponent: JSX.Element
  name: string | null | undefined
  onClickCollections: (e: React.SyntheticEvent) => void
  onClickCommand: (e: React.SyntheticEvent) => void
  onClickLogout: (e: React.SyntheticEvent) => void
}

export default function HeaderMenu({ targetComponent, name, onClickCollections, onClickCommand, onClickLogout }: HeadingMenuProps) {
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        {targetComponent}
        {/* <div>
          <IconDotsVertical size={18} />
        </div> */}
        {/* <Button>Test Button</Button> */}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{name ?? "Menu"}</Menu.Label>
        <Menu.Item icon={<IconBoxMultiple size={14}/>} onClick={onClickCollections}>Collections</Menu.Item>
        <Menu.Item icon={<IconCommand size={14} />} onClick={onClickCommand}>Command Prompt</Menu.Item>
        {/* TODO: for future */}
        {/* <Menu.Item icon={<IconShare size={14}/>}>Share</Menu.Item> */}


        <Menu.Divider />
        <Menu.Item color="indigo" icon={<IconLogout size={14} />} onClick={onClickLogout}>Log out</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
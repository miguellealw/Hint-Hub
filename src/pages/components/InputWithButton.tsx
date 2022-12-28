import { TextInput, TextInputProps, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconSearch, IconArrowRight, IconArrowLeft } from '@tabler/icons';

type InputWithButtonProps = TextInputProps & {
  // ref?: React.RefObject<HTMLInputElement>;
}

export function InputWithButton(props: InputWithButtonProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      icon={<IconSearch size={18} stroke={1.5} />}
      radius="xl"
      size="md"
      rightSection={
        // <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
        <ActionIcon size={32} radius="xl" color="indigo.8" variant="filled">
          {theme.dir === 'ltr' ? (
            <IconArrowRight size={18} stroke={1.5} />
          ) : (
            <IconArrowLeft size={18} stroke={1.5} />
          )}
        </ActionIcon>
      }
      placeholder="Search hints ('/')"
      rightSectionWidth={42}
      // TODO: fix ref with ForwardRef or somn
      {...props}
    />
  );
}
import { TextInput, type TextInputProps, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconSearch, IconArrowRight, IconArrowLeft } from '@tabler/icons';
import React from 'react';

const InputWithButton = React.forwardRef((props: TextInputProps, ref) => {
  const theme = useMantineTheme();

  return (
    <TextInput
      {...props}
      icon={<IconSearch size={18} stroke={1.5} />}
      radius="xl"
      size="md"
      aria-label="Search hints (Keyboard shortcut: /)"
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
      // IDK if this is right
      ref={ref as React.RefObject<HTMLInputElement>}
    />
  );
})

InputWithButton.displayName = 'InputWithButton';

export default InputWithButton;
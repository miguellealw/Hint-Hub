import { useState } from 'react';
import { Select } from '@mantine/core';

export function CreatableSelect(props: any) {
  const [data, setData] = useState([
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
  ]);

  return (
    <Select
      label="Collection"
      data={data}
      placeholder="Select collection"
      nothingFound="Nothing found"
      searchable
      creatable
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = { value: query, label: query };
        setData((current) => [...current, item]);
        return item;
      }}
      {...props}
    />
  );
}
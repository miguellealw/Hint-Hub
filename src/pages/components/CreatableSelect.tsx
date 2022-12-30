import { useState } from 'react';
import { Select, type SelectProps, type SelectItem } from '@mantine/core';
import { trpc } from '../../utils/trpc';

// interface CreateableSelectProps = {
//   handleCollectionChange: (value: string) => void;
// } extends SelectProps;

export function CreatableSelect({ handleCollectionChange, ...props }: SelectProps) {
  // TODO: move the colections data up to [id], since I will need it to send to backend
  const [data, setData] = useState<SelectItem[] | []>([]);

  const { data: collections, isSuccess: isGetSuccess } = trpc.collection.getAll.useQuery(
    undefined,
    {
      onSuccess(collections) {
        const labelValues = collections.map(coll => ({ value: coll.id, label: coll.name, id: coll.id }))
        setData(labelValues)
      },
    }
  );
  const { mutate, isLoading } = trpc.collection.create.useMutation();

  if (isGetSuccess) {
  }

  return (
    <Select
      {...props}
      label="Collection"
      data={data}
      placeholder="Select collection"
      nothingFound="Nothing found"
      searchable
      creatable
      disabled={isLoading}
      getCreateLabel={(query) => `+ Create ${query}`}
      // onChange={(value) => handleCollectionChange(value, id)}
      // TODO: figure out how to get label here
      onChange={(value) => handleCollectionChange(name, value)}
      onCreate={(query) => {
        const item = { value: query, label: query };
        mutate({ name: query }, {
          onSuccess: () => setData((current) => [...current, item])
        });
        return item;
      }}
    />
  );
}
import { useState } from 'react';
import { Select, type SelectItem } from '@mantine/core';
import { trpc } from '../../utils/trpc';

export function CreatableSelect(props: any) {
  const [data, setData] = useState<SelectItem[] | []>([]);

  const { data: collections, isSuccess: isGetSuccess } = trpc.collection.getAll.useQuery(
    undefined,
    {
      onSuccess(collections) {
        const dat = collections.map(coll => {
          return { value: coll.name, label: coll.name }
        })

        setData(dat)
      },
    }
  );
  const { mutate, isLoading } = trpc.collection.create.useMutation();

  if (isGetSuccess) {
  }

  return (
    <Select
      label="Collection"
      data={data}
      placeholder="Select collection"
      nothingFound="Nothing found"
      searchable
      creatable
      disabled={isLoading}
      getCreateLabel={(query) => `+ Create ${query}`}
      onCreate={(query) => {
        const item = { value: query, label: query };
        mutate({ name: query }, {
          onSuccess: () => setData((current) => [...current, item])
        });
        return item;
      }}
      {...props}
    />
  );
}
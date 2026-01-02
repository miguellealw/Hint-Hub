import { Select, type SelectProps } from '@mantine/core';
import { trpc } from '../utils/trpc';

type CollectionSelectProps = Omit<SelectProps, 'data'> & {
  value: string;
  onChange: (value: string) => void;
};

export default function CollectionSelect({ value, onChange, ...props }: CollectionSelectProps) {
  const { data: collections, isLoading } = trpc.collection.getAll.useQuery({ searchValue: "" });

  const data = collections?.map((collection) => ({
    value: collection.id,
    label: collection.name,
  })) ?? [];

  return (
    <Select
      label="Collection"
      placeholder={isLoading ? "Loading collections..." : "Select a collection"}
      data={data}
      value={value}
      onChange={(val) => onChange(val ?? "")}
      disabled={isLoading}
      searchable
      {...props}
    />
  );
}

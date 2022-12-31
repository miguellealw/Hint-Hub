import { UseTRPCQueryOptions } from "@trpc/react-query/shared";
import { trpc } from "../utils/trpc";

const useUpdateCollection = () => trpc.collection.update.useMutation();
const useDeleteCollection = () => trpc.collection.delete.useMutation();
const useGetCollectionByIdQuery = (currentCollectionId: string) => {
  return trpc.collection.getById.useQuery(
    { id: currentCollectionId },
    { select: (data) => data.name }
  );
}


export {
  useUpdateCollection,
  useDeleteCollection,
  useGetCollectionByIdQuery,
}
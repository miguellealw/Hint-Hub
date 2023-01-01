import { showNotification } from "@mantine/notifications";
import { UseTRPCQueryOptions } from "@trpc/react-query/shared";
import { trpc } from "../utils/trpc";


const useGetCollectionsQuery = () => {
  return trpc.collection.getAll.useQuery();

}

const useCreateCollection = ({ onMutateCb, onSuccessCb, onErrorCb }: {
  onMutateCb: () => void,
  onSuccessCb: () => void,
  onErrorCb: (newCollection: { name: string }) => void
}) => {
  const utils = trpc.useContext();

  return trpc.collection.create.useMutation({
    onMutate: async (newCollection) => {
      // setCollectionModalOpen(false);
      onMutateCb();

      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.collection.getAll.invalidate();

      // Get the data from the queryCache
      const prevData = utils.collection.getAll.getData();

      // Optimistically update the data with our new post
      utils.collection.getAll.setData(undefined, (old) => [...old, newCollection]);

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onSuccess: (newCollection, context) => {
      onSuccessCb();

      showNotification({
        title: "Collection created",
        message: "Collection created successfully",
      })
    },
    onError: (err, newCollection, context) => {
      onErrorCb(newCollection);

      // If something goes wrong, use the context returned from onMutate to roll back
      utils.collection.getAll.setData(context.prevData);
      showNotification({
        title: "Error creating collection",
        message: err.message,
        color: "red"
      })
    },
    onSettled: () => {
      utils.collection.getAll.invalidate();
    }
  });
}

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
  useCreateCollection
}
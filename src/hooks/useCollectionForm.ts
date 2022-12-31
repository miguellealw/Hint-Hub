import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import isStringEmpty from "../utils/isStringEmpty";

const handleEditCollectionError = () =>
  showNotification({
    title: "Error",
    message: "Name field must be filled",
    color: "red"
  })

const useCollectionForm = (initialValue?: string) => {

  return {
    handleEditCollectionError, 
    ...useForm({
      initialValues: { name: initialValue ?? "" },
      validate: {
        name: (title) => isStringEmpty(title) ?? "Name field can't be empty",
      }
    })
  }
}

export default useCollectionForm;

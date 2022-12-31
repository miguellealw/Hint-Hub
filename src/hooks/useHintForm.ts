import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import isStringEmpty from "../utils/isStringEmpty";

const handleCreateHintError = () =>
  showNotification({
    title: "Error",
    message: "All fields must be filled",
    color: "red"
  })

const useHintForm = () => {

  return {
    handleCreateHintError,
    ...useForm({
      initialValues: {
        title: "",
        // collection: "",
        content: ""
      },
      validate: {
        title: (title) => isStringEmpty(title) ?? "Title field can't be empty",
        content: (content) => isStringEmpty(content) ?? "Content field can't be empty"
      }
    })
  }
}

export default useHintForm;
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import isStringEmpty from "../utils/isStringEmpty";

type HintFormValues = {
  title: string;
  content: string;
}

const handleCreateHintError = () =>
  showNotification({
    title: "Error",
    message: "All fields must be filled",
    color: "red"
  })

const useHintForm = (initialValues: HintFormValues) => {

  return {
    handleCreateHintError,
    ...useForm({
      initialValues,
      validate: {
        title: (title) => isStringEmpty(title) ?? "Title field can't be empty",
        content: (content) => isStringEmpty(content) ?? "Content field can't be empty"
      }
    })
  }
}

export default useHintForm;
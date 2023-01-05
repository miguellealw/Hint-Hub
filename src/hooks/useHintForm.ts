import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { z } from "zod";

type HintFormValues = {
  title: string;
  content: string;
}

const schema = z.object({
  title: z.string().trim().min(2).max(40, "Title field must 2 - 40 characters"),
  // TODO: figure out if 1000 chars is fine
  // TODO: content is not being validated
  content: z.string().trim().min(2).max(1000, "Content field must 2 - 1000 characters")

})

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
      validate: zodResolver(schema),
    })
  }
}

export default useHintForm;
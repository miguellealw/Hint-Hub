import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { z } from "zod";

type HintFormValues = {
  title: string;
  content: string;
}

const schema = z.object({
  title: z.string().trim().min(2).max(40, "Title field must 2 - 40 characters"),
  // Don't trim content since it's HTML from rich text editor
  // Trimming HTML can break formatting and cause validation issues with pasted content
  content: z.string().min(1).max(50000, "Content field must not exceed 50000 characters")

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
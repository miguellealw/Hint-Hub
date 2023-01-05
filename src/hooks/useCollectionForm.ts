import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(40, "Name field must 2 - 40 characters")
})

const handleEditCollectionError = () =>
  showNotification({
    // title: "Error",
    message: "Error creating collection",
    color: "red"
  })

const useCollectionForm = (initialValue?: string) => {

  return {
    handleEditCollectionError,
    ...useForm({
      validate: zodResolver(schema),
      initialValues: { name: initialValue ?? "" },
    })
  }
}

export default useCollectionForm;

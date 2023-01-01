import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import router from "next/router";

const useUnauthed = () => {
  return useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
      // FIX ME: this is being called multiple times, when "Get Started" in landing page is clicked
      showNotification({ title: "Please login to continue", message: "You need to be logged in to view this page", color: "yellow" })
    }
  })
}


export default useUnauthed;
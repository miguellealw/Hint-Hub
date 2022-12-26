import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { hintRouter } from "./hint";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  hint: hintRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { router } from "../trpc";
import { authRouter } from "./auth";
import { collectionRouter } from "./collection";
import { exampleRouter } from "./example";
import { hintRouter } from "./hint";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  hint: hintRouter,
  collection: collectionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { contextProps } from "@trpc/react-query/dist/internals/context";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const hintRouter = router({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
     ctx.prisma.hint.findUnique({
        where: {
          id: input.id,
        },
     });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.hint.findMany();
  }),
});

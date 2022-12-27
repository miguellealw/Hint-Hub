import { contextProps } from "@trpc/react-query/dist/internals/context";
import { z } from "zod";
import restricted from "../../../pages/api/restricted";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const collectionRouter = router({
  // TODO: make private procedure
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      ctx.prisma.collection.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany({
      where: { userId: ctx.session.user.id }
    }
    );
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.collection.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    })
});

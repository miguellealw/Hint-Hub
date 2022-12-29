import { contextProps } from "@trpc/react-query/dist/internals/context";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const hintRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.hint.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getAllByCollectionId: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.hint.findMany({
        where: {
          collectionId: input.collectionId,
          userId: ctx.session.user.id
        }
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.hint.findMany({
      where: { userId: ctx.session.user.id }
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        collectionId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.hint.create({
        data: {
          title: input.title,
          content: input.content,
          collectionId: input.collectionId,
          userId: ctx.session.user.id,
        },
      });
    }),

  // TODO: the input type must be worked on since smoe values will be null
  update: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        collectionId: z.string(),
        userId: z.string()
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.hint.create({
        data: {
          title: input.title,
          content: input.content,
          collectionId: input.collectionId,
          userId: input.userId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.hint.delete({
        where: {
          id: input.id,
        },
      });
    })
});

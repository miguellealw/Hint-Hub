import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const hintRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.hint.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
    }),

  getAllByCollectionId: protectedProcedure
    .input(z.object({
      collectionId: z.string(),
      searchValue: z.string()
    }))
    .query(({ input, ctx }) => {
      // get all hints
      return ctx.prisma.hint.findMany({
        where: {
          collectionId: input.collectionId,
          userId: ctx.session.user.id,
          title: {
            contains: input?.searchValue ?? "",
            mode: "insensitive",
          }
        },
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
        title: z.string().trim().min(2).max(40, "Title field must 2 - 40 characters"),
        content: z.string().trim().min(5).max(1000, "Content field must 5 - 1000 characters"),
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().trim().min(2).max(40, "Title field must 2 - 40 characters"),
        content: z.string().trim().min(2).max(1000, "Content field must 2 - 1000 characters"),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.hint.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
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

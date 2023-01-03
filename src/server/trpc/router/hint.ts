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
    .input(z.object({ collectionId: z.string(), searchValue: z.string().nullish() }))
    .query(({ input, ctx }) => {
      // search hints
      if (input.searchValue) {
        return ctx.prisma.hint.findMany({
          where: {
            collectionId: input.collectionId,
            userId: ctx.session.user.id,
            title: {
              contains: input.searchValue,
              mode: "insensitive",
            }
          },
        });
      }

      // get all hints
      return ctx.prisma.hint.findMany({
        where: {
          collectionId: input.collectionId,
          userId: ctx.session.user.id,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.hint.findMany({
      where: { userId: ctx.session.user.id }
    });
  }),

  getBySearch: protectedProcedure
    .input(z.object({ searchValue: z.string(), collectionId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.hint.findMany({
        where: {
          collectionId: input.collectionId,
          title: {
            search: input.searchValue
          }
        }
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
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
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required")
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

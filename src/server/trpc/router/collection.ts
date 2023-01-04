import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const collectionRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.collection.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ searchValue: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.collection.findMany({
        where: {
          userId: ctx.session.user.id,
          name: {
            contains: input.searchValue ?? "",
            mode: "insensitive",
          }
        },
        include: {
          _count: {
            select: { hints: true },
          }
        }
      }
      );
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1, "Name is required") }))
    .mutation(async ({ input, ctx }) => {
      const collection = await ctx.prisma.collection.findFirst({
        where: { name: input.name, userId: ctx.session.user.id },
      });
      if (collection) throw new Error("Collection name already exists");

      return ctx.prisma.collection.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1, "Name is required") }))
    .mutation(async ({ input, ctx }) => {
      const collection = await ctx.prisma.collection.findFirst({ where: { name: input.name, }, });
      if (collection) throw new Error("Collection name already exists");

      return ctx.prisma.collection.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // find if collection exists
      const collection = await ctx.prisma.collection.findUnique({
        where: { id: input.id },
      });

      if (!collection) { throw new Error("Collection not found"); }

      // delete hints in collection first, since CASCADE is not yet implemented
      // see here - https://www.prisma.io/docs/concepts/components/prisma-client/crud#cascading-deletes-deleting-related-records
      const deleteHints = ctx.prisma.hint.deleteMany({
        where: { collectionId: input.id, }
      });

      const deleteCollection = ctx.prisma.collection.delete({
        where: { id: input.id, },
      });

      return ctx.prisma.$transaction([deleteHints, deleteCollection]);
    })


});

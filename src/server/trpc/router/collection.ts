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

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany({
      where: { userId: ctx.session.user.id }
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
      // TODO: check if collection exists
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
      const collection = await ctx.prisma.collection.findUnique({
        where: { id: input.id },
      });

      if (!collection) {
        throw new Error("Collection not found");
      }

      // if (collection.userId !== ctx.session.user.id) {
      //   throw new Error("Not authorized");
      // }

      return ctx.prisma.collection.delete({
        where: {
          id: input.id,
        },
      });
    })


});

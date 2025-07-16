import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const getCategoriesRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/categories",
    {
      schema: {
        querystring: z.object({
          userId: z.string().regex(/^user_[a-zA-Z0-9]+$/, "ID do usuário deve ser um ID válido do Clerk (ex: user_xxx...)") ,
          active: z.coerce.boolean().optional(),
          name: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { userId, active, name } = request.query;
      try {
        const categories = await prisma.category.findMany({
          where: {
            userId,
            ...(active !== undefined ? { active } : {}),
            ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
          },
          orderBy: {
            name: "asc",
          },
        });
        return reply.send(categories);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao buscar categorias", details: error });
      }
    }
  );
};

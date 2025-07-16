import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const getServicesRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/services",
    {
      schema: {
        querystring: z.object({
          userId: z.string().regex(/^user_[a-zA-Z0-9]+$/, "ID do usuário deve ser um ID válido do Clerk (ex: user_xxx...)") ,
          active: z.coerce.boolean().optional(),
          name: z.string().optional(),
          categoryId: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { userId, active, name, categoryId } = request.query;
      try {
        if (!userId) {
          return reply.status(400).send({ error: "userId é obrigatório" });
        }
        let where: any = { userId };
        if (name) {
          where = {
            ...where,
            name: { contains: name, mode: "insensitive" },
          };
        } else if (categoryId) {
          where = {
            ...where,
            categoryId,
          };
        }
        if (active !== undefined) {
          where.active = active;
        }
        const services = await prisma.service.findMany({
          where,
          orderBy: {
            name: "asc",
          },
          include: {
            category: true,
          },
        });
        return reply.send(services);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao buscar serviços", details: error });
      }
    }
  );
};

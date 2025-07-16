import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const createCategoryRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/categories",
    {
      schema: {
        body: z.object({
          name: z.string().min(1, "Nome da categoria é obrigatório."),
          active: z.boolean().optional(),
          userId: z.string().regex(/^user_[a-zA-Z0-9]+$/, "ID do usuário deve ser um ID válido do Clerk (ex: user_xxx...)")
        }),
      },
    },
    async (request, reply) => {
      const { name, active = true, userId } = request.body;
      try {
        // Verifica se já existe categoria com o mesmo nome
        const existing = await prisma.category.findUnique({ where: { name } });
        if (existing) {
          return reply.status(404).send({ error: "Categoria já existe" });
        }
        const category = await prisma.category.create({
          data: {
            name,
            active,
            userId,
          },
        });
        return reply.status(201).send(category);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao criar categoria", details: error });
      }
    }
  );
};

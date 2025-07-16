import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const updateCategoryRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    "/categories/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "ID da categoria é obrigatório."),
        }),
        body: z.object({
          name: z.string().min(1, "Nome da categoria é obrigatório.").optional(),
          active: z.boolean().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, active } = request.body;
      try {
        // Verifica se a categoria existe
        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) {
          return reply.status(404).send({ error: "Categoria não encontrada" });
        }
        // Atualiza a categoria
        const updated = await prisma.category.update({
          where: { id },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(active !== undefined ? { active } : {}),
          },
        });
        return reply.status(200).send(updated);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao atualizar categoria", details: error });
      }
    }
  );
};

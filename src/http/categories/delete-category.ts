import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const deleteCategoryRoute: FastifyPluginCallbackZod = (app) => {
  app.delete(
    "/categories/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "ID da categoria é obrigatório."),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        // Verifica se a categoria existe
        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) {
          return reply.status(404).send({ error: "Categoria não encontrada" });
        }
        await prisma.category.delete({ where: { id } });
        return reply.status(204).send();
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao deletar categoria", details: error });
      }
    }
  );
};

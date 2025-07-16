import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const deleteServiceRoute: FastifyPluginCallbackZod = (app) => {
  app.delete(
    "/services/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "ID do serviço é obrigatório."),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        // Verifica se o serviço existe
        const existing = await prisma.service.findUnique({ where: { id } });
        if (!existing) {
          return reply.status(404).send({ error: "Serviço não encontrado" });
        }
        await prisma.service.delete({ where: { id } });
        return reply.status(204).send();
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao deletar serviço", details: error });
      }
    }
  );
};

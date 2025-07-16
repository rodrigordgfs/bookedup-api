import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const updateServiceRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    "/services/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "ID do serviço é obrigatório."),
        }),
        body: z.object({
          name: z.string().min(1, "Nome do serviço é obrigatório.").optional(),
          description: z.string().optional(),
          duration: z.number().int().min(1, "Duração deve ser em minutos.").optional(),
          price: z.number().min(0, "Preço deve ser positivo.").optional(),
          active: z.boolean().optional(),
          categoryId: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, description, duration, price, active, categoryId } = request.body;
      try {
        // Verifica se o serviço existe
        const existing = await prisma.service.findUnique({ where: { id } });
        if (!existing) {
          return reply.status(404).send({ error: "Serviço não encontrado" });
        }
        // Atualiza o serviço
        const updated = await prisma.service.update({
          where: { id },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(duration !== undefined ? { duration } : {}),
            ...(price !== undefined ? { price } : {}),
            ...(active !== undefined ? { active } : {}),
            ...(categoryId !== undefined ? { categoryId } : {}),
          },
          include: {
            category: true,
          },
        });
        return reply.status(200).send(updated);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao atualizar serviço", details: error });
      }
    }
  );
};

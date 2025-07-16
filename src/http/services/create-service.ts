import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const createServiceRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/services",
    {
      schema: {
        body: z.object({
          name: z.string().min(1, "Nome do serviço é obrigatório."),
          description: z.string().optional(),
          duration: z.number().int().min(1, "Duração deve ser em minutos."),
          price: z.number().min(0, "Preço deve ser positivo."),
          active: z.boolean().optional(),
          categoryId: z.string().min(1, "ID da categoria é obrigatório."),
          userId: z.string().regex(/^user_[a-zA-Z0-9]+$/, "ID do usuário deve ser um ID válido do Clerk (ex: user_xxx...)")
        }),
      },
    },
    async (request, reply) => {
      const { name, description, duration, price, active = true, categoryId, userId } = request.body;
      try {
        // Verifica se já existe serviço com o mesmo nome para o mesmo usuário
        const existing = await prisma.service.findFirst({ where: { name, userId } });
        if (existing) {
          return reply.status(409).send({ error: "Serviço já existe para este usuário" });
        }
        const service = await prisma.service.create({
          data: {
            name,
            description,
            duration,
            price,
            active,
            categoryId,
            userId,
          },
          include: {
            category: true,
          },
        });
        return reply.status(201).send(service);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao criar serviço", details: error });
      }
    }
  );
};

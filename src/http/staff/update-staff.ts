import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const updateStaffRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    "/staff/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "ID do staff é obrigatório."),
        }),
        body: z.object({
          name: z.string().optional(),
          email: z.string().email("E-mail inválido.").optional(),
          phone: z.string().optional(),
          workingHours: z.string().optional(),
          active: z.boolean().optional(),
          specialties: z.array(z.string()).optional(), // array de categoryId
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, email, phone, workingHours, active, specialties } = request.body;
      try {
        // Verifica se o staff existe
        const existing = await prisma.staff.findUnique({ where: { id } });
        if (!existing) {
          return reply.status(404).send({ error: "Funcionário não encontrado" });
        }
        // Atualiza dados básicos
        const staff = await prisma.staff.update({
          where: { id },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(email !== undefined ? { email } : {}),
            ...(phone !== undefined ? { phone } : {}),
            ...(workingHours !== undefined ? { workingHours } : {}),
            ...(active !== undefined ? { active } : {}),
            ...(specialties !== undefined ? {
              specialties: {
                deleteMany: {},
                create: specialties.map((categoryId: string) => ({ categoryId })),
              }
            } : {}),
          },
          include: {
            specialties: {
              select: {
                id: true,
                category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        });
        return reply.status(200).send(staff);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao atualizar funcionário", details: error });
      }
    }
  );
};

import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const deleteStaffRoute: FastifyPluginCallbackZod = (app) => {
  app.delete(
    "/staff/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "ID do staff é obrigatório."),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      try {
        // Verifica se o staff existe
        const existing = await prisma.staff.findUnique({ where: { id } });
        if (!existing) {
          return reply.status(404).send({ error: "Funcionário não encontrado" });
        }
        // Deleta as especialidades do staff
        await prisma.staffSpecialty.deleteMany({ where: { staffId: id } });
        // Deleta o staff
        await prisma.staff.delete({ where: { id } });
        return reply.status(204).send();
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao deletar funcionário", details: error });
      }
    }
  );
};

import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const getStaffsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/staff",
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
        const staffs = await prisma.staff.findMany({
          where: {
            userId,
            ...(active !== undefined ? { active } : {}),
            ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
          },
          orderBy: {
            name: "asc",
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
        return reply.send(staffs);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao buscar staffs", details: error });
      }
    }
  );
};

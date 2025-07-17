import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

export const createStaffRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/staff",
    {
      schema: {
        body: z.object({
          name: z.string().min(1, "Nome é obrigatório."),
          email: z.string().email("E-mail inválido."),
          phone: z.string().min(1, "Telefone é obrigatório."),
          workingHours: z.string().optional(),
          active: z.boolean().optional(),
          userId: z.string().regex(/^user_[a-zA-Z0-9]+$/, "ID do usuário deve ser um ID válido do Clerk (ex: user_xxx...)") ,
          specialties: z.array(z.string()).optional(), // array de categoryId
        }),
      },
    },
    async (request, reply) => {
      const { name, email, phone, workingHours, active = true, userId, specialties = [] } = request.body;
      try {
        // Verifica se já existe staff com o mesmo email
        const existing = await prisma.staff.findUnique({ where: { email } });
        if (existing) {
          return reply.status(409).send({ error: "Staff já existe com este e-mail" });
        }
        const staff = await prisma.staff.create({
          data: {
            name,
            email,
            phone,
            workingHours,
            active,
            userId,
            specialties: {
              create: specialties.map((categoryId: string) => ({ categoryId })),
            },
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
        return reply.status(201).send(staff);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao criar staff", details: error });
      }
    }
  );
};

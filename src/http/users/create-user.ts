import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";
import { registerActivity } from "../../lib/activity-utils.ts";

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/users",
    {
      schema: {
        body: z.object({
          id: z.string().regex(/^user_[a-zA-Z0-9]+$/, "ID do usuário deve ser um ID válido do Clerk (ex: user_xxx...)") ,
          email: z.string().email("E-mail inválido."),
        }),
      },
    },
    async (request, reply) => {
      const { id, email } = request.body;
      try {
        // Verifica se já existe usuário com o mesmo id
        const existingById = await prisma.user.findUnique({ where: { id } });
        if (existingById) {
          return reply.status(200).send(existingById);
        }
        // Verifica se já existe usuário com o mesmo email
        const existingByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingByEmail) {
          return reply.status(200).send(existingByEmail);
        }
        const user = await prisma.user.create({
          data: {
            id,
            email,
          },
        });

        await registerActivity({ type: "new_client", userId: id });
        return reply.status(201).send(user);
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao criar usuário", details: error });
      }
    }
  );
};

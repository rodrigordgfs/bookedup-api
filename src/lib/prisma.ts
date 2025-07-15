import { PrismaClient } from "../../prisma/generated/index.js";
import { env } from "../env.ts";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // Opcional: log de queries no terminal
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

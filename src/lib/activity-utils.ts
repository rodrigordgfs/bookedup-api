import { prisma } from "./prisma.ts";

export type ActivityType =
  | "appointment_confirmed"
  | "new_client"
  | "appointment_rescheduled"
  | "appointment_cancelled"
  | "payment_received"
  | "service_completed"
  | "reminder_sent";

export async function registerActivity({
  type,
  clientId,
  userId
}: {
  type: ActivityType,
  clientId?: string,
  userId?: string
}) {
  return prisma.activity.create({
    data: {
      type,
      clientId,
      userId,
    },
  });
} 
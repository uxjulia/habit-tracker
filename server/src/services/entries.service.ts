import { prisma } from "../lib/prisma";
import { format } from "date-fns";

function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export async function getEntries(startDate: string, endDate: string, habitId?: string) {
  return prisma.habitEntry.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
      ...(habitId ? { habitId } : {}),
    },
    include: { habit: true },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });
}

export async function getTodayEntries() {
  const today = todayISO();
  return prisma.habitEntry.findMany({
    where: { date: today },
    include: { habit: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createEntry(data: { habitId: string; date: string; time?: string; notes?: string }) {
  return prisma.habitEntry.create({ data, include: { habit: true } });
}

export async function updateEntry(id: string, data: { time?: string | null; notes?: string | null }) {
  return prisma.habitEntry.update({ where: { id }, data, include: { habit: true } });
}

export async function deleteEntry(id: string) {
  await prisma.habitEntry.delete({ where: { id } });
}

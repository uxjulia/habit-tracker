import { prisma } from '../lib/prisma';

export async function listHabits(includeArchived = false) {
  return prisma.habit.findMany({
    where: includeArchived ? undefined : { archived: false },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function createHabit(data: { name: string; color: string; emoji?: string }) {
  const maxOrder = await prisma.habit.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  return prisma.habit.create({ data: { ...data, sortOrder } });
}

export async function updateHabit(
  id: string,
  data: { name?: string; color?: string; emoji?: string | null; archived?: boolean; sortOrder?: number }
) {
  return prisma.habit.update({ where: { id }, data });
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({ where: { id } });
}

export async function reorderHabits(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) => prisma.habit.update({ where: { id }, data: { sortOrder: index } }))
  );
}

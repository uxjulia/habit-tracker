import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { invalidateSetupCache } from "../middleware/setupGuard";

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const token = signToken({ userId: user.id, username: user.username });
  return { token, username: user.username };
}

export async function setup(username: string, password: string) {
  const count = await prisma.user.count();
  if (count > 0) throw new Error("Setup already complete");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { username, passwordHash } });
  invalidateSetupCache();

  const token = signToken({ userId: user.id, username: user.username });
  return { token, username: user.username };
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

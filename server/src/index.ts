import bcrypt from "bcryptjs";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { createApp } from "./app";

async function main() {
  await prisma.$connect();
  console.log("Database connected");

  // Auto-seed from env vars if provided (idempotent)
  if (env.SETUP_USERNAME && env.SETUP_PASSWORD) {
    const count = await prisma.user.count();
    if (count === 0) {
      const passwordHash = await bcrypt.hash(env.SETUP_PASSWORD, 12);
      await prisma.user.create({ data: { username: env.SETUP_USERNAME, passwordHash } });
      console.log(`Initial user '${env.SETUP_USERNAME}' created from environment`);
    }
  }

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

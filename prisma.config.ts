import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // Fallback is only used during CI builds (prisma generate). Real value comes from docker-compose at runtime.
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/studygroups",
  },
});

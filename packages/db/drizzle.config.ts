import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'drizzle-kit'
import { config as loadEnv } from 'dotenv'

const envCandidates = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '../../.env'),
  resolve(process.cwd(), '../../apps/api/.env'),
]

for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    loadEnv({ path: envPath })
    break
  }
}

export default defineConfig({
  schema: './schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: 'require',
  },
  verbose: true,
  strict: false,
})

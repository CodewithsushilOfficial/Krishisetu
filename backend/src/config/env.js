import dotenv from 'dotenv';
import { z } from 'zod';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables from .env file (supports running from root or backend/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().optional().default(''),
  R2_ACCESS_KEY_ID: z.string().optional().default(''),
  R2_SECRET_ACCESS_KEY: z.string().optional().default(''),
  R2_BUCKET_NAME: z.string().optional().default('krishisetu-media'),
  R2_ENDPOINT: z.string().optional().default(''),
  R2_PUBLIC_URL: z.string().optional().default(''),

  // Auth
  JWT_SECRET: z.string().default('dev-jwt-secret-replace-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_ACCESS_SECRET: z.string().default('dev-jwt-access-secret-replace-in-production'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('dev-jwt-refresh-secret-replace-in-production'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS & Services
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  AI_SERVICE_URL: z.string().default('http://localhost:8000'),

  // Government of India Data.gov.in Mandi Integration
  DATA_GOV_API_KEY: z.string().default('579b464db66ec23bdd00000176fca4f55395433c5a5571d23e7ee633'),
  DATA_GOV_MANDI_RESOURCE_ID: z.string().default('35985678-0d79-46b4-9ed6-6f13308a1d24'),
  DATA_GOV_BASE_URL: z.string().default('https://api.data.gov.in/resource'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:');
  const formattedErrors = parsed.error.format();
  for (const [key, value] of Object.entries(formattedErrors)) {
    if (key !== '_errors' && value && value._errors) {
      console.error(`  - ${key}: ${value._errors.join(', ')}`);
    }
  }
  process.exit(1);
}

export const env = parsed.data;
export default env;

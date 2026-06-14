import { envSchema } from "@/lib/schemas";

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
  throw new Error(`Invalid environment configuration: ${missing}. Check VITE_* vars in Vercel.`);
}

const env = parsed.data;
const isProduction = env.VITE_PRODUCTION_STATUS === "true";

// Strip a trailing /api or / so callers can append their own path segments.
const normalize = (url) => url.replace(/\/api\/?$/, "").replace(/\/$/, "");

export const BackendUrl = normalize(isProduction ? env.VITE_BACKEND_URL_PROD : env.VITE_BACKEND_URL);
export const FrontendUrl = isProduction ? env.VITE_FRONTEND_URL_PROD : env.VITE_FRONTEND_URL;

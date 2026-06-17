import { z } from "zod";

// --- Environment ---
export const envSchema = z.object({
  VITE_PRODUCTION_STATUS: z.enum(["true", "false"]),
  VITE_BACKEND_URL: z.string().url(),
  VITE_BACKEND_URL_PROD: z.string().url(),
  VITE_FRONTEND_URL: z.string().url(),
  VITE_FRONTEND_URL_PROD: z.string().url(),
});

// --- Forms ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const createLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  redirectUrl: z
    .string()
    .min(1, "Long URL is required")
    .url("Must be a valid URL"),
  customUrl: z.string().optional(),
});

// --- API responses ---
export const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const authResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
  token: z.string(),
});

export const urlSchema = z.object({
  _id: z.string(),
  title: z.string(),
  shortUrl: z.string(),
  redirectUrl: z.string(),
  userId: z.string(),
  customUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const urlsSchema = z.array(urlSchema);

export const clickSchema = z.object({
  timestamp: z.string(),
  ip: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  deviceType: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  userAgent: z.string().nullable(),
});

export const analyticsSchema = z.object({
  totalClicks: z.number(),
  url: z.string(),
  shortUrl: z.string(),
  createdAt: z.string(),
  lastClickedAt: z.string().nullable(),
  clicksPerDay: z.record(z.string(), z.number()),
  clicks: z.array(clickSchema),
});

// --- Helpers ---
export const parseOrThrow = (schema, data, label) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const detail = result.error.issues
      .map((issue) => issue.path.join(".") + ": " + issue.message)
      .join("; ");
    throw new Error(`${label}: ${detail}`);
  }
  return result.data;
};

export const getFormErrors = (error) => {
  if (!(error instanceof z.ZodError)) return null;
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
};

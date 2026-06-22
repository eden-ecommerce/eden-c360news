import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { ALLOWED_ORIGIN, CORS_HEADERS } from "./lib/cors";

// ---------------------------------------------------------------------------
// Asset prefix — must be inlined here; next.config.ts runs in raw Node before
// TS path aliases (e.g. @lib/*) are resolved, so imports via @lib/constants
// silently return undefined and assetPrefix ends up unset.
// ---------------------------------------------------------------------------
const ASSET_PRODUCTION_ORIGIN = "https://eden-c360news.vercel.app/christian-news";

// On a Vercel preview deployment there is no eden.co.uk proxy, so point
// straight at the deployment's own URL to keep the preview iframe working.
const vercelPreviewUrl =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

// assetPrefix is only set in production; in development it must stay undefined
// so assets are served from the same local origin as the page.
const ASSET_BASE_URL =
  process.env.NODE_ENV === "production"
    ? (vercelPreviewUrl ?? ASSET_PRODUCTION_ORIGIN)
    : undefined;

const nextConfig: NextConfig = {
  // Expose SENTRY_DATASET to client bundles at build time (not a secret).
  env: {
    SENTRY_DATASET: process.env.SENTRY_DATASET ?? "",
  },
  experimental: {
    optimizePackageImports: ["@sentry/nextjs"],
  },
  transpilePackages: [
    "@algolia/client-common",
    // TEMPORARILY DISABLED: private @christian-360/* packages (unreachable
    // registry). Re-enable when the packages are wired back in.
    // "@christian-360/next-design",
    // "@christian-360/sanity",
  ],
  // ASSET_BASE_URL is undefined in development (see comment above), so this
  // safely applies only in production / preview builds.
  assetPrefix: ASSET_BASE_URL,
  // v0 iterates quickly — builds tolerate TS errors during dev.
  // Before deploy: run `pnpm predeploy` (ts-check + lint + build) and fix all errors.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "www.eden.co.uk" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: ALLOWED_ORIGIN },
          {
            key: "Access-Control-Allow-Methods",
            value: CORS_HEADERS["Access-Control-Allow-Methods"],
          },
          {
            key: "Access-Control-Allow-Headers",
            value: CORS_HEADERS["Access-Control-Allow-Headers"],
          },
        ],
      },
      // Security headers (CSP, HSTS, frame-ancestors) may be owned by the
      // Cloudflare Worker or Vercel edge — confirm with infra before enabling:
      // {
      //   source: "/:path*",
      //   headers: [
      //     { key: "X-Content-Type-Options", value: "nosniff" },
      //     { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      //   ],
      // },
    ];
  },
};

const hasSentryBuildCredentials =
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT &&
  process.env.SENTRY_AUTH_TOKEN;

export default hasSentryBuildCredentials
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      widenClientFileUpload: true,
      disableLogger: true,
      reactComponentAnnotation: {
        enabled: false,
      },
      bundleSizeOptimizations: {
        excludeDebugStatements: true,
        excludeTracing: true,
        excludeReplayIframe: true,
        excludeReplayShadowDom: true,
        excludeReplayWorker: true,
      },
    })
  : nextConfig;

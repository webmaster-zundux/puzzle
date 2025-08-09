import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { loadEnv } from "vite";
import { configDefaults, defaultExclude, defineConfig } from "vitest/config";

const testsExcludeRule = new Array().concat(defaultExclude, ["**/__e2e-tests__/**/*", "**/examples/**/*"]);

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (env.USE_BASIC_SSL_CERTS === "1") {
    console.log(`using self-signed ca certificate`);
  }

  return {
    base: typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/',
    plugins: [react()],
    server:
      env.USE_BASIC_SSL_CERTS === "1"
        ? {
            https: {
              key: readFileSync("./.ssl/localhost-key.pem"),
              cert: readFileSync("./.ssl/localhost.pem"),
            },
          }
        : undefined,
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTests"],
      exclude: testsExcludeRule,
      typecheck: {
        ...configDefaults.typecheck,
        exclude: testsExcludeRule,
      },
      mockReset: true,
      deps: {
        optimizer: {
          web: {
            enabled: true,
            include: ["vitest-canvas-mock"],
          },
        },
      },
      coverage: {
        provider: "istanbul",
      },
    },
  };
});

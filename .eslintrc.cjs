module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  ignorePatterns: [
    "dist",
    "coverage",
    ".eslintrc.cjs",
    "vite.config.ts",
    "vite-coverage-preview.config.ts",
    "scripts/*",
    "playwright.config.ts",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { project: true, tsconfigRootDir: "./" },
  plugins: [
    "react-refresh",
    "@typescript-eslint",
    "react-hooks",
    "jest-dom",
    "testing-library",
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/consistent-type-imports": [
      2,
      { fixStyle: "separate-type-imports" },
    ],
    "@typescript-eslint/no-restricted-imports": [
      2,
      {
        paths: [
          {
            name: "react-redux",
            importNames: ["useSelector", "useStore", "useDispatch"],
            message:
              "Please use pre-typed versions from `src/app/hooks.ts` instead.",
          },
        ],
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: false,
      },
    ],
    "prefer-const": "off",
  },
  overrides: [
    { files: ["*.{c,m,}{t,j}s", "*.{t,j}sx"] },
    {
      files: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:jest-dom/recommended", "plugin:testing-library/react"],
      env: { jest: true },
    },
  ],
};

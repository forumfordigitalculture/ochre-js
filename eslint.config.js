import antfu from "@antfu/eslint-config";
import pluginUnused from "eslint-plugin-unused-imports";

export default antfu({
  stylistic: false,
  plugins: {
    "unused-imports": pluginUnused,
  },
  markdown: false,
  typescript: {
    parserOptions: {
      tsconfigRootDir: import.meta.dir,
      project: "tsconfig.json",
    },
    overrides: {
      "ts/no-explicit-any": "error",
      "ts/no-dynamic-delete": "error",
      "ts/array-type": ["error", { default: "generic" }],
      "ts/consistent-type-definitions": ["error", "type"],
      "ts/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "ts/no-unused-vars": "off",
      "ts/switch-exhaustiveness-check": [
        "warn",
        { considerDefaultExhaustiveForUnions: true },
      ],
    },
  },
  unicorn: {
    allRecommended: true,
  },
  rules: {
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
        ignore: ["README.md", "CONTRIBUTING.md", "CHANGELOG.md", "LICENSE"],
      },
    ],
    "unicorn/better-regex": "error",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-null": "off",
    "unicorn/no-negated-condition": "off",
    "unicorn/no-thenable": "off",
    "unicorn/prefer-ternary": "off",
    "no-console": ["warn"],
    "antfu/no-top-level-await": ["off"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "jsonc/sort-keys": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "perfectionist/sort-imports": [
      "error",
      {
        groups: [
          "side-effect",
          "type",
          ["internal-type", "parent-type", "sibling-type", "index-type"],
          "builtin",
          "internal",
          "external",
          ["parent", "sibling", "index"],
          "object",
          "unknown",
        ],
        tsconfigRootDir: "tsconfig.json",
        newlinesBetween: "never",
        order: "asc",
        type: "natural",
      },
    ],
  },
});

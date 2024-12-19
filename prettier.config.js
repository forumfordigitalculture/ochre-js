/** @type {import('prettier').Config} */
const config = {
  semi: true,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  experimentalTernaries: true,
  plugins: ["prettier-plugin-organize-imports"],
};

export default config;

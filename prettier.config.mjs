/** @type {import("prettier").Config} */
const config = {
  endOfLine: "lf",
  printWidth: 80,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
